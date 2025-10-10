exports.up = async (knex) => {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
  await knex.raw(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'academy_visibility') THEN
        CREATE TYPE academy_visibility AS ENUM ('client', 'mentor', 'all');
      END IF;
    END
    $$;
  `);

  const parseJsonValue = (value) => {
    if (!value) return {};
    if (typeof value === 'object') return value;
    try {
      return JSON.parse(value);
    } catch {
      return {};
    }
  };

  const toPromptText = (prompt) => {
    if (typeof prompt === 'string') return prompt;
    if (prompt && typeof prompt === 'object') {
      return prompt.prompt || prompt.text || '';
    }
    return '';
  };

  const hasModulesTable = await knex.schema.hasTable('academy_modules');

  if (!hasModulesTable) {
    await knex.schema.createTable('academy_modules', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('title').notNullable();
      table.string('section').notNullable();
      table.jsonb('content').notNullable();
      table.integer('order_index').defaultTo(0);
      table
        .enu('visible_to', ['client', 'mentor', 'all'], {
          useNative: true,
          enumName: 'academy_visibility',
        })
        .defaultTo('all');
      table.integer('version').defaultTo(1);
      table.timestamps(true, true);
    });
  } else {
    if (!(await knex.schema.hasColumn('academy_modules', 'version'))) {
      await knex.schema.alterTable('academy_modules', (table) => {
        table.integer('version').defaultTo(1);
      });
    }

    await knex.raw(`
      ALTER TABLE academy_modules
      ALTER COLUMN title SET NOT NULL,
      ALTER COLUMN section SET NOT NULL,
      ALTER COLUMN content SET NOT NULL,
      ALTER COLUMN order_index SET DEFAULT 0,
      ALTER COLUMN visible_to SET DEFAULT 'all'
    `);
  }

  const hasWorkbookEntries = await knex.schema.hasTable('workbook_entries');

  if (!hasWorkbookEntries) {
    await knex.schema.createTable('workbook_entries', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table
        .uuid('user_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table
        .uuid('module_id')
        .notNullable()
        .references('id')
        .inTable('academy_modules')
        .onDelete('CASCADE');
      table.jsonb('responses').defaultTo(knex.raw("'{}'::jsonb"));
      table.jsonb('mentor_notes').defaultTo(knex.raw("'{}'::jsonb"));
      table.timestamps(true, true);
      table.unique(['user_id', 'module_id']);
      table.index(['module_id', 'user_id']);
    });
  } else {
    if (!(await knex.schema.hasColumn('workbook_entries', 'responses'))) {
      await knex.schema.alterTable('workbook_entries', (table) => {
        table.jsonb('responses').defaultTo(knex.raw("'{}'::jsonb"));
      });
    }

    await knex.raw(`
      UPDATE workbook_entries
      SET responses = '{}'::jsonb
      WHERE responses IS NULL
    `);

    if (!(await knex.schema.hasColumn('workbook_entries', 'mentor_notes'))) {
      await knex.schema.alterTable('workbook_entries', (table) => {
        table.jsonb('mentor_notes').defaultTo(knex.raw("'{}'::jsonb"));
      });
    }

    await knex.raw(`
      UPDATE workbook_entries
      SET mentor_notes = '{}'::jsonb
      WHERE mentor_notes IS NULL
    `);

    if (
      await knex.schema.hasColumn('workbook_entries', 'prompt') &&
      await knex.schema.hasColumn('workbook_entries', 'response')
    ) {
      await knex.raw(`
        UPDATE workbook_entries
        SET responses = jsonb_strip_nulls(
          jsonb_build_object(
            'prompt',
            prompt,
            'response',
            response
          )
        )
        WHERE (prompt IS NOT NULL OR response IS NOT NULL)
      `);
    }

    if (await knex.schema.hasColumn('workbook_entries', 'mentor_feedback')) {
      await knex.raw(`
        UPDATE workbook_entries
        SET mentor_notes = jsonb_strip_nulls(
          jsonb_build_object(
            'note',
            mentor_feedback
          )
        )
        WHERE mentor_feedback IS NOT NULL
      `);
    }

    const modules = await knex('academy_modules').select('id', 'content');
    const moduleMeta = new Map(
      modules.map((module) => {
        const content = parseJsonValue(module.content);
        const reflect = Array.isArray(content.reflect)
          ? content.reflect.map(toPromptText)
          : Array.isArray(content.prompts)
          ? content.prompts.map(toPromptText)
          : [];
        const journalPrompt = content.journal_prompt ? String(content.journal_prompt) : '';
        return [
          module.id,
          {
            reflectPrompts: reflect,
            journalPrompt,
          },
        ];
      })
    );

    const existingEntries = await knex('workbook_entries').select(
      'id',
      'user_id',
      'module_id',
      'responses',
      'mentor_notes',
      'prompt',
      'response',
      'mentor_feedback',
      'created_at',
      'updated_at'
    );

    const grouped = existingEntries.reduce((acc, entry) => {
      const key = `${entry.user_id}:${entry.module_id}`;
      if (!acc.has(key)) {
        acc.set(key, []);
      }
      acc.get(key).push(entry);
      return acc;
    }, new Map());

    for (const [, group] of grouped.entries()) {
      if (!group.length) continue;

      const sorted = [...group].sort((a, b) => {
        const dateA = new Date(a.updated_at || a.created_at || 0).getTime();
        const dateB = new Date(b.updated_at || b.created_at || 0).getTime();
        return dateB - dateA;
      });

      const primary = sorted[0];
      const duplicates = sorted.slice(1);
      const meta = moduleMeta.get(primary.module_id) || { reflectPrompts: [], journalPrompt: '' };
      const reflectPrompts = meta.reflectPrompts || [];
      const journalPrompt = meta.journalPrompt || '';

      const reflectAnswers = reflectPrompts.map((promptText) => {
        const match = group.find((entry) => entry.prompt === promptText);
        return match?.response ? String(match.response) : '';
      });

      const journalAnswer = journalPrompt
        ? String(group.find((entry) => entry.prompt === journalPrompt)?.response || '')
        : '';

      const entriesPayload = group
        .filter((entry) => entry.prompt || entry.response)
        .map((entry) => ({
          prompt: entry.prompt,
          response: entry.response,
        }));

      const total = reflectPrompts.length + (journalPrompt ? 1 : 0);
      const completed =
        reflectAnswers.filter((answer) => answer && answer.trim().length > 0).length +
        (journalPrompt && journalAnswer && journalAnswer.trim().length > 0 ? 1 : 0);
      const progressValue = total > 0 ? Math.min(1, completed / total) : null;

      const aggregatedResponses = {};
      if (reflectAnswers.length) {
        aggregatedResponses.reflectAnswers = reflectAnswers;
      }
      if (journalPrompt) {
        aggregatedResponses.journal_answer = journalAnswer;
      }
      if (entriesPayload.length) {
        aggregatedResponses.entries = entriesPayload;
      }
      if (progressValue !== null) {
        aggregatedResponses.progress = progressValue;
      }

      const existingNotes = parseJsonValue(primary.mentor_notes);
      const mentorFeedback = group.find((entry) => entry.mentor_feedback)?.mentor_feedback;
      const aggregatedNotes =
        mentorFeedback && mentorFeedback.trim().length > 0
          ? { note: mentorFeedback.trim() }
          : existingNotes;

      const createdAtDate = group.reduce((min, entry) => {
        if (!entry.created_at) return min;
        const date = new Date(entry.created_at);
        if (Number.isNaN(date.getTime())) return min;
        if (!min || date < min) return date;
        return min;
      }, null);

      const updatedAtDate = group.reduce((max, entry) => {
        if (!entry.updated_at) return max;
        const date = new Date(entry.updated_at);
        if (Number.isNaN(date.getTime())) return max;
        if (!max || date > max) return date;
        return max;
      }, null);

      await knex('workbook_entries')
        .where({ id: primary.id })
        .update({
          responses: aggregatedResponses,
          mentor_notes: aggregatedNotes,
          created_at: createdAtDate || primary.created_at,
          updated_at: updatedAtDate || primary.updated_at,
        });

      if (duplicates.length) {
        await knex('workbook_entries')
          .whereIn(
            'id',
            duplicates.map((entry) => entry.id)
          )
          .del();
      }
    }

    try {
      await knex.schema.alterTable('workbook_entries', (table) => {
        table.dropUnique(['user_id', 'module_id', 'prompt']);
      });
    } catch (error) {
      // constraint may not exist; ignore
    }

    try {
      await knex.schema.alterTable('workbook_entries', (table) => {
        table.unique(['user_id', 'module_id']);
      });
    } catch (error) {
      // unique already exists; ignore
    }

    if (await knex.schema.hasColumn('workbook_entries', 'prompt')) {
      await knex.schema.alterTable('workbook_entries', (table) => {
        table.dropColumn('prompt');
      });
    }

    if (await knex.schema.hasColumn('workbook_entries', 'response')) {
      await knex.schema.alterTable('workbook_entries', (table) => {
        table.dropColumn('response');
      });
    }

    if (await knex.schema.hasColumn('workbook_entries', 'mentor_feedback')) {
      await knex.schema.alterTable('workbook_entries', (table) => {
        table.dropColumn('mentor_feedback');
      });
    }
  }
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('workbook_entries');
  await knex.schema.dropTableIfExists('academy_modules');
  await knex.raw(`
    DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'academy_visibility') THEN
        DROP TYPE academy_visibility;
      END IF;
    END
    $$;
  `);
};

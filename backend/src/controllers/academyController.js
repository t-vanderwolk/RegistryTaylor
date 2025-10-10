const { v4: uuid } = require('uuid');
const db = require('../db/connection');

const normalizeRole = (role) => (role || '').toLowerCase();

const visibilityScopeForRole = (role) => {
  const normalized = normalizeRole(role);
  if (normalized === 'mentor') return ['mentor', 'all'];
  if (normalized === 'client') return ['client', 'all'];
  if (normalized === 'admin') return ['client', 'mentor', 'all'];
  return ['all'];
};

const parseJson = (value) => {
  if (!value) return {};
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
};

const serializeModule = (module) => ({
  ...module,
  content: parseJson(module.content),
});

const normalizeEntry = (entry) => {
  if (!entry) return null;
  return {
    ...entry,
    responses: parseJson(entry.responses),
    mentor_notes: parseJson(entry.mentor_notes),
  };
};

const extractReflectAnswers = (responses) => {
  if (!responses) return [];
  if (Array.isArray(responses.reflectAnswers)) return responses.reflectAnswers;
  if (Array.isArray(responses.reflect)) return responses.reflect;
  if (Array.isArray(responses.answers)) return responses.answers;
  if (Array.isArray(responses.entries)) return responses.entries;
  if (Array.isArray(responses.responses)) return responses.responses;
  return [];
};

const extractJournalAnswer = (responses) => {
  if (!responses) return '';
  return (
    responses.journal_answer ??
    responses.journalAnswer ??
    responses.user_answer ??
    responses.userAnswer ??
    responses.journal_prompt_answer ??
    responses.journalPromptAnswer ??
    ''
  );
};

const normalizeProgress = (value) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return null;
  if (value <= 1) {
    return Math.round(Math.max(0, Math.min(1, value)) * 100);
  }
  return Math.round(Math.max(0, Math.min(100, value)));
};

const computeProgressStats = (module, entry) => {
  const content = module.content || {};
  const totalReflect = Array.isArray(content.reflect) ? content.reflect.length : 0;
  const hasJournal = content.journal_prompt ? 1 : 0;
  const total = totalReflect + hasJournal;

  if (!entry) {
    return {
      totalPrompts: total,
      completedPrompts: 0,
      percent: 0,
    };
  }

  const responses = entry.responses || {};
  const reflectAnswers = extractReflectAnswers(responses).filter(
    (answer) => typeof answer === 'string' ? answer.trim().length > 0 : Boolean(answer),
  );
  const journalAnswer = extractJournalAnswer(responses);

  let completed = Math.min(reflectAnswers.length, totalReflect);
  if (hasJournal && journalAnswer && String(journalAnswer).trim().length > 0) {
    completed += 1;
  }

  let percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const progressOverride = normalizeProgress(responses.progress ?? responses.completion ?? responses.percent);
  if (progressOverride !== null) {
    percent = Math.max(percent, progressOverride);
  }

  return {
    totalPrompts: total,
    completedPrompts: completed,
    percent,
  };
};

const ensureMentorAssignment = async (mentorId, menteeId) => {
  const assignment = await db('mentor_assignments').where({ mentor_id: mentorId, client_id: menteeId }).first();
  if (!assignment) {
    const error = new Error('Mentor does not have access to this client workbook');
    error.status = 403;
    throw error;
  }
};

const groupEntriesByModule = (entries) =>
  entries.reduce((acc, item) => {
    const normalized = normalizeEntry(item);
    const bucket = acc.get(normalized.module_id) || [];
    bucket.push(normalized);
    acc.set(normalized.module_id, bucket);
    return acc;
  }, new Map());

exports.listModules = async (req, res, next) => {
  try {
    const roleScope = visibilityScopeForRole(req.user.role);
    const isMentor = normalizeRole(req.user.role) === 'mentor';
    const targetUserId = isMentor && req.query.menteeId ? req.query.menteeId : req.user.id;

    if (isMentor && req.query.menteeId) {
      await ensureMentorAssignment(req.user.id, req.query.menteeId);
    }

    const modules = await db('academy_modules')
      .whereIn('visible_to', roleScope)
      .orderBy('order_index', 'asc')
      .select('*');

    const workbookEntries = await db('workbook_entries').where({ user_id: targetUserId });
    const entriesByModule = groupEntriesByModule(workbookEntries);

    const data = modules.map((module) => {
      const serialized = serializeModule(module);
      const moduleEntries = entriesByModule.get(module.id) || [];
      const entry = moduleEntries[0] || null;
      const stats = computeProgressStats(serialized, entry);

      return {
        ...serialized,
        progress: stats.percent,
        totalPrompts: stats.totalPrompts,
        completedPrompts: stats.completedPrompts,
        entryCount: moduleEntries.length,
      };
    });

    res.json({ data });
  } catch (error) {
    next(error);
  }
};

exports.getModule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const roleScope = visibilityScopeForRole(req.user.role);
    const module = await db('academy_modules').where({ id }).first();

    if (!module || !roleScope.includes(module.visible_to)) {
      return res.status(404).json({ error: { message: 'Module not found' } });
    }

    const isMentor = normalizeRole(req.user.role) === 'mentor';
    const targetUserId = isMentor && req.query.menteeId ? req.query.menteeId : req.user.id;

    if (isMentor && req.query.menteeId) {
      await ensureMentorAssignment(req.user.id, req.query.menteeId);
    }

    const entry = await db('workbook_entries')
      .where({ module_id: id, user_id: targetUserId })
      .first();

    const serializedModule = serializeModule(module);
    const normalizedEntry = normalizeEntry(entry);
    const stats = computeProgressStats(serializedModule, normalizedEntry);

    res.json({
      data: {
        module: serializedModule,
        workbookEntry: normalizedEntry,
        progress: {
          percent: stats.percent,
          totalPrompts: stats.totalPrompts,
          completedPrompts: stats.completedPrompts,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getWorkbookEntry = async (req, res, next) => {
  try {
    const { moduleId } = req.params;
    const module = await db('academy_modules').where({ id: moduleId }).first();
    if (!module) {
      return res.status(404).json({ error: { message: 'Module not found' } });
    }

    const isMentor = normalizeRole(req.user.role) === 'mentor';
    const targetUserId = isMentor && req.query.menteeId ? req.query.menteeId : req.user.id;

    if (isMentor && req.query.menteeId) {
      await ensureMentorAssignment(req.user.id, req.query.menteeId);
    }

    const entry = await db('workbook_entries')
      .where({ module_id: moduleId, user_id: targetUserId })
      .first();

    res.json({ data: normalizeEntry(entry) });
  } catch (error) {
    next(error);
  }
};

exports.getWorkbookForUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const normalizedRole = normalizeRole(req.user.role);

    if (normalizedRole === 'mentor' && userId !== req.user.id) {
      await ensureMentorAssignment(req.user.id, userId);
    } else if (normalizedRole !== 'mentor' && normalizedRole !== 'admin' && userId !== req.user.id) {
      return res.status(403).json({ error: { message: 'Forbidden' } });
    }

    const modules = await db('academy_modules').orderBy('order_index', 'asc');
    const entries = await db('workbook_entries').where({ user_id: userId });
    const entriesByModule = groupEntriesByModule(entries);

    const data = modules.map((module) => {
      const serialized = serializeModule(module);
      const entry = (entriesByModule.get(module.id) || [])[0] || null;
      const stats = computeProgressStats(serialized, entry);

      return {
        module: serialized,
        workbookEntry: entry,
        progress: stats,
      };
    });

    res.json({ data });
  } catch (error) {
    next(error);
  }
};

exports.saveWorkbookEntry = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { moduleId, responses, mentorNotes } = req.body || {};

    if (!moduleId) {
      return res.status(400).json({ error: { message: 'moduleId is required' } });
    }

    const module = await db('academy_modules').where({ id: moduleId }).first();
    if (!module) {
      return res.status(404).json({ error: { message: 'Module not found' } });
    }

    const payloadResponses = responses !== undefined ? responses : {};
    const payloadNotes = mentorNotes !== undefined ? mentorNotes : {};

    const timestamp = new Date().toISOString();

    const insertValues = {
      id: uuid(),
      user_id: userId,
      module_id: moduleId,
      responses: payloadResponses,
      mentor_notes: payloadNotes,
      created_at: timestamp,
      updated_at: timestamp,
    };

    const updateValues = {
      updated_at: timestamp,
    };

    if (responses !== undefined) {
      updateValues.responses = payloadResponses;
    }

    if (mentorNotes !== undefined) {
      updateValues.mentor_notes = payloadNotes;
    }

    const [entry] = await db('workbook_entries')
      .insert(insertValues)
      .onConflict(['user_id', 'module_id'])
      .merge(updateValues)
      .returning('*');

    res.status(200).json({ data: normalizeEntry(entry) });
  } catch (error) {
    next(error);
  }
};

exports.updateMentorNotes = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { mentorNotes } = req.body || {};

    const entry = await db('workbook_entries').where({ id }).first();

    if (!entry) {
      return res.status(404).json({ error: { message: 'Workbook entry not found' } });
    }

    const normalizedRole = normalizeRole(req.user.role);

    if (normalizedRole === 'mentor') {
      await ensureMentorAssignment(req.user.id, entry.user_id);
    } else if (normalizedRole !== 'admin' && entry.user_id !== req.user.id) {
      return res.status(403).json({ error: { message: 'Forbidden' } });
    }

    const timestamp = new Date().toISOString();

    await db('workbook_entries')
      .where({ id })
      .update({
        mentor_notes: mentorNotes ?? {},
        updated_at: timestamp,
      });

    const updated = await db('workbook_entries').where({ id }).first();
    res.json({ data: normalizeEntry(updated) });
  } catch (error) {
    next(error);
  }
};

exports.listAssignedMentees = async (req, res, next) => {
  try {
    const normalizedRole = normalizeRole(req.user.role);
    if (normalizedRole !== 'mentor' && normalizedRole !== 'admin') {
      return res.status(403).json({ error: { message: 'Forbidden' } });
    }

    const mentorId =
      normalizedRole === 'admin' && req.query.mentorId ? req.query.mentorId : req.user.id;

    const assignments = await db('mentor_assignments as ma')
      .join('users as u', 'u.id', 'ma.client_id')
      .leftJoin('client_profiles as cp', 'cp.user_id', 'u.id')
      .select(
        'u.id',
        'u.name',
        'u.email',
        'u.phone',
        'cp.package_choice',
        'cp.due_date'
      )
      .where('ma.mentor_id', mentorId)
      .orderBy('u.name', 'asc');

    res.json({
      data: assignments.map((assignment) => ({
        id: assignment.id,
        name: assignment.name,
        email: assignment.email,
        phone: assignment.phone,
        packageChoice: assignment.package_choice,
        dueDate: assignment.due_date,
      })),
    });
  } catch (error) {
    next(error);
  }
};

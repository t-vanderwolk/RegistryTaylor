const db = require('../db/connection');

const mentorRoles = new Set(['mentor', 'admin']);

const toBoolean = (value) => Boolean(value);

const normaliseChecklist = (checklist = []) => {
  if (!Array.isArray(checklist)) return [];
  return checklist.map((item, index) => {
    if (typeof item === 'string') {
      return { id: `${index}`, label: item, completed: false };
    }
    const id = item.id || item.key || `${index}`;
    return {
      id,
      label: item.label || item.title || '',
      completed: Boolean(item.completed),
    };
  });
};

const mergeChecklistState = (moduleChecklist = [], progressChecklist = []) => {
  const byId = new Map(progressChecklist.map((item) => [item.id || item.label, item]));
  return normaliseChecklist(moduleChecklist).map((item) => {
    const saved = byId.get(item.id);
    if (!saved) return item;
    return {
      ...item,
      completed: Boolean(saved.completed),
      notes: saved.notes || item.notes,
    };
  });
};

const calculatePercent = ({ exploreCompleted, lectureCompleted, applyCompleted, journalEntry }) => {
  const steps = [
    exploreCompleted ? 1 : 0,
    lectureCompleted ? 1 : 0,
    applyCompleted ? 1 : 0,
    journalEntry && journalEntry.trim().length > 0 ? 1 : 0,
  ];
  const total = steps.reduce((acc, value) => acc + value, 0);
  return Math.min(100, Math.round((total / 4) * 100));
};

const pickTargetUserId = (req) => {
  const { userId } = req.query;
  if (userId && mentorRoles.has(req.user.role)) {
    return userId;
  }
  return req.user.id;
};

const serialiseModule = (module, progress) => {
  const checklist = mergeChecklistState(module.apply_checklist, progress?.checklist_state);
  const appliedComplete = checklist.length > 0 ? checklist.every((item) => item.completed) : progress?.apply_completed;

  return {
    id: module.id,
    slug: module.slug,
    title: module.title,
    subtitle: module.subtitle,
    category: module.category,
    registryFocus: module.registry_focus,
    estimatedMinutes: module.estimated_minutes,
    sortOrder: module.sort_order,
    isCore: module.is_core,
    overview: module.overview,
    lecture: module.lecture_content,
    journalPrompt: module.journal_prompt,
    checklist,
    progress: {
      exploreCompleted: Boolean(progress?.explore_completed),
      lectureCompleted: Boolean(progress?.lecture_completed),
      applyCompleted: Boolean(appliedComplete),
      journalEntry: progress?.journal_entry || '',
      journalUpdatedAt: progress?.journal_updated_at || null,
      percentComplete: progress?.percent_complete || 0,
      completed: Boolean(progress?.completed),
      completedAt: progress?.completed_at || null,
      lastViewedAt: progress?.last_viewed_at || null,
    },
  };
};

exports.listModules = async (req, res, next) => {
  try {
    const targetUserId = pickTargetUserId(req);
    const { limit } = req.query;

    const query = db('academy_modules').orderBy('sort_order', 'asc').orderBy('created_at', 'asc');
    if (limit) {
      const parsedLimit = Number(limit);
      if (!Number.isNaN(parsedLimit) && parsedLimit > 0) {
        query.limit(parsedLimit);
      }
    }
    const modules = await query;

    const moduleIds = modules.map((module) => module.id);
    const progressRows = moduleIds.length
      ? await db('academy_progress').where({ user_id: targetUserId }).whereIn('module_id', moduleIds)
      : [];

    const progressByModule = new Map(progressRows.map((row) => [row.module_id, row]));

    const data = modules.map((module) => {
      const progress = progressByModule.get(module.id);
      const serialised = serialiseModule(
        {
          ...module,
          overview: module.overview,
          lecture_content: '',
          journal_prompt: '',
        },
        progress
      );

      // Remove heavy fields for list response
      delete serialised.lecture;
      delete serialised.journalPrompt;

      return serialised;
    });

    res.json({
      data,
      meta: {
        userId: targetUserId,
        mentorView: targetUserId !== req.user.id,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getModule = async (req, res, next) => {
  try {
    const { moduleId } = req.params;
    const targetUserId = pickTargetUserId(req);

    const module = await db('academy_modules').where({ id: moduleId }).first();
    if (!module) {
      const notFound = new Error('Module not found');
      notFound.status = 404;
      throw notFound;
    }

    const progress =
      (await db('academy_progress').where({ user_id: targetUserId, module_id: moduleId }).first()) || null;

    const data = serialiseModule(module, progress);

    res.json({
      data,
      meta: {
        userId: targetUserId,
        mentorView: targetUserId !== req.user.id,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProgress = async (req, res, next) => {
  try {
    const { moduleId } = req.params;
    const targetUserId = mentorRoles.has(req.user.role) && req.body.userId ? req.body.userId : req.user.id;

    const module = await db('academy_modules').where({ id: moduleId }).first();
    if (!module) {
      const notFound = new Error('Module not found');
      notFound.status = 404;
      throw notFound;
    }

    const payload = req.body || {};

    const exploreCompleted = toBoolean(payload.exploreCompleted);
    const lectureCompleted = toBoolean(payload.lectureCompleted);
    const checklist = payload.checklist || [];
    const journalEntry = payload.journalEntry || '';

    const checklistState = mergeChecklistState(module.apply_checklist, checklist).map((item) => ({
      id: item.id,
      label: item.label,
      completed: Boolean(item.completed),
      notes: item.notes || null,
    }));
    const applyCompleted = checklistState.length
      ? checklistState.every((item) => item.completed)
      : toBoolean(payload.applyCompleted);

    const percentComplete = calculatePercent({
      exploreCompleted,
      lectureCompleted,
      applyCompleted,
      journalEntry,
    });

    const completed = percentComplete === 100;
    const now = db.fn.now();

    const existing = await db('academy_progress')
      .where({ user_id: targetUserId, module_id: moduleId })
      .first();

    let saved;
    if (existing) {
      const [updated] = await db('academy_progress')
        .where({ id: existing.id })
        .update(
          {
            explore_completed: exploreCompleted,
            lecture_completed: lectureCompleted,
            apply_completed: applyCompleted,
            journal_entry: journalEntry,
            journal_updated_at: journalEntry ? now : existing.journal_updated_at,
            checklist_state: db.raw('?', [JSON.stringify(checklistState)]),
            percent_complete: percentComplete,
            completed,
            completed_at: completed ? now : existing.completed_at,
            last_viewed_at: now,
            updated_at: now,
          }
        )
        .returning('*');
      saved = updated;
    } else {
      const [created] = await db('academy_progress')
        .insert({
          user_id: targetUserId,
          module_id: moduleId,
          explore_completed: exploreCompleted,
          lecture_completed: lectureCompleted,
          apply_completed: applyCompleted,
          journal_entry: journalEntry,
          journal_updated_at: journalEntry ? now : null,
          checklist_state: db.raw('?', [JSON.stringify(checklistState)]),
          percent_complete: percentComplete,
          completed,
          completed_at: completed ? now : null,
          last_viewed_at: now,
        })
        .returning('*');
      saved = created;
    }

    // Update mentor eligibility metrics for clients
    const [{ count: totalCoreRaw }] = await db('academy_modules')
      .where({ is_core: true })
      .count({ count: '*' });
    const totalCore = Number(totalCoreRaw || 0);

    const [{ count: completedCoreRaw }] = await db('academy_progress as ap')
      .join('academy_modules as m', 'm.id', 'ap.module_id')
      .where('ap.user_id', targetUserId)
      .andWhere('m.is_core', true)
      .andWhere('ap.completed', true)
      .count({ count: '*' });
    const completedCore = Number(completedCoreRaw || 0);

    let mentorEligible = false;

    if (totalCore > 0) {
      mentorEligible = completedCore >= totalCore;
    }

    const profile = await db('client_profiles').where({ user_id: targetUserId }).first();
    if (profile) {
      const updatePayload = {
        core_modules_completed: completedCore,
        updated_at: now,
      };

      if (mentorEligible && !profile.mentor_eligible) {
        updatePayload.mentor_eligible = true;
        updatePayload.mentor_eligible_at = now;
      } else if (!mentorEligible && profile.mentor_eligible) {
        updatePayload.mentor_eligible = false;
        updatePayload.mentor_eligible_at = null;
      }

      await db('client_profiles').where({ user_id: targetUserId }).update(updatePayload);
    }

    const data = serialiseModule(module, saved);

    res.json({
      data,
      meta: {
        mentorEligible,
        completedCore,
        totalCore,
      },
    });
  } catch (error) {
    next(error);
  }
};

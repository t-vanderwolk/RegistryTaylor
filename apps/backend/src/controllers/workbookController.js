const workbookService = require('../services/workbookService');

const canAccessMember = (requestingUser, targetMemberId) => {
  if (!requestingUser) return false;
  return requestingUser.id === targetMemberId;
};

exports.listEntries = async (req, res, next) => {
  try {
    const { memberId } = req.params;
    if (!memberId) {
      return res.status(400).json({ error: { message: 'memberId is required' } });
    }

    if (!canAccessMember(req.user, memberId)) {
      return res.status(403).json({ error: { message: 'Not authorised to view these workbook entries' } });
    }

    const entries = await workbookService.getEntriesByMember(memberId);
    return res.json({ entries });
  } catch (error) {
    return next(error);
  }
};

exports.createOrUpdateEntry = async (req, res, next) => {
  try {
    const { moduleSlug, content, shared } = req.body || {};
    if (!moduleSlug) {
      return res.status(400).json({ error: { message: 'moduleSlug is required' } });
    }

    if (!content) {
      return res.status(400).json({ error: { message: 'content is required' } });
    }

    const entry = await workbookService.upsertWorkbookEntry(req.user.id, moduleSlug, content, Boolean(shared));
    return res.status(201).json({ entry });
  } catch (error) {
    return next(error);
  }
};

exports.getEntryForModule = async (req, res, next) => {
  try {
    const { slug } = req.params;
    if (!slug) {
      return res.status(400).json({ error: { message: 'module slug is required' } });
    }

    const entry = await workbookService.getEntryByMemberAndModule(req.user.id, slug);
    return res.json({ entry });
  } catch (error) {
    return next(error);
  }
};

exports.toggleShare = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { shared } = req.body || {};
    if (!id) {
      return res.status(400).json({ error: { message: 'id is required' } });
    }

    if (typeof shared !== 'boolean') {
      return res.status(400).json({ error: { message: 'shared must be provided as boolean' } });
    }

    const existing = await workbookService.getEntryById(id);
    if (!existing) {
      return res.status(404).json({ error: { message: 'Workbook entry not found' } });
    }

    if (!canAccessMember(req.user, existing.memberId)) {
      return res.status(403).json({ error: { message: 'Not authorised to update this workbook entry' } });
    }

    const updated = await workbookService.toggleShare(id, shared);
    return res.json({ entry: updated });
  } catch (error) {
    return next(error);
  }
};

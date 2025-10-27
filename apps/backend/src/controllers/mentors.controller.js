const db = require('../db/connection');

const parseJsonColumn = (value) => {
  if (Array.isArray(value) || (value && typeof value === 'object')) {
    return value;
  }
  if (!value) return [];
  try {
    return JSON.parse(value);
  } catch (error) {
    return [];
  }
};

const baseMentorQuery = () =>
  db('mentors as m')
    .join('users as u', 'm.user_id', 'u.id')
    .select(
      'm.id as mentor_id',
      'm.user_id',
      'm.profile',
      'm.specialties',
      'm.availability',
      'm.status',
      'm.created_at as mentor_created_at',
      'm.updated_at as mentor_updated_at',
      'u.name',
      'u.email',
      'u.invite_status',
      'u.role',
    );

const mapMentor = (record, options = {}) => {
  if (!record) return null;
  const payload = {
    id: record.mentor_id,
    userId: record.user_id,
    name: record.name,
    profile: record.profile,
    specialties: parseJsonColumn(record.specialties),
    availability: parseJsonColumn(record.availability),
    status: record.status,
    joinedAt: record.mentor_created_at,
    updatedAt: record.mentor_updated_at,
  };

  if (options.includeContact) {
    payload.contact = { email: record.email };
  }

  if (options.includeInviteStatus) {
    payload.inviteStatus = record.invite_status;
  }

  return payload;
};

exports.listMentors = async (req, res, next) => {
  try {
    const requesterRole = req.user?.role || 'guest';
    const statusFilter = req.query.status || (requesterRole === 'admin' ? null : 'active');
    const specialtyFilter = req.query.specialty?.toLowerCase();

    let query = baseMentorQuery();
    if (statusFilter) {
      query = query.where('m.status', statusFilter);
    }

    const records = await query.orderBy('u.name');

    const data = records
      .map((record) => mapMentor(record, { includeContact: requesterRole === 'admin' }))
      .filter((mentor) => {
        if (!specialtyFilter) return true;
        return mentor.specialties.some(
          (tag) => typeof tag === 'string' && tag.toLowerCase() === specialtyFilter,
        );
      });

    res.json({ data });
  } catch (error) {
    next(error);
  }
};

exports.getMentorById = async (req, res, next) => {
  try {
    const requesterRole = req.user?.role || 'guest';

    const record = await baseMentorQuery().where('m.id', req.params.id).first();
    if (!record) {
      return res.status(404).json({ error: { message: 'Mentor not found' } });
    }

    if (requesterRole !== 'admin' && record.status !== 'active') {
      return res.status(404).json({ error: { message: 'Mentor not found' } });
    }

    const data = mapMentor(record, {
      includeContact: requesterRole === 'admin',
      includeInviteStatus: requesterRole === 'admin',
    });

    res.json({ data });
  } catch (error) {
    next(error);
  }
};

exports.getMyMentorProfile = async (req, res, next) => {
  try {
    const record = await baseMentorQuery().where('m.user_id', req.user.id).first();
    if (!record) {
      return res.status(404).json({ error: { message: 'Mentor profile not found' } });
    }

    const isAdmin = req.user.role === 'admin';
    const includeContact = isAdmin || req.user.role === 'mentor';

    res.json({
      data: mapMentor(record, {
        includeContact,
        includeInviteStatus: isAdmin,
      }),
    });
  } catch (error) {
    next(error);
  }
};

exports.updateMyMentorProfile = async (req, res, next) => {
  try {
    const { profile, specialties, availability, status } = req.body;

    const updates = {};

    if (profile !== undefined) {
      if (typeof profile !== 'string' || profile.trim().length < 20) {
        return res.status(400).json({
          error: { message: 'Profile must be a descriptive string (min 20 characters).' },
        });
      }
      updates.profile = profile.trim();
    }

    if (specialties !== undefined) {
      if (!Array.isArray(specialties) || specialties.some((tag) => typeof tag !== 'string')) {
        return res.status(400).json({ error: { message: 'Specialties must be an array of strings.' } });
      }
      updates.specialties = JSON.stringify(specialties);
    }

    if (availability !== undefined) {
      if (!Array.isArray(availability)) {
        return res.status(400).json({ error: { message: 'Availability must be an array.' } });
      }
      updates.availability = JSON.stringify(availability);
    }

    if (status !== undefined) {
      if (!['active', 'pending', 'alum'].includes(status)) {
        return res.status(400).json({ error: { message: 'Invalid mentor status supplied.' } });
      }
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: { message: 'Only admins can change mentor status.' } });
      }
      updates.status = status;
    }

    if (!Object.keys(updates).length) {
      return res.status(400).json({ error: { message: 'No updates supplied.' } });
    }

    const [updated] = await db('mentors')
      .where({ user_id: req.user.id })
      .update({ ...updates, updated_at: db.fn.now() })
      .returning('*');

    if (!updated) {
      return res.status(404).json({ error: { message: 'Mentor profile not found' } });
    }

    const record = await baseMentorQuery().where('m.id', updated.id).first();

    res.json({
      data: mapMentor(record, {
        includeContact: true,
        includeInviteStatus: req.user.role === 'admin',
      }),
    });
  } catch (error) {
    next(error);
  }
};

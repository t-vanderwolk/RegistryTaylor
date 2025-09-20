const db = require('../db/connection');
const { normalizeEmail } = require('../utils/crypto');

exports.createProfile = async (req, res, next) => {
  try {
    const {
      name,
      email,
      role = 'client',
      preferred_mentor,
      package_choice,
      due_date,
      notes,
    } = req.body;

    if (!name || !email) {
      throw Object.assign(new Error('Name and email are required'), { status: 400 });
    }

    if (!['client', 'mentor'].includes(role)) {
      throw Object.assign(new Error('Only mentor or client requests supported'), { status: 400 });
    }

    const code = `${role === 'client' ? 'CLIENT' : 'MENTOR'}-${Math.random()
      .toString(36)
      .slice(2, 8)
      .toUpperCase()}`;

    await db('invite_codes')
      .insert({
        code,
        role,
        assigned_name: name,
        assigned_email: normalizeEmail(email),
        single_use: true,
        metadata: {
          preferred_mentor: preferred_mentor || null,
          package_choice: package_choice || null,
          due_date: due_date || null,
          notes: notes || null,
        },
      })
      .onConflict('code')
      .merge();

    res.status(201).json({
      data: {
        message: 'Thank you! A concierge will reach out to finalize your invite.',
        invite_preview: code,
        requested_role: role,
        preferred_mentor: preferred_mentor || null,
        package_choice: package_choice || null,
        due_date: due_date || null,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getMyProfile = async (req, res, next) => {
  try {
    const user = req.user;

    const baseProfile = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      zip_code: user.zip_code,
    };

    if (user.role === 'client') {
      const profile = await db('client_profiles').where({ user_id: user.id }).first();
      return res.json({ data: { ...baseProfile, profile } });
    }

    if (user.role === 'mentor') {
      const profile = await db('mentor_profiles').where({ user_id: user.id }).first();
      return res.json({ data: { ...baseProfile, profile } });
    }

    return res.json({ data: baseProfile });
  } catch (error) {
    next(error);
  }
};

exports.updateMyProfile = async (req, res, next) => {
  const trx = await db.transaction();
  try {
    const userId = req.user.id;
    const { name, phone, zip_code, profile = {} } = req.body;

    if (name || phone || zip_code) {
      await trx('users').where({ id: userId }).update({
        ...(name ? { name } : {}),
        ...(phone ? { phone } : {}),
        ...(zip_code ? { zip_code } : {}),
        updated_at: trx.fn.now(),
      });
    }

    if (req.user.role === 'client') {
      const payload = {};
      const allowedKeys = [
        'parent_one_name',
        'parent_two_name',
        'baby_name',
        'baby_gender',
        'due_date',
        'package_choice',
        'mentor_preference',
      ];
      allowedKeys.forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(profile, key)) {
          payload[key] = profile[key];
        }
      });

      if (Object.keys(payload).length) {
        await trx('client_profiles')
          .insert({ user_id: userId, ...payload })
          .onConflict('user_id')
          .merge({ ...payload, updated_at: trx.fn.now() });
      }
    }

    if (req.user.role === 'mentor') {
      const payload = {};
      const allowedKeys = ['specialty', 'bio', 'availability', 'max_clients', 'certifications'];
      allowedKeys.forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(profile, key)) {
          payload[key] = profile[key];
        }
      });

      if (Object.keys(payload).length) {
        const insertPayload = {
          user_id: userId,
          specialty: payload.specialty || null,
          bio: payload.bio || null,
          availability: payload.availability || null,
          max_clients: payload.max_clients || 5,
          certifications: payload.certifications
            ? JSON.stringify(payload.certifications)
            : JSON.stringify([]),
        };

        await trx('mentor_profiles')
          .insert(insertPayload)
          .onConflict('user_id')
          .merge({
            specialty: insertPayload.specialty,
            bio: insertPayload.bio,
            availability: insertPayload.availability,
            max_clients: insertPayload.max_clients,
            certifications: insertPayload.certifications,
            updated_at: trx.fn.now(),
          });
      }
    }

    await trx.commit();

    res.json({ data: { updated: true } });
  } catch (error) {
    await trx.rollback();
    next(error);
  }
};

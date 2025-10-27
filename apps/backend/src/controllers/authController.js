const { v4: uuid } = require('uuid');
const db = require('../db/connection');
const { hashPassword, comparePassword, normalizeEmail } = require('../utils/crypto');
const { signToken } = require('../utils/token');

const ensureInviteValid = (invite, email) => {
  if (!invite) {
    const error = new Error('Invite code not found');
    error.status = 400;
    throw error;
  }

  if (invite.used_at) {
    const error = new Error('Invite already used');
    error.status = 400;
    throw error;
  }

  if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
    const error = new Error('Invite has expired');
    error.status = 400;
    throw error;
  }

  if (email && invite.assigned_email && normalizeEmail(invite.assigned_email) !== normalizeEmail(email)) {
    const error = new Error('Invite is not assigned to this email');
    error.status = 403;
    throw error;
  }
};

const parseMetadata = (value) => {
  if (!value) return {};
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
};

const upsertProfile = async (trx, role, userId, profile = {}) => {
  if (role === 'mentor') {
    await trx('mentor_profiles').insert({
      user_id: userId,
      specialty: profile.specialty || 'Concierge mentor',
      bio: profile.bio || null,
      availability: profile.availability || null,
      max_clients: profile.max_clients || 5,
      certifications: JSON.stringify(profile.certifications || []),
    });
  }

  if (role === 'client') {
    await trx('client_profiles').insert({
      user_id: userId,
      parent_one_name: profile.parent_one_name || null,
      parent_two_name: profile.parent_two_name || null,
      baby_name: profile.baby_name || null,
      baby_gender: profile.baby_gender || null,
      due_date: profile.due_date || null,
      package_choice: profile.package_choice || null,
      mentor_preference: profile.mentor_preference || null,
    });
  }
};

exports.registerWithInvite = async (req, res, next) => {
  const trx = await db.transaction();
  try {
    const { code, name, email, password, phone, zip_code, profile } = req.body;

    if (!code || !name || !email || !password) {
      throw Object.assign(new Error('Missing required fields'), { status: 400 });
    }

    const normalizedEmail = normalizeEmail(email);
    const normalizedCode = code.trim().toUpperCase();
    const invite = await trx('invite_codes')
      .whereRaw('UPPER(code) = ?', normalizedCode)
      .first();
    ensureInviteValid(invite, normalizedEmail);

    const existing = await trx('users').whereRaw('LOWER(email) = ?', normalizedEmail).first();
    if (existing) {
      throw Object.assign(new Error('An account already exists for this email'), { status: 409 });
    }

    const userId = uuid();
    const passwordHash = await hashPassword(password);

    await trx('users').insert({
      id: userId,
      name,
      email: normalizedEmail,
      password_hash: passwordHash,
      role: invite.role,
      phone: phone || null,
      zip_code: zip_code || null,
    });

    await upsertProfile(trx, invite.role, userId, profile);

    await trx('invite_codes')
      .where({ code: invite.code })
      .update({ used_at: trx.fn.now(), used_by_user_id: userId });

    await trx.commit();

    const token = signToken({ sub: userId, role: invite.role });

    res.status(201).json({
      data: {
        token,
        user: {
          id: userId,
          name,
          email: normalizedEmail,
          role: invite.role,
        },
      },
    });
  } catch (error) {
    await trx.rollback();
    next(error);
  }
};

exports.verifyInvite = async (req, res, next) => {
  try {
    const rawCode = req.params.code;
    if (!rawCode) {
      throw Object.assign(new Error('Invite code is required'), { status: 400 });
    }

    const code = rawCode.trim().toUpperCase();
    if (!code) {
      throw Object.assign(new Error('Invite code is required'), { status: 400 });
    }

    const invite = await db('invite_codes')
      .whereRaw('UPPER(code) = ?', code)
      .first();

    ensureInviteValid(invite);

    res.json({
      data: {
        code: invite.code,
        role: invite.role,
        assigned_email: invite.assigned_email,
        assigned_name: invite.assigned_name,
        metadata: parseMetadata(invite.metadata),
        single_use: invite.single_use,
        expires_at: invite.expires_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw Object.assign(new Error('Email and password required'), { status: 400 });
    }

    const user = await db('users')
      .whereRaw('LOWER(email) = ?', normalizeEmail(email))
      .first();

    if (!user || !(await comparePassword(password, user.password_hash))) {
      throw Object.assign(new Error('Invalid credentials'), { status: 401 });
    }

    if (!user.active) {
      throw Object.assign(new Error('Account is inactive'), { status: 403 });
    }

    const token = signToken({ sub: user.id, role: user.role });

    res.status(200).json({
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

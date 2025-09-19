const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const db = require('../db/connection');
const logger = require('../utils/logger');
const { issueToken } = require('../utils/token');

const INVITE_TTL_DAYS = 14;

const hashInviteCode = async (code) => {
  const salt = process.env.INVITE_SALT || '';
  return bcrypt.hash(code + salt, 10);
};

const verifyInviteCode = async (code, hashed) => {
  const salt = process.env.INVITE_SALT || '';
  return bcrypt.compare(code + salt, hashed);
};

exports.requestInvite = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    if (!email) {
      return res.status(400).json({ error: { message: 'Email is required' } });
    }

    const inviteCode = uuidv4().split('-')[0].toUpperCase();
    const hashedCode = await hashInviteCode(inviteCode);

    const existingUser = await db('users').where({ email }).first();
    if (existingUser) {
      return res.status(409).json({ error: { message: 'Email already registered' } });
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + INVITE_TTL_DAYS);

    await db('invites')
      .insert({
        email,
        name,
        invite_code: hashedCode,
        expires_at: expiresAt,
        status: 'pending',
      })
      .onConflict('email')
      .merge({ invite_code: hashedCode, status: 'pending', expires_at: expiresAt });

    logger.info('Invite requested', { email });

    res.status(202).json({
      data: {
        message: 'Invite request received. A concierge will review shortly.',
        previewCode: inviteCode,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.registerWithInvite = async (req, res, next) => {
  try {
    const { email, name, password, inviteCode, packageSelected } = req.body;
    if (!email || !password || !inviteCode) {
      return res.status(400).json({ error: { message: 'Missing required fields' } });
    }

    const invite = await db('invites').where({ email }).first();
    if (!invite || invite.status !== 'pending') {
      return res.status(400).json({ error: { message: 'Invite not found or already used' } });
    }

    if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
      return res.status(400).json({ error: { message: 'Invite has expired' } });
    }

    const codeMatches = await verifyInviteCode(inviteCode, invite.invite_code);
    if (!codeMatches) {
      return res.status(401).json({ error: { message: 'Invalid invite code' } });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const insertedUser = await db('users')
      .insert({
        email,
        name,
        password_hash: passwordHash,
        role: 'member',
        invite_status: 'approved',
        package_selected: packageSelected || null,
        nda_signed: false,
      })
      .returning(['id', 'name', 'email', 'role', 'package_selected']);

    await db('invites').where({ id: invite.id }).update({ status: 'claimed' });

    const user = insertedUser[0];
    const token = issueToken({ id: user.id, role: user.role, email: user.email });

    res.status(201).json({
      data: {
        user,
        token,
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
      return res.status(400).json({ error: { message: 'Email and password are required' } });
    }

    const user = await db('users').where({ email }).first();
    if (!user || !user.password_hash) {
      return res.status(401).json({ error: { message: 'Invalid credentials' } });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: { message: 'Invalid credentials' } });
    }

    const token = issueToken({ id: user.id, role: user.role, email: user.email });
    res.json({
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          package_selected: user.package_selected,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.profile = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: { message: 'Authentication required' } });
    }

    const user = await db('users')
      .where({ id: req.user.id })
      .select('id', 'name', 'email', 'role', 'invite_status', 'nda_signed', 'package_selected')
      .first();

    if (!user) {
      return res.status(404).json({ error: { message: 'User not found' } });
    }

    res.json({ data: user });
  } catch (error) {
    next(error);
  }
};

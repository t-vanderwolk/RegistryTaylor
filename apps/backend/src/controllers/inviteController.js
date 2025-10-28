const { randomBytes } = require('crypto');
const { UserRole } = require('@prisma/client');
const prisma = require('../db/prisma');

const DEFAULT_ROLE = UserRole.MEMBER;

const generateCode = () => randomBytes(4).toString('hex').toUpperCase();

const normaliseRole = (value) => {
  if (!value) {
    return DEFAULT_ROLE;
  }

  const candidate = value.toString().toUpperCase();
  if (Object.values(UserRole).includes(candidate)) {
    return candidate;
  }

  return DEFAULT_ROLE;
};

exports.createInvite = async (req, res, next) => {
  try {
    const { email, role, name, message, code } = req.body || {};

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const invite = await prisma.invite.create({
      data: {
        email: email.toLowerCase(),
        role: normaliseRole(role),
        name: name || null,
        message: message || null,
        code: (code || generateCode()).toUpperCase(),
      },
    });

    res.status(201).json(invite);
  } catch (error) {
    next(error);
  }
};

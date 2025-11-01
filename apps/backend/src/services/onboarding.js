const bcrypt = require('bcryptjs');
const prisma = require('../db/prisma');

const AFFILIATE_PARAM = '_j';
const AFFILIATE_ID = '4496818';

function generateInviteCode() {
  const random = Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5);
  return `TMB-${random.padEnd(5, '0')}`;
}

function ensureAffiliate(url) {
  if (!url) return url;
  try {
    const target = new URL(url);
    if (target.hostname.toLowerCase().includes('macrobaby.com') && !target.searchParams.has(AFFILIATE_PARAM)) {
      target.searchParams.set(AFFILIATE_PARAM, AFFILIATE_ID);
    }
    return target.toString();
  } catch {
    return url;
  }
}

async function acceptInvite({ code, password, name }) {
  if (!code || typeof code !== 'string') {
    const error = new Error('Invite code is required');
    error.statusCode = 400;
    throw error;
  }

  if (!password || password.length < 6) {
    const error = new Error('Password must be at least 6 characters');
    error.statusCode = 400;
    throw error;
  }

  const invite = await prisma.invite.findUnique({
    where: { code: code.toUpperCase() },
    include: {
      questionnaire: true,
      profile: true,
    },
  });

  if (!invite) {
    const error = new Error('Invite not found');
    error.statusCode = 404;
    throw error;
  }

  if (invite.acceptedAt) {
    const error = new Error('Invite already accepted');
    error.statusCode = 400;
    throw error;
  }

  const existingUser = await prisma.user.findUnique({ where: { email: invite.email } });
  if (existingUser) {
    const error = new Error('A user already exists for this invite email');
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.$transaction(async (tx) => {
    const createdUser = await tx.user.create({
      data: {
        email: invite.email,
        name: name || invite.name,
        role: invite.role,
        passwordHash,
      },
    });

    await tx.invite.update({
      where: { id: invite.id },
      data: {
        acceptedAt: new Date(),
        acceptedById: createdUser.id,
      },
    });

    if (invite.questionnaire) {
      await tx.questionnaire.update({
        where: { id: invite.questionnaire.id },
        data: { userId: createdUser.id },
      });
    }

    if (invite.profile) {
      await tx.profile.update({
        where: { id: invite.profile.id },
        data: { userId: createdUser.id },
      });
    }

    return createdUser;
  });

  return user;
}

module.exports = {
  generateInviteCode,
  acceptInvite,
  ensureAffiliate,
};

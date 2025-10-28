const express = require('express');
const prisma = require('../../../db/prisma');
const asyncHandler = require('../../../utils/asyncHandler');
const { optionalUser, requireUser } = require('../../../middleware/auth');

const router = express.Router();

function normalizeJourneys(journeys) {
  if (Array.isArray(journeys)) {
    return journeys.map((journey) => String(journey));
  }
  if (typeof journeys === 'string') {
    return journeys.split(',').map((entry) => entry.trim());
  }
  return [];
}

router.post(
  '/submit',
  optionalUser,
  asyncHandler(async (req, res) => {
    const { code, preferredName, dueDate, journeys, householdNotes, contactPreference, availability } = req.body || {};

    let inviteRecord = null;
    if (!req.user && !code) {
      return res.status(400).json({ error: { message: 'Invite code is required when not authenticated' } });
    }

    if (code) {
      inviteRecord = await prisma.invite.findUnique({
        where: { code: code.toUpperCase() },
      });
      if (!inviteRecord) {
        return res.status(404).json({ error: { message: 'Invite not found' } });
      }
    }

    const payload = {
      preferredName: preferredName || null,
      dueDate: dueDate ? new Date(dueDate) : null,
      journeys: normalizeJourneys(journeys),
      householdNotes: householdNotes || null,
      contactPreference: contactPreference || null,
      availability: availability || null,
    };

    let questionnaire;
    if (req.user) {
      questionnaire = await prisma.questionnaire.upsert({
        where: { userId: req.user.id },
        update: {
          ...payload,
          inviteId: inviteRecord ? inviteRecord.id : undefined,
        },
        create: {
          ...payload,
          userId: req.user.id,
          inviteId: inviteRecord ? inviteRecord.id : null,
        },
      });
    } else {
      questionnaire = await prisma.questionnaire.upsert({
        where: { inviteId: inviteRecord.id },
        update: payload,
        create: {
          ...payload,
          inviteId: inviteRecord.id,
        },
      });
    }

    return res.status(201).json({ questionnaire });
  })
);

router.get(
  '/me',
  requireUser,
  asyncHandler(async (req, res) => {
    const questionnaire = await prisma.questionnaire.findUnique({
      where: { userId: req.user.id },
    });

    if (!questionnaire) {
      return res.status(404).json({ error: { message: 'No questionnaire on file' } });
    }

    return res.json({ questionnaire });
  })
);

module.exports = router;

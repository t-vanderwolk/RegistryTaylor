const db = require('../db/connection');
const logger = require('../utils/logger');
const { normalizeEmail } = require('../utils/crypto');

const trimOrNull = (value) => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
};

exports.create = async (req, res, next) => {
  try {
    const name = trimOrNull(req.body?.name);
    const email = trimOrNull(req.body?.email);
    const phone = trimOrNull(req.body?.phone);
    const dueDate = trimOrNull(req.body?.due_date || req.body?.dueDate);
    const message = trimOrNull(req.body?.message);

    if (!name || !email || !message) {
      return res.status(400).json({
        ok: false,
        fieldErrors: {
          ...(name ? {} : { name: 'Please share your name so we know who to reply to.' }),
          ...(email ? {} : { email: 'A reply-to email helps us follow up personally.' }),
          ...(message ? {} : { message: 'Tell us a little about what you need so we can help.' }),
        },
      });
    }

    const [record] = await db('contact_messages')
      .insert({
        name,
        email: normalizeEmail(email),
        phone,
        due_date: dueDate,
        message,
      })
      .returning('*');

    if (process.env.CONTACT_FORWARD_EMAIL) {
      logger.info('Contact request captured for follow-up', {
        forwardTo: process.env.CONTACT_FORWARD_EMAIL,
        contactId: record.id,
      });
    }

    return res.status(201).json({
      ok: true,
      data: record,
      message: 'Thank you! Taylor will be in touch within one business day.',
    });
  } catch (error) {
    next(error);
  }
};

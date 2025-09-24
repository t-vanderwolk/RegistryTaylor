const { normalizeEmail } = require('../utils/crypto');
const db = require('../db/connection');
const logger = require('../utils/logger');
const { sendInviteEmail, isEmailConfigured } = require('../utils/email');

const generateInviteCode = (prefix = 'CLT') =>
  `${prefix}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

exports.create = async (req, res, next) => {
  try {
    const { name, email, zip_code, package_choice, requested_role = 'client' } = req.body;

    if (!name || !email) {
      throw Object.assign(new Error('Name and email are required'), { status: 400 });
    }

    if (!['client', 'mentor'].includes(requested_role)) {
      throw Object.assign(new Error('Requested role must be client or mentor'), { status: 400 });
    }

    const normalizedEmail = normalizeEmail(email);

    const [request] = await db('invite_requests')
      .insert({
        name: name.trim(),
        email: normalizedEmail,
        zip_code: zip_code ? zip_code.trim() : null,
        package_choice: package_choice ? package_choice.trim() : null,
        requested_role,
      })
      .returning('*');

    res.status(201).json({ data: request });
  } catch (error) {
    next(error);
  }
};

exports.list = async (req, res, next) => {
  try {
    const requests = await db('invite_requests as r')
      .leftJoin('users as u', 'r.handled_by', 'u.id')
      .select('r.*', 'u.name as handled_by_name')
      .orderBy('r.created_at', 'desc');

    res.json({ data: requests });
  } catch (error) {
    next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  const trx = await db.transaction();
  try {
    const { id } = req.params;
    const { status, notes, generateInviteCode: shouldGenerateCode, targetRole } = req.body;

    if (!['pending', 'approved', 'declined'].includes(status)) {
      throw Object.assign(new Error('Invalid status'), { status: 400 });
    }

    const request = await trx('invite_requests').where({ id }).first();
    if (!request) {
      throw Object.assign(new Error('Invite request not found'), { status: 404 });
    }

    let roleToAssign = request.requested_role || 'client';
    if (targetRole) {
      if (!['client', 'mentor'].includes(targetRole)) {
        throw Object.assign(new Error('Invalid role'), { status: 400 });
      }
      roleToAssign = targetRole;
    }

    const updates = {
      status,
      notes: notes || null,
      handled_by: req.user.id,
      handled_at: trx.fn.now(),
      requested_role: roleToAssign,
    };

    let inviteCode = request.generated_code;

    if (status === 'approved' && shouldGenerateCode && !request.generated_code) {
      const code = generateInviteCode();
      await trx('invite_codes').insert({
        code,
        role: roleToAssign,
        assigned_name: request.name,
        assigned_email: request.email,
        metadata: {
          source: 'invite_request',
          package_choice: request.package_choice,
        },
      });
      updates.generated_code = code;
      inviteCode = code;
    }

    const [updated] = await trx('invite_requests')
      .where({ id })
      .update(updates)
      .returning('*');

    if (status === 'approved') {
      const codeToSend = inviteCode || updated.generated_code || request.generated_code;
      if (codeToSend) {
        if (isEmailConfigured()) {
          try {
            await sendInviteEmail({
              to: request.email,
              name: request.name,
              code: codeToSend,
            });
          } catch (emailError) {
            logger.error('Error sending invite approval email', {
              requestId: id,
              error: emailError.message,
            });
          }
        } else {
          logger.warn('Invite approved but email configuration missing', {
            requestId: id,
            to: request.email,
          });
        }
      }
    }

    await trx.commit();

    res.json({ data: updated });
  } catch (error) {
    await trx.rollback();
    next(error);
  }
};

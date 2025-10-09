const db = require('../db/connection');

const normalizeCode = (code) => (code || '').trim().toUpperCase();

const buildInvitePayload = (source, record) => {
  if (source === 'invite_codes') {
    return {
      source,
      code: record.code,
      role: record.role,
      assignedName: record.assigned_name,
      assignedEmail: record.assigned_email,
      expiresAt: record.expires_at,
      singleUse: record.single_use,
      usedAt: record.used_at,
      metadata: record.metadata || null,
    };
  }

  return {
    source,
    code: record.generated_code,
    role: record.requested_role || 'client',
    assignedName: record.name,
    assignedEmail: record.email,
    status: record.status,
    processedBy: record.handled_by,
    processedAt: record.handled_at,
  };
};

exports.redeem = async (req, res, next) => {
  try {
    const normalized = normalizeCode(req.body?.code);

    if (!normalized) {
      return res.status(400).json({
        ok: false,
        fieldErrors: { code: 'Please enter your invitation code.' },
      });
    }

    const invite = await db('invite_codes')
      .whereRaw('upper(code) = ?', [normalized])
      .first();

    if (invite) {
      if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
        return res.status(410).json({
          ok: false,
          fieldErrors: { code: 'This invitation has expired. Please reach out for a fresh code.' },
        });
      }

      if (invite.single_use && invite.used_at) {
        return res.status(409).json({
          ok: false,
          fieldErrors: { code: 'This invitation has already been used. Request a new one and we’ll take care of you.' },
        });
      }

      return res.json({
        ok: true,
        data: buildInvitePayload('invite_codes', invite),
        message: 'Invitation confirmed — welcome inside.',
      });
    }

    const request = await db('invite_requests')
      .whereRaw('upper(generated_code) = ?', [normalized])
      .first();

    if (request) {
      if (request.status !== 'approved') {
        return res.status(409).json({
          ok: false,
          fieldErrors: {
            code:
              request.status === 'pending'
                ? 'Your invitation is still being prepared. Taylor will be in touch shortly.'
                : 'This invitation is no longer active. Request a new invite and we’ll take care of you.',
          },
        });
      }

      return res.json({
        ok: true,
        data: buildInvitePayload('invite_requests', request),
        message: 'Invitation confirmed — welcome inside.',
      });
    }

    return res.status(404).json({
      ok: false,
      fieldErrors: { code: 'We couldn’t locate that invitation. Please confirm with Taylor.' },
    });
  } catch (error) {
    next(error);
  }
};

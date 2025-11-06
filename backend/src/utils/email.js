const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const nodemailer = require('nodemailer');
const logger = require('./logger');

const isSesConfigured = () =>
  Boolean(
    process.env.AWS_ACCESS_KEY_ID &&
      process.env.AWS_SECRET_ACCESS_KEY &&
      process.env.AWS_REGION &&
      process.env.INVITE_EMAIL_FROM
  );

const isSmtpConfigured = () =>
  Boolean(process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASSWORD);

const sesClient = () => {
  if (!isSesConfigured()) return null;
  return new SESClient({ region: process.env.AWS_REGION });
};

const getBaseUrl = () => process.env.FRONTEND_BASE_URL || 'https://taylormadebaby.co';

const buildEmailContent = ({ name, code }) => {
  const baseUrl = getBaseUrl();
  const inviteLink = `${baseUrl.replace(/\/$/, '')}/create-profile?invite=${encodeURIComponent(code)}`;
  const bodyText = `Hi ${name || 'there'},\n\nYour concierge invitation is ready! Use the single-use code ${code} to create your profile and unlock the lounge. Head to ${inviteLink} to begin.\n\nWith care,\nTaylor-Made Baby Co.`;
  const bodyHtml = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; color:#1d1d1d;">
      <p>Hi ${name || 'there'},</p>
      <p>Your concierge invitation is ready! Use the one-time code below to begin your Taylor-Made experience:</p>
      <p style="font-size:20px;font-weight:bold;color:#7c3aed;letter-spacing:0.3em;">${code}</p>
      <p>This code works once and is linked to your profile. Tap the button below or head to the site to get started.</p>
      <p style="margin:24px 0;">
        <a
          href="${inviteLink}"
          style="display:inline-block;background:#f9a8d4;color:#1f2937;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:600;"
        >
          Create My Profile
        </a>
      </p>
      <p>
        Or visit <a href="${baseUrl}" style="color:#2563eb;">${baseUrl}</a> and enter code <strong>${code}</strong> when prompted.
      </p>
      <p style="margin-top:24px;">With care,<br/>Taylor-Made Baby Co.</p>
    </div>
  `;
  return { bodyText, bodyHtml };
};

const sendViaSes = async ({ to, name, code }) => {
  const client = sesClient();
  if (!client) return false;

  const { bodyText, bodyHtml } = buildEmailContent({ name, code });
  const params = {
    Source: process.env.INVITE_EMAIL_FROM,
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: 'Your Taylor-Made concierge invitation' },
      Body: {
        Text: { Data: bodyText },
        Html: { Data: bodyHtml },
      },
    },
  };

  try {
    await client.send(new SendEmailCommand(params));
    logger.info('Invite email sent via SES', { to });
    return true;
  } catch (error) {
    logger.error('Failed to send invite email via SES', { to, error: error.message });
    return false;
  }
};

const sendViaSmtp = async ({ to, name, code }) => {
  if (!isSmtpConfigured()) return false;

  const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : Number(process.env.SMTP_PORT) === 465;
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const { bodyText, bodyHtml } = buildEmailContent({ name, code });

  try {
    await transporter.sendMail({
      from: process.env.INVITE_EMAIL_FROM || process.env.SMTP_USER,
      to,
      subject: 'Your Taylor-Made concierge invitation',
      text: bodyText,
      html: bodyHtml,
    });
    logger.info('Invite email sent via SMTP', { to });
    return true;
  } catch (error) {
    logger.error('Failed to send invite email via SMTP', { to, error: error.message });
    return false;
  }
};

const sendInviteEmail = async ({ to, name, code }) => {
  if (!to) {
    logger.warn('Invite email skipped: recipient missing', { code });
    return;
  }

  if (await sendViaSes({ to, name, code })) {
    return;
  }

  if (await sendViaSmtp({ to, name, code })) {
    return;
  }

  const { bodyText } = buildEmailContent({ name, code });
  logger.warn('Invite email not sent (no provider configured); logging content instead', {
    to,
    code,
    preview: bodyText,
  });
};

module.exports = {
  sendInviteEmail,
  isSesConfigured,
  isSmtpConfigured,
};

const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const logger = require('./logger');

const isEmailConfigured = () => {
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    return false;
  }
  if (!process.env.AWS_REGION) {
    return false;
  }
  if (!process.env.INVITE_EMAIL_FROM) {
    return false;
  }
  return true;
};

const client = () => {
  if (!isEmailConfigured()) return null;
  return new SESClient({ region: process.env.AWS_REGION });
};

const getBaseUrl = () => process.env.FRONTEND_BASE_URL || 'https://taylormadebaby.co';

const buildEmailContent = ({ name, code }) => {
  const baseUrl = getBaseUrl();
  const bodyText = `Hi ${name || 'there'},\n\nYour concierge invitation is ready. Use code ${code} to get started and visit ${baseUrl} to begin.\n\nWith care,\nTaylor-Made Baby Co.`;
  const bodyHtml = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; color:#1d1d1d;">
      <p>Hi ${name || 'there'},</p>
      <p>Your concierge invitation is ready! Use the code below to begin your Taylor-Made experience:</p>
      <p style="font-size:20px;font-weight:bold;color:#7c3aed;letter-spacing:0.3em;">${code}</p>
      <p>
        Tap the button or head to <a href="${baseUrl}" style="color:#2563eb;">${baseUrl}</a> to start curating your concierge journey.
      </p>
      <p style="margin-top:24px;">With care,<br/>Taylor-Made Baby Co.</p>
    </div>
  `;
  return { bodyText, bodyHtml };
};

const sendInviteEmail = async ({ to, name, code }) => {
  const mailClient = client();
  if (!mailClient) {
    logger.warn('Email configuration missing, skipping invite email', { to });
    return null;
  }

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
    const command = new SendEmailCommand(params);
    await mailClient.send(command);
    logger.info('Invite email sent', { to });
  } catch (error) {
    logger.error('Failed to send invite email', { error: error.message, to });
    throw error;
  }
};

module.exports = {
  sendInviteEmail,
  isEmailConfigured,
};

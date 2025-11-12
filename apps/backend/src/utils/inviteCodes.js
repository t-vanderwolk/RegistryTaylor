import crypto from "node:crypto";

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const ROLE_PREFIX = {
  MEMBER: "ME",
  MENTOR: "MN",
  ADMIN: "AD",
};

function randomSegment(length) {
  const bytes = crypto.randomBytes(length);
  let result = "";
  for (let i = 0; i < bytes.length; i += 1) {
    result += CHARSET[bytes[i] % CHARSET.length];
  }
  return result;
}

export function generateInviteCode(role = "MEMBER") {
  const normalizedRole = String(role).trim().toUpperCase();
  const prefix = ROLE_PREFIX[normalizedRole] ?? "MB";
  return `TMB-${prefix}${randomSegment(4)}`;
}

export default generateInviteCode;

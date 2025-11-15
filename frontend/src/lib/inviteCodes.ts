const ROLE_PREFIX: Record<string, string> = {
  MEMBER: "ME",
  MENTOR: "MN",
  ADMIN: "AD",
};

function randomSegment(length: number) {
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (byte) => "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[byte % 36]).join("");
  }
  return Array.from({ length }, () => "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".charAt(Math.floor(Math.random() * 36))).join("");
}

export function generateInviteCode(role: string) {
  const prefix = ROLE_PREFIX[role] ?? "MB";
  return `TMB-${prefix}${randomSegment(4)}`;
}

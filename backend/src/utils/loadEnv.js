import fs from "node:fs";
import path from "node:path";

let loaded = false;

function parseLine(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) {
    return null;
  }

  const equalsIndex = trimmed.indexOf("=");
  if (equalsIndex === -1) {
    return null;
  }

  const key = trimmed.slice(0, equalsIndex).trim();
  const rawValue = trimmed.slice(equalsIndex + 1).trim();

  if (!key) {
    return null;
  }

  const unquoted =
    rawValue.startsWith(`"`) && rawValue.endsWith(`"`)
      ? rawValue.slice(1, -1)
      : rawValue.startsWith(`'`) && rawValue.endsWith(`'`)
        ? rawValue.slice(1, -1)
        : rawValue;

  return [key, unquoted];
}

function applyEnv(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const content = fs.readFileSync(filePath, "utf-8");
  content.split(/\r?\n/).forEach((line) => {
    const parsed = parseLine(line);
    if (!parsed) return;
    const [key, value] = parsed;
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  });
}

export function loadEnv(customPath) {
  if (loaded) {
    return;
  }

  const candidates = [
    customPath,
    path.resolve(process.cwd(), ".env.local"),
    path.resolve(process.cwd(), ".env"),
  ]
    .filter(Boolean)
    .map((candidate) => path.resolve(candidate));

  const uniqueCandidates = [...new Set(candidates)];
  uniqueCandidates.forEach(applyEnv);
  loaded = true;
}

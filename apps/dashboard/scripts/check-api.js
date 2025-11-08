// apps/dashboard/scripts/check-api.js
import axios from "axios";

function resolveBaseUrl() {
  const fallback = "https://taylor-made-api-5289731b5afb.herokuapp.com";
  const raw = process.env.NEXT_PUBLIC_API_URL ?? fallback;
  const trimmed = raw.trim().replace(/\/+$/, "");
  if (!trimmed) {
    return fallback;
  }
  return trimmed.replace(/\/api(?:\/v1)?$/i, "");
}

const base = resolveBaseUrl();

const routes = [
  "/health",
  "/api/auth/login",
  "/api/academy/modules",
];

(async () => {
  console.log(`🔍 Checking live endpoints under ${base} ...`);
  for (const path of routes) {
    try {
      const res = await axios.get(`${base}${path}`);
      console.log(`✅ ${path} → ${res.status} (${res.statusText})`);
    } catch (err) {
      const code = err.response?.status || "no-response";
      console.log(`❌ ${path} → ${code}`);
    }
  }
})();

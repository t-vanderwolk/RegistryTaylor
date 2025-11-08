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

(async () => {
  console.log("🔍 Discovering public routes under", base);
  const guesses = [
    "/health",
    "/healthz",
    "/api/health",
    "/api/v1/health",
    "/api/v1/academy",
    "/api/v1/academy/modules",
    "/api/v1/auth/login",
    "/auth/login",
  ];

  for (const path of guesses) {
    try {
      const res = await axios.get(base + path);
      console.log(`✅ ${path} → ${res.status}`);
    } catch (error) {
      console.log(`❌ ${path} → ${error.response?.status || error.message}`);
    }
  }
})();

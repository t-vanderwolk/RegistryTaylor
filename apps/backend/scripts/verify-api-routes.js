import axios from "axios";

const base = "https://taylor-made.herokuapp.com/api";
const endpoints = ["/health", "/auth/login", "/academy"];

(async () => {
  console.log("🔍 Verifying Taylor-Made API routes...");
  for (const route of endpoints) {
    try {
      const res = await axios.get(base + route);
      console.log(`✅ ${route} → ${res.status} ${JSON.stringify(res.data)}`);
    } catch (err) {
      const status = err.response?.status || err.message;
      console.error(`❌ ${route} → ${status}`);
    }
  }
})();

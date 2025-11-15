import app from "./app.js";
import { loadEnv } from "./utils/loadEnv.js";

loadEnv();

const port = Number.parseInt(process.env.PORT || "5050", 10);

function startServer() {
  const server = app.listen(port, () => {
    const address = server.address();
    const printable = typeof address === "string" ? address : `http://localhost:${address?.port ?? port}`;
    console.log(`✅ Taylor-Made API listening on ${printable}`);
  });

  server.on("error", (error) => {
    console.error("❌ Failed to start Taylor-Made API server", error);
    process.exit(1);
  });
}

startServer();

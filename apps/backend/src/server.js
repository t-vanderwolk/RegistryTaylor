import cors from "cors";
import express from "express";

const app = express();

// Allowed origins for CORS
const allowedOrigins = [
  "https://www.taylormadebabyco.com",
  "https://taylormadebabyco.com",
  "https://taylor-made-7f1024d95529.herokuapp.com", // your Heroku frontend
  "http://localhost:3000", // for local dev
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow server-to-server or same-origin requests
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`❌ Blocked by CORS: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // allow cookies / headers
  })
);

app.use(express.json());
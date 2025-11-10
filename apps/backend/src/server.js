import cors from "cors";

const allowedOrigins = [
  "https://www.taylormadebabyco.com",
  "https://taylor-made-7f1024d95529.herokuapp.com",
  "https://taylor-made-api-5289731b5afb.herokuapp.com",
  "http://localhost:3000",
];

app.use((req, res, next) => {
  console.log("🌐 CORS Request from:", req.headers.origin);
  next();
});

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn("❌ Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
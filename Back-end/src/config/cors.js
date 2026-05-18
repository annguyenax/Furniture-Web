const cors = require("cors");
require("dotenv").config();

const configCORS = (app) => {
  const allowedOrigins = [
    "http://localhost:5173", // local dev FE
    "http://localhost:3000", // local dev FE
    "https://noithatstore.site", // FE domain
    "https://api.noithatstore.site", // BE domain (optional)
    "https://furniture-c1t.pages.dev",
    process.env.CLIENT_URL, // fallback từ env
  ].filter(Boolean);

  const corsOptions = {
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS blocked: " + origin));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  };

  app.use(cors(corsOptions));
  app.options("*", cors(corsOptions)); // Xử lý preflight
};

module.exports = configCORS;

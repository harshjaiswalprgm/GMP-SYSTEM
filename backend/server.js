import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";

// ================= ROUTE IMPORTS =================
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import attendanceRoutes from "./routes/attendance.js";
import announcementRoutes from "./routes/announcements.js";
import revenueRoutes from "./routes/revenue.js";
import analyticsRoutes from "./routes/analytics.js";
import performanceRoutes from "./routes/performance.js";
import salaryRoutes from "./routes/salary.js";
import leaveRoutes from "./routes/leave.js";
import birthdayRoutes from "./routes/birthday.js";

// ================= ENV =================
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// ================= CORS (FINAL PRODUCTION CONFIG) =================
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://gmp.glowlogics.in",
  "https://glowlogics.in",
];

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       // Allow requests with no origin (Postman, mobile apps, server-to-server)
//       if (!origin) return callback(null, true);

//       if (allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       }

//       return callback(
//         new Error(`CORS blocked for origin: ${origin}`),
//         false
//       );
//     },
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, false); // ❗ silently block
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


// ✅ Handle preflight requests correctly
app.options("*", cors());

// ================= MIDDLEWARE =================
app.use(express.json());

// ================= DB CONNECTION =================
connectDB(MONGO_URI);

// ================= HEALTH CHECK =================
app.get("/hello", (req, res) => {
  res.json({ message: "✅ CRM backend is running" });
});

// ================= API ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/revenue", revenueRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/performance", performanceRoutes);
app.use("/api/salary", salaryRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/birthday", birthdayRoutes);

// ================= GLOBAL ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({
    message: "Server Error",
    error: err.message,
  });
});

// ================= START SERVER =================
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

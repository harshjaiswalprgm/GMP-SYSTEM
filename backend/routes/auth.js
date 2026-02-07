

// import express from "express";
// import jwt from "jsonwebtoken";
// import crypto from "crypto";
// import User from "../models/User.js";
// import sendEmail from "../utils/sendEmail.js";

// const router = express.Router();

// /* =====================================================
//    ✅ LOGIN
//    POST /api/auth/login
// ===================================================== */
// router.post("/login", async (req, res) => {
//   try {
//     let { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Email and password are required",
//       });
//     }

//     email = email.toLowerCase().trim();

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid email or password",
//       });
//     }

//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid email or password",
//       });
//     }

//     const token = jwt.sign(
//       {
//         id: user._id,
//         role: user.role,
//         email: user.email,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
//     );

//     res.status(200).json({
//       success: true,
//       message: "Login successful",
//       token,
//       user: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         avatar: user.avatar || null,
//         teamName: user.teamName || null,
//       },
//     });
//   } catch (error) {
//     console.error("❌ Login Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error. Please try again later.",
//     });
//   }
// });

// /* =====================================================
//    🔐 FORGOT PASSWORD
//    POST /api/auth/forgot-password
// ===================================================== */
// router.post("/forgot-password", async (req, res) => {
//   try {
//     const { email } = req.body;

//     if (!email) {
//       return res.status(400).json({
//         success: false,
//         message: "Email is required",
//       });
//     }

//     const user = await User.findOne({
//       email: email.toLowerCase().trim(),
//     });

//     // Always respond success (security best practice)
//     if (!user) {
//       return res.json({
//         success: true,
//         message:
//           "If an account exists, a reset link has been sent to your email.",
//       });
//     }

//     // 🔐 Generate token
//     const resetToken = crypto.randomBytes(32).toString("hex");

//     user.resetPasswordToken = crypto
//       .createHash("sha256")
//       .update(resetToken)
//       .digest("hex");

//     user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

//     await user.save({ validateBeforeSave: false });

//     const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

//     const message = `
// Hi ${user.name},

// You requested a password reset for your Glowlogics Management Portal account.

// Reset your password using the link below (valid for 15 minutes):

// ${resetUrl}

// If you did not request this, ignore this email.

// — Glowlogics Team
// `;

//     await sendEmail({
//       to: user.email,
//       subject: "Glowlogics GMP – Password Reset",
//       html: `<pre>${message}</pre>`,
//     });

//     res.json({
//       success: true,
//       message:
//         "If an account exists, a reset link has been sent to your email.",
//     });
//   } catch (error) {
//     console.error("❌ Forgot Password Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Email could not be sent",
//     });
//   }
// });

// /* =====================================================
//    🔁 RESET PASSWORD (FIXED)
//    POST /api/auth/reset-password/:token
// ===================================================== */
// router.post("/reset-password/:token", async (req, res) => {
//   try {
//     const { password } = req.body;

//     if (!password || password.length < 6) {
//       return res.status(400).json({
//         success: false,
//         message: "Password must be at least 6 characters",
//       });
//     }

//     // 🔐 hash token from URL
//     const hashedToken = crypto
//       .createHash("sha256")
//       .update(req.params.token)
//       .digest("hex");

//     const user = await User.findOne({
//       resetPasswordToken: hashedToken,
//       resetPasswordExpires: { $gt: Date.now() }, // ✅ FIXED FIELD NAME
//     });

//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid or expired reset token",
//       });
//     }

//     // 🔐 set new password (will auto-hash via schema)
//     user.password = password;
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpires = undefined;

//     await user.save();

//     res.json({
//       success: true,
//       message: "Password reset successful. You can now login.",
//     });
//   } catch (error) {
//     console.error("❌ Reset Password Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Password reset failed",
//     });
//   }
// });


// // export default router;

// import express from "express";
// import jwt from "jsonwebtoken";
// import crypto from "crypto";
// import User from "../models/User.js";
// import sendEmail from "../utils/sendEmail.js";

// const router = express.Router();

// /* =====================================================
//    ✅ LOGIN
// ===================================================== */
// router.post("/login", async (req, res) => {
//   try {
//     let { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Email and password are required",
//       });
//     }

//     email = email.toLowerCase().trim();

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid email or password",
//       });
//     }

//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid email or password",
//       });
//     }

//     const token = jwt.sign(
//       {
//         id: user._id,
//         role: user.role,
//         email: user.email,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
//     );

//     res.json({
//       success: true,
//       token,
//       user: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         avatar: user.avatar || null,
//         teamName: user.teamName || null,
//       },
//     });
//   } catch (error) {
//     console.error("❌ Login Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// });

// /* =====================================================
//    🔐 FORGOT PASSWORD
// ===================================================== */
// router.post("/forgot-password", async (req, res) => {
//   try {
//     const { email } = req.body;

//     if (!email) {
//       return res.status(400).json({
//         success: false,
//         message: "Email is required",
//       });
//     }

//     const user = await User.findOne({
//       email: email.toLowerCase().trim(),
//     });

//     // Always return success
//     if (!user) {
//       return res.json({
//         success: true,
//         message:
//           "If an account exists, a reset link has been sent to your email.",
//       });
//     }

//     // 🔐 Generate token
//     const resetToken = crypto.randomBytes(32).toString("hex");

//     user.resetPasswordToken = crypto
//       .createHash("sha256")
//       .update(resetToken)
//       .digest("hex");

//     user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

//     await user.save({ validateBeforeSave: false });

//     const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

//     const message = `
// Hi ${user.name},

// You requested a password reset for your Glowlogics Management Portal account.

// Reset your password using the link below (valid for 15 minutes):

// ${resetUrl}

// If you did not request this, ignore this email.

// — Glowlogics Team
// `;

//     await sendEmail({
//       to: user.email,
//       subject: "Glowlogics GMP – Password Reset",
//       html: `<pre>${message}</pre>`,
//     });

//     res.json({
//       success: true,
//       message:
//         "If an account exists, a reset link has been sent to your email.",
//     });
//   } catch (error) {
//     console.error("❌ Forgot Password Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Email could not be sent",
//     });
//   }
// });

// /* =====================================================
//    🔁 RESET PASSWORD
// ===================================================== */
// router.post("/reset-password/:token", async (req, res) => {
//   try {
//     const { password } = req.body;

//     if (!password || password.trim().length < 6) {
//       return res.status(400).json({
//         success: false,
//         message: "Password must be at least 6 characters",
//       });
//     }

//     const hashedToken = crypto
//       .createHash("sha256")
//       .update(req.params.token)
//       .digest("hex");

//     const user = await User.findOne({
//       resetPasswordToken: hashedToken,
//       resetPasswordExpires: { $gt: Date.now() },
//     });

//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid or expired reset token",
//       });
//     }

//     user.password = password.trim(); // auto-hashed
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpires = undefined;

//     await user.save({ validateBeforeSave: false });

//     res.json({
//       success: true,
//       message: "Password reset successful. You can now login.",
//     });
//   } catch (error) {
//     console.error("❌ Reset Password Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Password reset failed",
//     });
//   }
// });

// export default router;

import express from "express";
import {
  login,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;

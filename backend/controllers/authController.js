import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";
import { getClientIp, isOfficeIp } from "../utils/ipUtils.js";


/* =====================================================
   ✅ LOGIN
===================================================== */
export const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    email = email.toLowerCase().trim();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    /* ===============================
       🔒 LOCATION BASED LOGIN CHECK
    =============================== */
    const clientIp = getClientIp(req);
    console.log("Login IP:", clientIp);

    // Admin bypass
    if (user.role !== "admin") {
      if (!isOfficeIp(clientIp)) {
        return res.status(403).json({
          success: false,
          message: "Login allowed only from office network",
        });
      }
    }

    /* ===============================
       🔐 PASSWORD CHECK
    =============================== */
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || null,
        teamName: user.teamName || null,
      },
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


/* =====================================================
   🔐 FORGOT PASSWORD
===================================================== */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    // Security best practice: same response always
    if (!user) {
      return res.json({
        success: true,
        message:
          "If an account exists, a reset link has been sent to your email.",
      });
    }

    // ✅ USE MODEL METHOD (single source of truth)
    const resetToken = user.generatePasswordReset();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: "Glowlogics GMP – Password Reset",
      html: `
        <p>Hi ${user.name},</p>
        <p>You requested a password reset for your account.</p>
        <p>
          <a href="${resetUrl}">Click here to reset your password</a>
        </p>
        <p>This link is valid for 15 minutes.</p>
        <p>If you didn’t request this, you can safely ignore this email.</p>
        <p>— Glowlogics Team</p>
      `,
    });

    res.json({
      success: true,
      message:
        "If an account exists, a reset link has been sent to your email.",
    });
  } catch (error) {
    console.error("❌ Forgot Password Error:", error);
    res.status(500).json({
      success: false,
      message: "Email could not be sent",
    });
  }
};

/* =====================================================
   🔁 RESET PASSWORD
===================================================== */
export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password || password.trim().length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    user.password = password.trim(); // auto-hashed by pre-save
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      message: "Password reset successful. You can now login.",
    });
  } catch (error) {
    console.error("❌ Reset Password Error:", error);
    res.status(500).json({
      success: false,
      message: "Password reset failed",
    });
  }
};


// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";
// import crypto from "crypto";

// /**
//  * Leave config (NO usage stored here)
//  * Usage is derived from Leave collection
//  */
// const leaveConfigSchema = {
//   total: { type: Number, default: 6 },
// };

// const userSchema = new mongoose.Schema(
//   {
//     /* ================= BASIC INFO ================= */
//     name: { type: String, required: true },

//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//     },

//     password: { type: String, required: true },

//    role: {
//   type: String,
//   enum: ["admin", "hr", "manager", "employee", "intern"],
//   default: "intern",
// },


//     phone: { type: String, default: "" },
//     avatar: { type: String, default: "" },

//     teamName: { type: String, default: "" },
//     position: { type: String, default: "" },

//     joiningDate: { type: Date, default: Date.now },
//     birthday: { type: Date, default: null },

//     manager: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       default: null,
//     },

//     /* ================= LEAVE CONFIG ================= */
//     leaves: {
//       sick: leaveConfigSchema,
//       casual: leaveConfigSchema,
//     },

//     managedInterns: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//       },
//     ],

//     /* ================= 🔐 FORGOT PASSWORD ================= */
//     resetPasswordToken: { type: String, default: null },
//     resetPasswordExpires: { type: Date, default: null },
//   },
//   { timestamps: true }
// );

// /* =====================================================
//    🔐 PASSWORD HASHING
// ===================================================== */
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// /* =====================================================
//    🧠 LEAVE CONFIG NORMALIZATION
// ===================================================== */
// userSchema.pre("save", function (next) {
//   if (this.role === "intern") {
//     this.leaves = {
//       sick: { total: 0 },
//       casual: { total: 0 },
//     };
//     return next();
//   }

//   if (!this.leaves) {
//     this.leaves = {
//       sick: { total: 6 },
//       casual: { total: 6 },
//     };
//   }

//   next();
// });

// /* =====================================================
//    🔐 PASSWORD CHECK
// ===================================================== */
// userSchema.methods.comparePassword = async function (candidate) {
//   return bcrypt.compare(candidate, this.password);
// };

// /* =====================================================
//    🔁 GENERATE PASSWORD RESET TOKEN
// ===================================================== */
// userSchema.methods.generatePasswordReset = function () {
//   const rawToken = crypto.randomBytes(32).toString("hex");

//   this.resetPasswordToken = crypto
//     .createHash("sha256")
//     .update(rawToken)
//     .digest("hex");

//   this.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

//   return rawToken;
// };

// export default mongoose.model("User", userSchema);

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const leaveConfigSchema = {
  total: { type: Number, default: 6 },
};

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["admin", "hr", "manager", "employee", "intern"],
      default: "intern",
    },

    phone: { type: String, default: "" },
    avatar: { type: String, default: "" },

    teamName: { type: String, default: "" },
    position: { type: String, default: "" },

    joiningDate: { type: Date, default: Date.now },
    birthday: { type: Date, default: null },

    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    leaves: {
      sick: leaveConfigSchema,
      casual: leaveConfigSchema,
    },

    managedInterns: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    /* 🔐 FORGOT PASSWORD */
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
  },
  { timestamps: true }
);

/* 🔐 PASSWORD HASH */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/* 🧠 LEAVE NORMALIZATION */
userSchema.pre("save", function (next) {
  if (this.role === "intern") {
    this.leaves = {
      sick: { total: 0 },
      casual: { total: 0 },
    };
    return next();
  }

  if (!this.leaves) {
    this.leaves = {
      sick: { total: 6 },
      casual: { total: 6 },
    };
  }

  next();
});

/* 🔐 PASSWORD CHECK */
userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

/* 🔁 PASSWORD RESET TOKEN (USE THIS) */
userSchema.methods.generatePasswordReset = function () {
  const rawToken = crypto.randomBytes(32).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  this.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

  return rawToken;
};

export default mongoose.model("User", userSchema);

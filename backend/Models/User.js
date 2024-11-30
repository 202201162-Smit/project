// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Event = require("./Event")

const hashValue = 10;

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  collegeEmail: { type: String, trim: true }, // Email used for college verification
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "College",
    // required: function () { return this.isVerified; }, // Required if user is verified as a student
  },
  image: { type: String, required: true },
  additionalDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserProfile",
    required: true,
  },
  participated:[{
    type:mongoose.Schema.Types.ObjectId, 
    ref: "Event",
  }],
  isdb: { type: Boolean, default: false },
});

// Pre-save hook to hash password before saving user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    
    const salt = await bcrypt.genSalt(hashValue);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    console.error("Error hashing password:", error);
    next(error);
  }
});

// Method to generate JWT for user
userSchema.methods.generateToken = async function () {
  return jwt.sign({ userId: this._id, email: this.email }, "Smit", { expiresIn: "30d" });
};

// Method to compare passwords
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
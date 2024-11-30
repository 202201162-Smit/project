const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../Models/User");
const UserProfile = require("../Models/UserProfile");
const OTP = require("../Models/OTP");
const College = require("../Models/College");
const mailSender = require("../utils/mailsender");
const { VERIFICATION_EMAIL_TEMPLATE } = require("../utils/emailTemplates");
const nodemailer = require("nodemailer")
const {validateUser} = require("../utils/Uservalidator")

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "eventsphereandteam@gmail.com",
    pass: "sxuk srwu azmt dtly",
  },
});

// const bcrypt = require("bcrypt")


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(403).json({ error: "User not found" });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id, type: 'student' }, "TeamDoIt", {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      representative: {
        id: user._id,
        email: user.email,
        name: user.firstName,
        image: user.image,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }

};

exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    const saltRounds = 10;
    const hashedPass = await bcrypt.hash(password, saltRounds);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }
    const { error } = validateUser({password });
    if (error) {
      const passwordError = error.details.find((err) => err.context.key === "password");
      if (passwordError) {
        return res.status(400).json({ message: passwordError.message });
      }
    }
    const profileDetails = await UserProfile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumer: null,
    });

    await profileDetails.save();

    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
    });

    newUser.save()
      .then((result) => {
        sendotpVerificationEmail(result, res);
      })
      .catch((err) => {
        console.log(err);
        res.send("Sign up error!!!!");
      });
    // await newUser.save();
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Error registering user" });
  }
};

const sendotpVerificationEmail = async ({ _id, email }, res) => {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

    const mailOptions = {
      from: "eventsphereandteam@gmail.com",
      to: email,
      subject: "Verify Your Email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", otp)
    };

    const saltRounds = 10;
    const hashedOTP = await bcrypt.hash(otp, saltRounds);
    const newotpVerification = new OTP({
      userId: _id,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });

    await newotpVerification.save();
    await transporter.sendMail(mailOptions);
    res.json({
      status: "PENDING",
      message: "Verification otp email sent",
      data: {
        userId: _id,
        email: email,
      },
    });
  } catch (error) {
    res.json({
      status: "FAILED",
      message: error.message,
    });
  }
};

module.exports.verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    if (!userId || !otp) {
      await User.deleteOne({_id : userId});
      throw new Error("Empty OTP details are not allowed");
    }

    // Find OTP records for the user
    const userOTPRecords = await OTP.find({ userId });

    if (userOTPRecords.length <= 0) {
      throw new Error("Account record doesn't exist or has been verified already. Please sign up or log in.");
    }

    const expiresAt = userOTPRecords[0].expiresAt;
    const hashedOTP = userOTPRecords[0].otp;

    if (expiresAt < Date.now()) {
      await otpVerification.deleteMany({ userId });
      throw new Error("Code has expired. Please request again.");
    }

    // Verify the OTP
    const validOTP = await bcrypt.compare(otp, hashedOTP);
    if (!validOTP) {
      await User.deleteOne({_id : userId});
      throw new Error("Invalid OTP. Please try again.");
    }
    // await User.updateOne({ _id: userId }, { isVerified: true });
    await User.findByIdAndUpdate(
      userId,
      { $set: { isdb: true }},
      { new: true }
    )
    await OTP.deleteMany({ userId });

    res.json({
      status: "VERIFIED",
      message: "User email verified successfully."
    });
  } catch (error) {
    res.json({
      status: "FAILED",
      message: error.message,
    });
  }
}

module.exports.Deleteusers = async(req, res) => {
  try {
    await User.deleteMany({ isdb: false });
    res.status(200).json({
      message: `users with isDb = false have been deleted successfully.`,
    });
  } catch (error) {
    console.error("Error deleting users:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
}


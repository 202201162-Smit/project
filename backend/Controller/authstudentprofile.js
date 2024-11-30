const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../Models/User");
const UserProfile = require("../Models/UserProfile");
const OTP = require("../Models/OTP");
const College = require("../Models/College");
const mailSender = require("../utils/mailsender");
const { VERIFICATION_EMAIL_TEMPLATE } = require("../utils/emailTemplates");
const nodemailer = require("nodemailer")
const Event = require("../Models/Event")
// const useAuth =  require("../../frontend/src/Context/AuthProvider.jsx");
// const { userId } = useAuth();

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
      user: "eventsphereandteam@gmail.com",
      pass: "sxuk srwu azmt dtly",
  },
});

module.exports.verify = async (req, res) => {
    // console.log("Hello verifying");
    try {
      const { email, userId} = req.body;
    //   console.log(email, userId);
  
    await sendotpVerificationEmail({userId:userId, email:email}, res);
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ message: "Error registering user" });
    }
  };
  

const sendotpVerificationEmail = async ({ userId, email }, res) => {
    // console.log("Helloo")
    // console.log(userId, email);
    const user = await User.findOne({ _id: userId });
    // console.log(user);
    if(user.isVerified){
        res.json({
            status: "PENDING",
            message: "User already verified!!!",
        });
        return;
    }
    try {
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
  
        const mailOptions = {
            from: "eventsphereandteam@gmail.com",
            to: email,
            subject: "Verify Your Email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", otp)
        };

        const emailDomain = email.split('@')[1].split('.')[0];
        // console.log(emailDomain)

        const col = await College.findOne({emailDomain});
        // console.log(col);

        if(!col){
            throw new Error("Oops, Your college is not exist!!!");
        }
  
        const saltRounds = 10;
        const hashedOTP = await bcrypt.hash(otp, saltRounds);
        const newotpVerification = new OTP({
            userId: userId,
            otp: hashedOTP,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000,
        });
  
        await newotpVerification.save();
        await transporter.sendMail(mailOptions);
        // console.log("Smit - 4");
        res.json({
            status: "PENDING",
            message: "Verification otp email sent",
            data: {
                userId: userId,
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
        // console.log(userId)
        // console.log(otp);
        if (!userId || !otp) {
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
            throw new Error("Invalid OTP. Please try again.");
        }
        await User.updateOne({ _id: userId }, { isVerified: true });
  
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
  
module.exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params; 
    console.log(userId);
    const user = await User.findOne({ _id: userId }).populate('participated');
    console.log("user fetched",user)

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      status: "SUCCESS",
      message: "User found",
      data: user,
    });
  } catch (error) {
    console.error("Error finding user:", error);
    res.status(500).json({ message: "Error retrieving user data" });
  }
};

module.exports.getUserprofileById = async (req, res) => {
    try {
      const { id } = req.params; 
    //   console.log(id);
      const user = await UserProfile.findOne({ _id: id });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({
        status: "SUCCESS",
        message: "User found",
        data: user,
      });
    } catch (error) {
      console.error("Error finding user:", error);
      res.status(500).json({ message: "Error retrieving user data" });
    }
  };


  module.exports.updateUser = async (req, res) => {
    try {
      const { userId } = req.params;
      const { firstName, lastName, email, password, image, isVerified, additionalDetails } = req.body;
  
      const user = await User.findByIdAndUpdate(
        userId,
        {
          firstName,
          lastName,
          email,
          password, // Ensure that password is hashed before saving
          image,
          isVerified,
          additionalDetails
        },
        { new: true }
      );
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({
        status: "SUCCESS",
        message: "User updated successfully",
        data: user
      });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Error updating user" });
    }
  };
  
  module.exports.updateUserProfile = async (req, res) => {
    try {
      const { id } = req.params;
      const { gender, dateOfBirth, about, participated } = req.body;
  
      const userProfile = await UserProfile.findByIdAndUpdate(
        id,
        { gender, dateOfBirth, about, participated },
        { new: true }
      );
  
      if (!userProfile) {
        return res.status(404).json({ message: "User profile not found" });
      }
  
      res.status(200).json({
        status: "SUCCESS",
        message: "User profile updated successfully",
        data: userProfile
      });
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Error updating user profile" });
    }
  };


  module.exports.deleteUserbyId = async(req, res) => {
    try {
        const {userId}= req.params;
        const user = await User.findOne({_id: userId});
        const id = user.additionalDetails;
        await User.deleteOne({_id : userId})
        await UserProfile.deleteOne({_id : id})
        return res.status(200).json({message : "User deleted successfully"})
    } catch (error) {
      return res.status(404).json({message : "Error"})
    }
}
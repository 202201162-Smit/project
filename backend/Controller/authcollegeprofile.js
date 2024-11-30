const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../Models/User");
const UserProfile = require("../Models/UserProfile");
const OTP = require("../Models/OTP");
const College = require("../Models/College");
const CollegeRep = require("../Models/CollegeRep")
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

    // Check if the user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the provided password matches the stored hashed password

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, "TeamDoIt", {
      expiresIn: "1h", // Set token expiry as needed
    });

    // Respond with the token and user information if needed
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }

};

exports.signup = async (req, res) => {
  try {
    const { clubName, email, password, confirmPassword, collegeId } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    const saltRounds = 10;
    const hashedPass = await bcrypt.hash(password, saltRounds);

    const existingClub = await CollegeRep.findOne({ email });

    // console.log(existingClub);
    if (existingClub) {
      return res.status(400).json({ message: "Club already exists" });
    }

    const { error } = validateUser({ password });
    if (error) {
      const passwordError = error.details.find((err) => err.context.key === "password");
        if (passwordError) {
          return res.status(400).json({ message: passwordError.message });
        }
    }

    const newClub = new CollegeRep({
      clubName,
      email,
      password,
      collegeId:collegeId,
    });

    newClub.save()
            .then((result) => { 
              sendotpVerificationEmail(result, res); })
            .catch((err) => {
                console.log(err);
                res.status(400).json({ message: "Sign up error!!!!" });
            });
            // await newUser.save();
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Error registering club" });
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
      // console.log(userId)
      // console.log(otp);
      if (!userId || !otp) {
          await CollegeRep.deleteOne({_id:userId});
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
          await CollegeRep.deleteOne({_id:userId});
          throw new Error("Invalid OTP. Please try again.");
      }
      const collRep=await CollegeRep.findOne({_id:userId})
      const collegeID=collRep.collegeId
      const college=await College.findOne({_id:collegeID})
      // const RepData={
      //   clubName: collRep.clubName,
      //   email: collRep.email,
      //   password:collRep.password,
      // }
      console.log("collrep")
      // console.log(RepData)
      console.log(collegeID)
      console.log("College",college)

      // const newRep = new CollegeRep({ ...RepData, collegeID });
      // await newRep.save();
      await College.findByIdAndUpdate(
        collegeID,
        { $push: { collegeRepresentatives: userId } }, // Push the newRep's _id to the collegeRepresentatives array
        { new: true } // Return the updated document
      );

      console.log("hehe")

      // await College.findByIdAndUpdate(
      //   collegeID,
      //   { $push: { collegeRepresentatives: newRep._id } }, // Pushes the newRep's _id into collegeRepresentatives array
      //   { new: true } // Returns the updated document if you want to use it
      // );

    //   await College.findByIdAndUpdate(
    //     collegeRep.collegeId,
    //     { $push: { collegeRepresentatives: { clubName: collegeRep.clubName, clubemail: collegeRep.email, password: collegeRep.password } } },
    //     { new: true, useFindAndModify: false }
    // );

      await OTP.deleteMany({ userId });

      res.json({
          status: "VERIFIED",
          message: "club email verified successfully."
      });
  } catch (error) {
      res.json({
          status: "FAILED",
          message: error.message,
      });
  }
}

module.exports.getCollegeById = async (req, res) => {
  try {
    const { userId } = req.params; 
    // console.log(userId);
    const college = await College.findOne({ _id: userId }).populate('collegeRepresentatives');

    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }

    res.status(200).json({
      status: "SUCCESS",
      message: "College found",
      data: college,
    });
  } catch (error) {
    console.error("Error finding college:", error);
    res.status(500).json({ message: "Error retrieving college data" });
  }
};

module.exports.deletecollegebyId = async(req, res) => {
  try {
      const {userId}= req.params;
      await CollegeRep.deleteMany({collegeId:userId});
      await College.deleteOne({_id : userId});
      return res.status(200).json({message : "College deleted successfully"})
  } catch (error) {
    return res.status(404).json({message : "Error during delete"})
  }
}
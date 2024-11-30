const College = require("../Models/College");
const CollegeRep = require("../Models/CollegeRep");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const OTP = require("../Models/OTP");
const authController = require("../Controller/authController");
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

exports.signup = async (req, res) => {
    try {
        const {
            name, // College name
            email, // College email
            password, // College password
            confirmPassword, // Confirm password
            emailDomain, // College email domain
            // representatives // Array of representatives
        } = req.body;

        // Validate that all required fields are provided
        if (!name || !email || !password || !confirmPassword || !emailDomain) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Validate password match
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match." });
        }

        // Check if a college with this email already exists
        const existingCollege = await College.findOne({ email });
        if (existingCollege) {
            return res.status(400).json({ message: "College email already registered." });
        }

        const { error } = validateUser({ password });
            if (error) {
            const passwordError = error.details.find((err) => err.context.key === "password");
            if (passwordError) {
                return res.status(400).json({ message: passwordError.message });
            }
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the college document
        const college = new College({
            name,
            email,
            password: hashedPassword,
            emailDomain,
            collegeRepresentatives: [] // Set representatives if provided
        });

        // Save college details
        // await college.save();

        // Loop through each representative in the request and create a CollegeRep document for each
        // if (representatives && representatives.length > 0) {
        //     for (const rep of representatives) {
        //         const { repname, repId, password } = rep;
        //         const hashedRepPassword = await bcrypt.hash(password, 10);

        //         // Create and save CollegeRep document
        //         await CollegeRep.create({
        //             repId,
        //             password: hashedRepPassword,
        //             collegeId: college._id,
        //         });
        //     }
        // }


        college.save()
            .then((result) => {
                sendotpVerificationEmail(result, res);
            })
            .catch((err) => {
                console.log(err);
                res.send("Sign up error!!!!");
            });
        // res.status(201).json({ message: "College registered successfully." });

    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the representative by repId
        const college = await College.findOne({ email });
        if (!college) {
            const club = await CollegeRep.findOne({ email });

            if (!club) {
                return res.status(404).json({ error: "Club not found!" });
            }
            const isPasswordValid = await bcrypt.compare(password, club.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: "Invalid password" });
            }

            // Generate JWT token
            const token = jwt.sign({ userId: club._id, type: 'club' }, "TeamDoIt", {
                expiresIn: "1h", // Set token expiry as needed
            });

            return res.status(200).json({
                message: "Login successful",
                token,
                representative: {
                    id: club._id,
                    email: club.clubemail,
                    club: club.clubName,
                },
            });
        }

        // Check password

        const isPasswordValid = await bcrypt.compare(password, college.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid password" });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: college._id, type: 'college' }, "TeamDoIt", {
            expiresIn: "1h", // Set token expiry as needed
        });

        res.status(200).json({
            message: "Login successful",
            token,
            representative: {
                id: college._id,
                email: college.email,
                college: college.name,
            },
        });
    } catch (error) {
        console.error("Error in college login:", error);
        res.status(500).json({ error: "Server error" });
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
            await College.deleteOne({_id:userId});
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
            await College.deleteOne({_id:userId});
            throw new Error("Invalid OTP. Please try again.");
        }
        await College.findByIdAndUpdate(
            userId,
            { $set: { isdb: true }},
            { new: true }
          )
        // await User.updateOne({ _id: userId }, { isVerified: true });

        await OTP.deleteMany({ userId });

        res.json({
            status: "VERIFIED",
            message: "College email verified successfully."
        });
    } catch (error) {
        res.json({
            status: "FAILED",
            message: error.message,
        });
    }
}

module.exports.Deletecolleges = async(req, res) => {
    try {
      await College.deleteMany({ isdb: false });
      res.status(200).json({
        message: `colleges with isDb = false have been deleted successfully.`,
      });
    } catch (error) {
      console.error("Error deleting colleges:", error);
      res.status(500).json({ message: "Server error. Please try again later." });
    }
  }
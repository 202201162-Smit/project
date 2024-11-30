const nodemailer = require("nodemailer");
require("dotenv").config();

const mailSender = async (email, title, body) => {
  try {
    // Create a transporter object using Gmail's SMTP settings
    let transporter = nodemailer.createTransport({
      service: 'gmail', // Using Gmail SMTP service
      auth: {
        user: process.env.MAIL_USER, // Use your Gmail email here
        pass: process.env.MAIL_PASS, // Use your Gmail password or App Password
      },
    });

    // Send email
    let info = await transporter.sendMail({
      from: process.env.MAIL_USER, // sender address
      to: email, // recipient address
      subject: title, // Subject line
      html: body, // HTML body
    });

    // Log the result if successful
    console.log("Email sent successfully: ", info.response);
    return info;
  } catch (error) {
    console.log("Error in mailSender", error.message);
    throw error;
  }
};

module.exports = mailSender;

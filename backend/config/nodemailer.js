import nodemailer from "nodemailer";

// Create a transporter object using the default SMTP transport
console.log("--- Nodemailer Configuration ---");
console.log("EMAIL_HOST:", process.env.EMAIL_HOST);
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded" : "NOT LOADED"); // Don't log the actual password

// Create a transporter object
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send the verification email
const sendVerificationEmail = async (to, token) => {

    const frontendUrl = process.env.FRONTEND_URL;
    if (!frontendUrl) {
        console.error("CRITICAL ERROR: FRONTEND_URL is not defined in your .env file.");
        // This will stop the process and prevent a broken email from being sent.
        throw new Error("Server is not configured correctly for sending emails.");
    }
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;

  const mailOptions = {
    from: `"Your App Name" <${process.env.EMAIL_USER}>`, // sender address
    to: to, // list of receivers
    subject: "Please Verify Your Email Address", // Subject line
    html: `
            <h2>Thank you for registering!</h2>
            <p>Please click the link below to verify your email address and complete your registration:</p>
            <a href="${verificationUrl}" style="background-color: #2b9fa5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
            <p>If you did not create an account, please ignore this email.</p>
        `, // html body
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
    throw new Error("Could not send verification email.");
  }
};

export default sendVerificationEmail;

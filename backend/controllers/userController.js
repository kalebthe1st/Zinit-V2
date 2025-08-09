import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import crypto from "crypto"; // <-- Import crypto
import sendVerificationEmail from "../config/nodemailer.js"; // <-- Import email function
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// --- MODIFIED to accept optional 'telebirrPhone' ---
const registerUser = async (req, res) => {
  try {
    const { name, email, password, telebirrPhone } = req.body; // <-- get phone from body

    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists.",
      });
    }

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter a valid email." });
    }
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const emailVerificationToken = crypto.randomBytes(20).toString("hex");

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      telebirrPhone: telebirrPhone || "",
      emailVerificationToken: emailVerificationToken, // <-- Save the token // <-- Save the phone number, or an empty string if not provided
    });

    await newUser.save();
    await sendVerificationEmail(newUser.email, emailVerificationToken);

    // DO NOT send back a login token. User must verify first.
    res.json({
      success: true,
      message:
        "Registration successful! Please check your email (and spam folder) to verify your account.",
    });

    // Note: The user object is not sent back to avoid exposing sensitive data.
    // Instead, we send a success message prompting the user to verify their email.
  } catch (error) {
    console.error("Register User Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error during registration." });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await userModel.findOne({ emailVerificationToken: token });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid verification token." });
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined; // Clear the token
    await user.save();

    // Optionally, you can redirect them to the login page or send a success message.
    res.json({
      success: true,
      message: "Email verified successfully! You can now log in.",
    });
  } catch (error) {
    console.error("Verify Email Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during email verification.",
    });
  }
};

// --- MODIFIED to return new fields ---
const userProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId).select("-password"); // Exclude password from result
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }
    res.json({ success: true, user }); // Send the entire user object (without password)
  } catch (error) {
    console.error("User Profile Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching profile." });
  }
};

// --- NEW FUNCTION to update profile details ---
const updateUserProfile = async (req, res) => {
  try {
    const { telebirrPhone, cbeAccount } = req.body;

    const updatedData = {};
    if (telebirrPhone !== undefined) updatedData.telebirrPhone = telebirrPhone;
    if (cbeAccount !== undefined) updatedData.cbeAccount = cbeAccount;

    const updatedUser = await userModel
      .findByIdAndUpdate(
        req.userId,
        { $set: updatedData },
        { new: true } // Return the updated document
      )
      .select("-password");

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }
    res.json({
      success: true,
      message: "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error updating profile." });
  }
};

// Route for admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials." });
    }

    // --- ADDED VERIFICATION CHECK ---
    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: "Please verify your email address before logging in.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = createToken(user._id);
      res.json({ success: true, token });
    } else {
      res.status(400).json({ success: false, message: "Invalid credentials." });
    }
  } catch (error) {
    console.error("Login User Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error during login." });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({}).select("-password"); // Exclude passwords for security
    res.json({ success: true, users });
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error while fetching users." });
  }
};

// --- NEW Admin Function: Delete a user and their products ---
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from the URL parameter

    const deletedUser = await userModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Also delete all products associated with this user
    await productModel.deleteMany({ sellerId: userId });

    res.json({
      success: true,
      message: "User and their associated products have been deleted.",
    });
  } catch (error) {
    console.error("Error in deleteUser:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error while deleting user." });
  }
};
export {
  getAllUsers,
  deleteUser,
  loginUser,
  registerUser,
  adminLogin,
  updateUserProfile,
  userProfile,
  verifyEmail,
};

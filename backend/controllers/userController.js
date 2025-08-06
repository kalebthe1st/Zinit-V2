import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

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

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      telebirrPhone: telebirrPhone || "", // <-- Save the phone number, or an empty string if not provided
    });

    const user = await newUser.save();
    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.error("Register User Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error during registration." });
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
      return res.json({ success: false, message: "User doesn't exists" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = createToken(user._id);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
export { loginUser, registerUser, adminLogin, updateUserProfile, userProfile };

import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js"; // <-- Import userModel

const authUser = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not Authorized. Please Login Again." });
  }
  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(token_decode.id).select("name");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    req.userId = token_decode.id;
    req.userName = user.name; // <-- ADD THIS

    next();
  } catch (error) {
    res
      .status(401)
      .json({
        success: false,
        message: "Authentication failed. Token is invalid.",
      });
  }
};

export default authUser;

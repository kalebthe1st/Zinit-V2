import express from "express";
import {
  loginUser,
  registerUser,
  adminLogin,
  userProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser,
  verifyEmail,
} from "../controllers/userController.js";
import authUser from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js"; // <-- Make sure adminAuth is imported
const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", adminLogin);
userRouter.get("/profile", authUser, userProfile);
userRouter.put("/profile", authUser, updateUserProfile);
userRouter.get("/verify-email/:token", verifyEmail);

userRouter.get("/all", adminAuth, getAllUsers); // GET /api/user/all
userRouter.delete("/:userId", adminAuth, deleteUser); // DELETE /api/user/:userId

export default userRouter;

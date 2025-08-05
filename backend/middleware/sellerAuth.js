import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

const sellerAuth = async (req, res, next) => {
    console.log("--- Seller Auth Middleware Executing ---");
    const { token } = req.headers;

    if (!token) {
        console.log("Seller Auth: Failed - No token provided.");
        return res.status(401).json({ success: false, message: 'Authorization failed. No token provided.' });
    }

    try {
        // 1. Verify the token
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        const userId = token_decode.id;
        console.log("Seller Auth: Token verified. User ID:", userId);

        // 2. Find the user in the database
        const user = await userModel.findById(userId);
        if (!user) {
            console.log("Seller Auth: Failed - User not found in DB.");
            return res.status(404).json({ success: false, message: "User not found." });
        }
        console.log("Seller Auth: User found. isSeller:", user.isSeller);

        // 3. Check if the user is a seller
        if (user.isSeller) {
            // --- THIS IS THE CRITICAL FIX ---
            // Attach the userId DIRECTLY to the request object.
            // Using `req.userId` is safer than modifying `req.body`.
            req.userId = userId;
            console.log("Seller Auth: Success! User is a seller. Proceeding...");
            next(); // Proceed to the next function (the controller)
        } else {
            console.log("Seller Auth: Failed - User is not a seller.");
            res.status(403).json({ success: false, message: 'Access denied. You are not authorized as a seller.' });
        }
    } catch (error) {
        console.log("Seller Auth: Failed - Token is invalid or expired.");
        res.status(401).json({ success: false, message: 'Authentication failed. Token is invalid or expired.' });
    }
};

export default sellerAuth;
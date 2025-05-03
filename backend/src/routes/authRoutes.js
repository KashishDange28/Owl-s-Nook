// backend/src/routes/authRoutes.js
import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", async(req, res) => {
    try {
        const { username, email, password } = req.body;
        
        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: "Please fill all fields" });
        }

        const existingEmail = await User.findOne({ email }).select('_id');
        if (existingEmail) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }

        const existingUsername = await User.findOne({ username }).select('_id');
        if (existingUsername) {
            return res.status(400).json({ success: false, message: "Username already exists" });
        }

        const profileImage = `https://api.dicebear.com/6.x/avataaars/svg?seed=${username}`;
        const user = new User({ username, email, password, profileImage });
        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Registration failed" });
    }
});

// Add this login route
router.post("/login", async(req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "Please provide both email and password" 
            });
        }

        // Find user by email
        const user = await User.findOne({ email });
        
        // If user doesn't exist
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid email or password" 
            });
        }

        // Check if password matches
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid email or password" 
            });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: "30d" }
        );

        // Send success response
        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage
            }
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Login failed" 
        });
    }
});

export default router;
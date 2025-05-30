import express from "express";
import User from "../models/User.js";
import protectRoute from "../middleware/auth.middleware.js";
import cloudinary from "../lib/cloudinary.js";

const router = express.Router();

// PUT - Update user profile
router.put("/profile", protectRoute, async (req, res) => {
    try {
        const { username, profileImage } = req.body;

        // Validation
        if (!username) {
            return res.status(400).json({ message: "Username is required" });
        }

        // Check if username is already taken
        const existingUser = await User.findOne({ username });
        if (existingUser && existingUser._id.toString() !== req.user._id) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Update user
        const updatedUser = await User.findOneAndUpdate(
            { _id: req.user._id },
            { username, profileImage },
            { 
                new: true, 
                runValidators: true,
                context: 'query'
            }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ 
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error("Error in update profile route:", error);
        res.status(500).json({ 
            message: error.message || "Internal server error",
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
});

// PUT - Update profile image
router.put("/profile/image", protectRoute, async (req, res) => {
    try {
        const { image } = req.body;

        if (!image) {
            return res.status(400).json({ message: "Image is required" });
        }

        // Show upload progress
        console.log("Starting image upload...");
        
        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(image, {
            folder: "profile-images",
            width: 300,
            height: 300,
            crop: "fill",
            timeout: 30000 // 30 seconds
        });

        console.log("Image uploaded successfully to Cloudinary");

        // Update user's profile image
        const updatedUser = await User.findOneAndUpdate(
            { _id: req.user._id },
            { profileImage: result.secure_url },
            { 
                new: true, 
                runValidators: true,
                context: 'query'
            }
        );

        if (!updatedUser) {
            return res.status(404).json({ 
                message: "User not found",
                success: false
            });
        }

        console.log("Profile image updated successfully in MongoDB");

        res.status(200).json({ 
            message: "Profile image updated successfully",
            user: updatedUser,
            success: true
        });
    } catch (error) {
        console.error("Error in update profile image route:", error);
        res.status(500).json({ 
            message: error.message || "Failed to update profile image",
            error: process.env.NODE_ENV === 'development' ? error : undefined,
            success: false
        });
    }
});

// GET - Get user profile
router.get("/profile", protectRoute, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error("Error in get profile route:", error);
        res.status(500).json({ 
            message: error.message || "Internal server error" 
        });
    }
});

export default router;

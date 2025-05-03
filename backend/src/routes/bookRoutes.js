import express from "express";
import cloudinary from "../lib/cloudinary.js";
import Book from "../models/Book.js";
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

// POST - Create a new book
router.post("/", protectRoute, async (req, res) => {
    try {
        console.log("Incoming request body:", req.body);
        
        const { title, caption, rating, image } = req.body;
        
        // Validation
        if (!image || !title || !caption || !rating) {
            return res.status(400).json({ 
                message: "All fields are required",
                received: { title, caption, rating, image: !!image }
            });
        }

        // Upload image to Cloudinary
        console.log("Uploading to Cloudinary...");
        const uploadResponse = await cloudinary.uploader.upload(image, {
            folder: "book_covers",
            resource_type: "auto"
        }).catch(err => {
            console.error("Cloudinary upload error:", err);
            throw new Error("Image upload failed");
        });

        // Create book document
        console.log("Creating book document...");
        const newBook = new Book({
            title,
            caption,
            rating,
            image: uploadResponse.secure_url,
            user: req.user._id
        });

        await newBook.save();
        console.log("Book saved successfully");
        
        res.status(201).json({
            message: "Book created successfully",
            book: newBook
        });

    } catch (error) {
        console.error("Full error:", error);
        res.status(500).json({ 
            message: error.message || "Internal server error",
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// GET - Get paginated books
router.get("/", protectRoute, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalBooks = await Book.countDocuments();

        const books = await Book.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("user", "username profileImage");

        res.json({
            books,
            currentPage: page,
            totalBooks,
            totalPages: Math.ceil(totalBooks / limit),
        });
    } catch (error) {
        console.error("Error in get books route:", error);
        res.status(500).json({ 
            message: error.message || "Internal server error" 
        });
    }
});

// GET - Get books by user ID
router.get("/user", protectRoute, async (req, res) => {
    try {
        const books = await Book.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .populate("user", "username profileImage");
            
        res.json(books);
    } catch (error) {
        console.error("Error in get user books route:", error);
        res.status(500).json({ 
            message: error.message || "Internal server error" 
        });
    }
});

// DELETE - Delete a book
router.delete("/:id", protectRoute, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        // Authorization check
        if (book.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized" });
        }

        // Delete image from Cloudinary
        if (book.image) {
            try {
                // Extract public_id from URL (format: https://res.cloudinary.com/.../image.jpg)
                const public_id = book.image.split("/").slice(-2).join("/").split(".")[0];
                await cloudinary.uploader.destroy(public_id);
            } catch (deleteError) {
                console.error("Cloudinary deletion error:", deleteError);
                // Continue with deletion even if image deletion fails
            }
        }

        await book.deleteOne();
        res.json({ message: "Book deleted successfully" });

    } catch (error) {
        console.error("Error in delete book route:", error);
        res.status(500).json({ 
            message: error.message || "Internal server error" 
        });
    }
});

export default router;
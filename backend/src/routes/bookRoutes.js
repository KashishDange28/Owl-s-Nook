import express from "express";
import Book from "../models/Book.js";
import protectRoute from "../middleware/auth.middleware.js";
import cloudinary from "../lib/cloudinary.js";

// Array of book-related images from Unsplash
const bookImages = [
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=500&q=60", // Book cover with coffee
  "https://images.unsplash.com/photo-1542744099-5bf3e6f379ba?auto=format&fit=crop&w=500&q=60", // Vintage books
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=500&q=60", // Bookshelf
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=500&q=60", // Book cover with coffee
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=500&q=60", // Book cover with coffee
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=500&q=60"  // Book cover with coffee
];

const router = express.Router();

// POST - Create a new book
router.post("/", protectRoute, async (req, res) => {
    try {
      const { title, caption, rating, image } = req.body;

      // Validation
      if (!title || !caption || !rating) {
        return res.status(400).json({ message: "Title, caption, and rating are required" });
      }

      // If no image provided, use default
      const bookImage = image || "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=500&q=60";

      // Create book document
      console.log("Creating book document...");
      const newBook = new Book({
        title,
        caption,
        rating,
        image: bookImage,
        user: req.user._id
      });

      // Save book
      console.log("Saving book...");
      await newBook.save();
      console.log("Book saved successfully");

      res.status(201).json({
        message: "Book recommendation created successfully!",
        book: newBook,
        success: true
      });
    } catch (error) {
      console.error("Error creating book:", error);
      res.status(500).json({
        message: error.message || "Failed to create book recommendation",
        error: error.message,
        success: false
      });
    }
  }
);

// GET - Get paginated books
router.get("/", protectRoute, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const books = await Book.find()
            .populate('user', 'username profileImage')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalBooks = await Book.countDocuments();

        res.status(200).json({
            books,
            totalPages: Math.ceil(totalBooks / limit),
            currentPage: page
        });
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({
            message: "Error fetching books",
            error: error.message
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
        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid book ID" });
        }

        // Find and delete the book in one operation
        const deletedBook = await Book.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!deletedBook) {
            return res.status(404).json({ message: "Book not found or unauthorized" });
        }

        res.status(200).json({ 
            message: "Book deleted successfully",
            book: deletedBook
        });
    } catch (error) {
        console.error("Error in delete book route:", error);
        res.status(500).json({ 
            message: error.message || "Internal server error",
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
});

// PUT - Update a book
router.put("/:id", protectRoute, async (req, res) => {
    try {
        const { title, caption, rating } = req.body;
        
        // Validation
        if (!title || !caption || !rating) {
            return res.status(400).json({ 
                message: "Title, caption, and rating are required",
                received: { title, caption, rating }
            });
        }

        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (book.user.toString() !== req.user._id) {
            return res.status(403).json({ message: "Not authorized to update this book" });
        }

        book.title = title;
        book.caption = caption;
        book.rating = rating;
        
        const updatedBook = await book.save();
        res.status(200).json({ 
            message: "Book updated successfully",
            book: updatedBook
        });
    } catch (error) {
        console.error("Error in update book route:", error);
        res.status(500).json({ 
            message: error.message || "Internal server error" 
        });
    }
});

export default router;
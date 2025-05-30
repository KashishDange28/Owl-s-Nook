// mobile/store/bookStore.js
import { create } from 'zustand';
import axios from 'axios';
import { useAuthStore } from './authStore';

export const useBookStore = create((set) => ({
  books: [],
  userBooks: [],
  loading: false,
  error: null,

  // Fetch all books for home feed
  fetchBooks: async () => {
    set({ loading: true });
    try {
      const token = useAuthStore.getState().token;
      const res = await axios.get('http://192.168.56.1:3000/api/books', {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ books: res.data.books, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message, loading: false });
    }
  },

  // Fetch user's books for profile
  fetchUserBooks: async () => {
    set({ loading: true });
    try {
      const token = useAuthStore.getState().token;
      const res = await axios.get('http://192.168.56.1:3000/api/books/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ userBooks: res.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message, loading: false });
    }
  },

  // Create new book
  createBook: async (bookData) => {
    set({ loading: true });
    try {
      const token = useAuthStore.getState().token;
      const res = await axios.post('http://192.168.56.1:3000/api/books', bookData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set((state) => ({ 
        books: [res.data.book, ...state.books],
        userBooks: [res.data.book, ...state.userBooks],
        loading: false 
      }));
      
      // Show success alert with book details
      Alert.alert(
        'Success',
        `Your book recommendation "${res.data.book.title}" has been added successfully!`,
        [
          {
            text: 'View Book',
            onPress: () => {
              // Navigate to book details if needed
            },
            style: 'default'
          },
          {
            text: 'OK',
            style: 'cancel'
          }
        ]
      );
      return res.data;
    } catch (err) {
      set({ error: err.response?.data?.message, loading: false });
      Alert.alert(
        'Error',
        err.response?.data?.message || 'Failed to add book recommendation',
        [
          {
            text: 'Retry',
            onPress: () => {
              // Could add retry logic here
            },
            style: 'default'
          },
          {
            text: 'Cancel',
            style: 'cancel'
          }
        ]
      );
      throw err;
    }
  },

  // Update book
  updateBook: async (bookId, updatedData) => {
    set({ loading: true });
    try {
      const token = useAuthStore.getState().token;
      const res = await axios.put(`http://192.168.56.1:3000/api/books/${bookId}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update both books and userBooks arrays
      set((state) => ({
        books: state.books.map(book => 
          book._id === bookId ? res.data.book : book
        ),
        userBooks: state.userBooks.map(book => 
          book._id === bookId ? res.data.book : book
        ),
        loading: false
      }));
    } catch (err) {
      set({ error: err.response?.data?.message, loading: false });
    }
  },

  // Delete book
  deleteBook: async (bookId) => {
    
    // Validate bookId
    if (!bookId) {
      console.error("Invalid book ID");
      throw new Error("Invalid book ID");
    }

    set({ loading: true });
    try {
      // Get current authentication state
      const authState = useAuthStore.getState();
      console.log("Current auth state:", {
        token: authState.token ? "[REDACTED]" : "No token",
        user: authState.user?._id
      });

      // Perform delete request
      const response = await axios.delete(`http://192.168.56.1:3000/api/books/${bookId}`, {
        headers: { Authorization: `Bearer ${authState.token}` }
      });

      console.log("Delete book response:", response.data);

      // Update local state
      set((state) => ({
        books: state.books.filter(book => book._id !== bookId),
        userBooks: state.userBooks.filter(book => book._id !== bookId),
        loading: false
      }));

      console.log("Book deleted successfully");
      return response.data;
    } catch (err) {
      console.error("Delete book error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });

      set({ 
        error: err.response?.data?.message || err.message, 
        loading: false 
      });
      throw err;
    }
  }
}));
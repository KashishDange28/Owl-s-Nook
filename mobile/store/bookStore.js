import { create } from 'zustand';
import axios from 'axios';
import { useAuthStore } from './authStore';

const API_URL = 'http://10.31.47.242:3000/api';

export const useBookStore = create((set) => ({
  books: [],
  userBooks: [],
  loading: false,
  error: null,

  fetchBooks: async () => {
    set({ loading: true });
    try {
      const token = useAuthStore.getState().token;
      const res = await axios.get(`${API_URL}/books`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ books: res.data.books, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message, loading: false });
    }
  },

  fetchUserBooks: async () => {
    set({ loading: true });
    try {
      const token = useAuthStore.getState().token;
      const res = await axios.get(`${API_URL}/books/user`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ userBooks: res.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message, loading: false });
    }
  },

  createBook: async (bookData) => {
    set({ loading: true });
    try {
      const token = useAuthStore.getState().token;
      const res = await axios.post(`${API_URL}/books`, bookData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set((state) => ({ 
        books: [res.data.book, ...state.books],
        userBooks: [res.data.book, ...state.userBooks],
        loading: false 
      }));
      return res.data;
    } catch (err) {
      set({ error: err.response?.data?.message, loading: false });
      throw err;
    }
  },

  updateBook: async (bookId, updatedData) => {
    set({ loading: true });
    try {
      const token = useAuthStore.getState().token;
      const res = await axios.put(`${API_URL}/books/${bookId}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set((state) => ({
        books: state.books.map(book => book._id === bookId ? res.data.book : book),
        userBooks: state.userBooks.map(book => book._id === bookId ? res.data.book : book),
        loading: false
      }));
    } catch (err) {
      set({ error: err.response?.data?.message, loading: false });
    }
  },

  deleteBook: async (bookId) => {
    set({ loading: true });
    try {
      const token = useAuthStore.getState().token;
      const res = await axios.delete(`${API_URL}/books/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set((state) => ({
        books: state.books.filter(book => book._id !== bookId),
        userBooks: state.userBooks.filter(book => book._id !== bookId),
        loading: false
      }));
      return res.data;
    } catch (err) {
      set({ error: err.response?.data?.message, loading: false });
      throw err;
    }
  }
}));
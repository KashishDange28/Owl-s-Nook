import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://10.31.47.242:3000/api';

const useAuthStore = create((set, get) => ({
    user: null,
    token: null,
    isLoading: false,
    isAuthenticated: false,

    initAuth: async () => {
        try {
            const storedToken = await AsyncStorage.getItem('token');
            const storedUser = await AsyncStorage.getItem('user');

            if (storedToken && storedUser) {
                set({
                    token: storedToken,
                    user: JSON.parse(storedUser),
                    isAuthenticated: true
                });
            }
        } catch {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');
        }
    },

    register: async (username, email, password) => {
        set({ isLoading: true });
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || "Registration failed");

            await AsyncStorage.setItem("user", JSON.stringify(data.user));
            await AsyncStorage.setItem("token", data.token);

            set({
                user: data.user,
                token: data.token,
                isLoading: false,
                isAuthenticated: true
            });

            return { success: true };
        } catch (error) {
            set({ isLoading: false });
            return { success: false, message: error.message };
        }
    },

    login: async (email, password) => {
        set({ isLoading: true });
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || "Invalid credentials");

            await AsyncStorage.setItem("user", JSON.stringify(data.user));
            await AsyncStorage.setItem("token", data.token);

            set({
                user: data.user,
                token: data.token,
                isLoading: false,
                isAuthenticated: true
            });

            return { success: true };
        } catch (error) {
            set({ isLoading: false });
            return { success: false, message: error.message };
        }
    },

    logout: async () => {
        try {
            await AsyncStorage.removeItem('user');
            await AsyncStorage.removeItem('token');
            set({ user: null, token: null, isAuthenticated: false });
            return { success: true };
        } catch {
            return { success: false, message: "Logout failed" };
        }
    },

    checkAuth: () => {
        const state = get();
        return state.isAuthenticated && !!state.token;
    }
}));

export default useAuthStore;
export { useAuthStore };
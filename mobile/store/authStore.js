// mobile/store/authStore.js
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuthStore = create((set, get) => ({
    user: null,
    token: null,
    isLoading: false,
    isAuthenticated: false,

    // Initialize auth state from AsyncStorage
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
        } catch (error) {
            // Handle initialization error silently
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');
        }
    },

    // Register function
    register: async (username, email, password) => {
        set({ isLoading: true });
        try {
            const response = await fetch("http://192.168.56.1:3000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Registration failed");
            }

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
            return { 
                success: false, 
                message: error.message || "Registration failed" 
            };
        }
    },

    // Login function
    login: async (email, password) => {
        set({ isLoading: true });
        try {
            const response = await fetch("http://192.168.56.1:3000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Invalid credentials");
            }

            // Store auth data in AsyncStorage
            await AsyncStorage.setItem("user", JSON.stringify(data.user));
            await AsyncStorage.setItem("token", data.token);

            // Update state
            set({ 
                user: data.user, 
                token: data.token, 
                isLoading: false,
                isAuthenticated: true 
            });
            return { success: true };

        } catch (error) {
            set({ isLoading: false });
            return { 
                success: false, 
                message: error.message || "Login failed" 
            };
        }
    },

    // Logout function
    logout: async () => {
        try {
            await AsyncStorage.removeItem("token");
            await AsyncStorage.removeItem("user");
            set({ 
                user: null, 
                token: null, 
                isAuthenticated: false 
            });
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                message: "Logout failed" 
            };
        }
    },

    // Check if user is authenticated
    checkAuth: () => {
        const state = get();
        return state.isAuthenticated && state.token !== null;
    }
}));

export default useAuthStore;
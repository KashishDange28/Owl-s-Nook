// mobile/app/(auth)/index.jsx
import { View, Text, Image, ActivityIndicator, ScrollView, SafeAreaView } from 'react-native';
import styles from "../../assets/styles/login.styles";
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import COLORS from "../../constants/colors.js";
import { TextInput, TouchableOpacity } from 'react-native';
import { Link, Stack, useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");   
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    
    const router = useRouter();
    const login = useAuthStore(state => state.login);

    const handleLogin = async () => {
        // Clear any previous errors
        setError("");

        // Validate inputs
        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address");
            return;
        }

        setIsLoading(true);
        try {
            const result = await login(email, password);
            
            if (result.success) {
                // Clear form and navigate to home
                setEmail("");
                setPassword("");
                router.replace("/(tabs)"); // or wherever your home screen is
            } else {
                setError(result.message || "Invalid email or password");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
            <Stack.Screen options={{ 
                title: 'Login',
                headerShown: false 
            }} />
            
            <ScrollView 
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.container}>
                    <View style={styles.topIllustration}>
                        <Image
                            source={require("../../assets/images/Library-bro.png")}
                            style={styles.illustrationImage} 
                            resizeMode="contain"
                        />
                    </View>

                    <View style={styles.card}>
                        <View style={styles.header}>
                            <Text style={styles.title}>Login Here</Text>
                            <Text style={styles.subtitle}>Sign in to continue</Text>
                        </View>

                        {/* Error Message */}
                        {error ? (
                            <Text style={styles.errorText}>{error}</Text>
                        ) : null}

                        <View style={styles.formContainer}>
                            {/* Email Input Group */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Email</Text>
                                <View style={styles.inputContainer}>
                                    <Ionicons
                                        name="mail-outline"
                                        size={20}
                                        color={COLORS.primary}
                                        style={styles.inputIcon}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter your email"
                                        placeholderTextColor={COLORS.placeholderText}
                                        value={email}
                                        onChangeText={(text) => {
                                            setEmail(text);
                                            setError(""); // Clear error when typing
                                        }}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                </View>
                            </View>

                            {/* Password Input Group */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Password</Text>
                                <View style={styles.inputContainer}>
                                    <Ionicons
                                        name="lock-closed-outline"
                                        size={20}
                                        color={COLORS.primary}
                                        style={styles.inputIcon}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter your password"
                                        placeholderTextColor={COLORS.placeholderText}
                                        value={password}
                                        onChangeText={(text) => {
                                            setPassword(text);
                                            setError(""); // Clear error when typing
                                        }}
                                        secureTextEntry={!showPassword}
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowPassword(!showPassword)}
                                        style={styles.eyeIcon}
                                    >
                                        <Ionicons
                                            name={showPassword ? "eye-off-outline" : "eye-outline"}
                                            size={20}
                                            color={COLORS.primary}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <TouchableOpacity 
                                style={[
                                    styles.button,
                                    isLoading && styles.buttonDisabled
                                ]} 
                                onPress={handleLogin}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.buttonText}>Login</Text>
                                )}
                            </TouchableOpacity>

                            {/* Footer */}
                            <View style={styles.footer}>
                                <Text style={styles.footerText}>Don't have an account? </Text>
                                <Link href="/(auth)/signup" asChild>
                                    <TouchableOpacity>
                                        <Text style={styles.Link}>Sign Up</Text>
                                    </TouchableOpacity>
                                </Link>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
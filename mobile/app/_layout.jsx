// mobile/app/_layout.jsx
import { Stack, Redirect } from "expo-router";
import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { View, ActivityIndicator } from "react-native";

export default function RootLayout() {
  const { user, loading, initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!user ? (
        // If user is not authenticated, show auth screens
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      ) : (
        // If user is authenticated, show main app tabs
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      )}
    </Stack>
  );
}
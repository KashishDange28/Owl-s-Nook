import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="index"
        options={{
          title: "Login"
        }}
      />
      <Stack.Screen 
        name="signup"
        options={{
          title: "Sign Up"
        }}
      />
    </Stack>
  );
}
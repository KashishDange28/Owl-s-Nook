// mobile/app/(tabs)/_layout.jsx
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: COLORS.background,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
          headerShown: true,
          headerTitle: "Owl's Nook",
          headerStyle: {
            backgroundColor: COLORS.background,
          },
          headerTitleStyle: {
            color: COLORS.text,
          },
        }}
      />

      <Tabs.Screen
        name="create"
        options={{
          title: "Add Book",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          ),
          headerShown: true,
          headerTitle: "Add New Book",
          headerStyle: {
            backgroundColor: COLORS.background,
          },
          headerTitleStyle: {
            color: COLORS.text,
          },
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
          headerShown: true,
          headerTitle: "My Profile",
          headerStyle: {
            backgroundColor: COLORS.background,
          },
          headerTitleStyle: {
            color: COLORS.text,
          },
        }}
      />
    </Tabs>
  );
}
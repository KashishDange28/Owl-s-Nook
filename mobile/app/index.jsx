// mobile/app/index.jsx
import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import COLORS from "../constants/colors";

const { width, height } = Dimensions.get("window");

export default function Index() {
  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.brandContainer}>
          <Image
            source={require("../assets/images/fevicon.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.brandName}>Owl's Nook</Text>
        </View>
        <Text style={styles.tagline}>Your Personal Book Community</Text>
      </View>

      <View style={styles.illustrationContainer}>
        <Image
          source={require("../assets/images/Learning-rafiki.png")}
          style={styles.illustration}
          resizeMode="contain"
        />
      </View>

      <View style={styles.contentSection}>
        <Text style={styles.title}>Welcome to Owl's Nook</Text>
        <Text style={styles.subtitle}>Discover, Share, and Connect through Books</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Link href="/(auth)" style={styles.buttonText}>Login</Link>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
            <Link href="/(auth)/signup" style={[styles.buttonText, styles.secondaryButtonText]}>
              Sign Up
            </Link>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topSection: {
    paddingTop: height * 0.05,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  brandContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  brandName: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  tagline: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: height * 0.02,
  },
  illustrationContainer: {
    height: height * 0.35,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: height * 0.02,
  },
  illustration: {
    width: width * 0.8,
    height: "100%",
  },
  contentSection: {
    flex: 1,
    backgroundColor: COLORS.cardBackground,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: COLORS.border,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: height * 0.04,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: "100%",
    gap: 16,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
    width: "100%",
    textAlign: "center",
  },
  secondaryButtonText: {
    color: COLORS.primary,
  }
});
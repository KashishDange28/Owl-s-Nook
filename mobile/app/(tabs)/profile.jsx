// mobile/app/(tabs)/profile.jsx
import { View, Text, SafeAreaView, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { useRouter } from 'expo-router';
import COLORS from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { useBookStore } from '../../store/bookStore';
import { useEffect } from 'react';
import styles from '../../assets/styles/profile.styles';

export default function Profile() {
  const { user, logout } = useAuthStore();
  const { userBooks, fetchUserBooks, deleteBook } = useBookStore();
  const router = useRouter();

  useEffect(() => {
    if (user?._id) fetchUserBooks();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)');
  };

  const handleDelete = async (bookId) => {
    console.log("Attempting to delete book with ID:", bookId);
    
    // Verify bookId is valid
    if (!bookId) {
      Alert.alert("Error", "Invalid book ID");
      return;
    }

    Alert.alert(
      "Delete Book",
      "Are you sure you want to delete this book?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            try {
              console.log("Deleting book...");
              
              // Verify deleteBook method exists
              if (typeof deleteBook !== 'function') {
                throw new Error("Delete book method not found");
              }

              // Delete the book
              const deleteResult = await deleteBook(bookId);
              console.log("Delete result:", deleteResult);
              
              // Immediately refresh user books
              console.log("Refreshing user books...");
              await fetchUserBooks();
              console.log("User books refreshed successfully");
              
              // Show success message
              Alert.alert("Success", "Book deleted successfully");
            } catch (error) {
              console.error("Full delete book error:", error);
              Alert.alert(
                "Error", 
                error.response?.data?.message || 
                error.message || 
                "Failed to delete book"
              );
            }
          } 
        }
      ]
    );
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Ionicons
        key={index}
        name={index < rating ? "star" : "star-outline"}
        size={16}
        color={index < rating ? "#FFD700" : "#666"}
        style={styles.starIcon}
      />
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Attractive Header Section */}
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/images/favicon.png')}
              style={styles.logoImage}
            />
          </View>
          <Text style={styles.headerTitle}>Owl's Nook</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Info Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: user?.profileImage || 'https://api.dicebear.com/6.x/avataaars/svg?seed=profile' }}
              style={styles.profileImage}
            />
            <View style={styles.editIconContainer}>
              <Ionicons name="pencil" size={16} color="#fff" />
            </View>
          </View>
          <Text style={styles.userName}>{user?.username || 'John Doe'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'john@example.com'}</Text>
          <Text style={styles.memberSince}>Member since {user?.createdAt || 'March 2025'}</Text>
        </View>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <Ionicons name="library-outline" size={24} color={COLORS.primary} />
            <Text style={styles.statsTitle}>Your Recommendations</Text>
          </View>
          <View style={styles.statsContent}>
            <Text style={styles.statsCount}>{userBooks.length} books</Text>
            <Text style={styles.statsSubtext}>shared with the community</Text>
          </View>
        </View>

        {/* Recent Activity Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
        </View>

        <View style={styles.recommendationsList}>
          {userBooks.map((book) => (
            <View key={book._id} style={styles.bookItem}>
              <Image 
                source={{ uri: book.image }}
                style={styles.bookThumbnail}
              />
              <View style={styles.bookInfo}>
                <Text style={styles.bookTitle}>{book.title}</Text>
                <View style={styles.ratingContainer}>
                  {renderStars(book.rating)}
                </View>
                <Text style={styles.bookCaption}>{book.caption}</Text>
              </View>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => handleDelete(book._id)}
              >
                <Ionicons name="trash-outline" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#fff" style={styles.logoutIcon} />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
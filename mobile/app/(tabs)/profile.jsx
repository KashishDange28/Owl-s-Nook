// mobile/app/(tabs)/profile.jsx
import { View, Text, SafeAreaView, Image, TouchableOpacity, ScrollView, Alert, Modal, TextInput } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { useRouter } from 'expo-router';
import COLORS from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { useBookStore } from '../../store/bookStore';
import { useEffect, useState } from 'react';
import styles from '../../assets/styles/profile.styles';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

export default function Profile() {
  const { user, logout } = useAuthStore();
  const { userBooks, fetchUserBooks, deleteBook } = useBookStore();
  const router = useRouter();
  const [editUsernameModalVisible, setEditUsernameModalVisible] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [editImageModalVisible, setEditImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (user?._id) fetchUserBooks();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)');
  };

  const handleUsernameUpdate = async () => {
    if (!newUsername.trim()) {
      Alert.alert('Error', 'Username cannot be empty');
      return;
    }

    try {
      const token = useAuthStore.getState().token;
      const response = await axios.put(
        'http://192.168.56.1:3000/api/users/profile',
        { username: newUsername },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the user state
      useAuthStore.setState({ user: response.data.user });
      
      // Refresh user data to ensure everything is up to date
      try {
        const profileResponse = await axios.get(
          'http://192.168.56.1:3000/api/users/profile',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        useAuthStore.setState({ user: profileResponse.data });
      } catch (error) {
        console.error('Error refreshing profile:', error);
      }
      
      Alert.alert('Success', 'Username updated successfully');
      setEditUsernameModalVisible(false);
      setNewUsername('');
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to update username'
      );
    }
  };

  const pickImage = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'We need permission to access your photos to update your profile image.'
        );
        return;
      }

      // Pick image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setSelectedImage(result.assets[0].uri);
        Alert.alert(
          'Image Selected',
          'Your image has been selected. Tap Save to update your profile image.'
        );
      } else if (result.canceled) {
        Alert.alert('Action Canceled', 'No image was selected.');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert(
        'Error',
        'Failed to pick image. Please try again.'
      );
    }
  };

  const handleImageUpdate = async () => {
    try {
      // Show loading state
      Alert.alert('Uploading...', 'Please wait while we update your profile image');
      
      // Convert image to base64
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      const reader = new FileReader();
      
      return new Promise((resolve, reject) => {
        reader.onloadend = () => {
          const base64 = reader.result;
          
          // Upload to backend
          const token = useAuthStore.getState().token;
          axios.put(
            'http://192.168.56.1:3000/api/users/profile/image',
            { image: base64 },
            { headers: { Authorization: `Bearer ${token}` } }
          )
          .then((response) => {
            // Update the user state
            useAuthStore.setState({ user: response.data.user });
            
            // Refresh user data
            axios.get(
              'http://192.168.56.1:3000/api/users/profile',
              { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((profileResponse) => {
              useAuthStore.setState({ user: profileResponse.data });
              Alert.alert('Success', 'Profile image updated successfully');
              setEditImageModalVisible(false);
              setSelectedImage(null);
            })
            .catch((error) => {
              console.error('Error refreshing profile:', error);
              Alert.alert('Error', 'Failed to refresh profile');
            });
          })
          .catch((error) => {
            console.error('Error updating image:', error);
            Alert.alert(
              'Error',
              error.response?.data?.message || 'Failed to update profile image'
            );
          });
        };
        reader.onerror = () => {
          reject(new Error('Failed to convert image to base64'));
        };
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to process image. Please try again.');
    }
  };

  const handleDelete = async (bookId) => {
    console.log("Attempting to delete book with ID:", bookId);
    
    // Verify bookId is valid
    if (!bookId) {
      Alert.alert("Error", "Invalid book ID");
      return;
    }

    Alert.alert(
      "Delete Book Recommendation",
      "Are you sure you want to delete this book recommendation?",
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
              
              // Show success message with book title
              Alert.alert(
                "Success",
                `Your book recommendation "${deleteResult.deletedBook.title}" has been deleted successfully!`
              );
            } catch (error) {
              console.error("Full delete book error:", error);
              Alert.alert(
                "Error", 
                error.response?.data?.message || 
                error.message || 
                "Failed to delete book recommendation"
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
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                borderWidth: 3,
                borderColor: '#fff',
                resizeMode: 'cover',
              }}
            />
            <TouchableOpacity 
              style={{
                position: 'absolute',
                bottom: -5,
                right: -5,
                backgroundColor: COLORS.primary,
                width: 35,
                height: 35,
                borderRadius: 17.5,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 2,
                borderColor: '#fff',
                elevation: 5,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.2,
                shadowRadius: 3.84,
              }}
              onPress={() => setEditImageModalVisible(true)}
            >
              <Ionicons name="camera" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.usernameContainer}>
            <Text style={styles.userName}>{user?.username || 'Anonymous'}</Text>
            <TouchableOpacity 
              style={{
                position: 'absolute',
                top: -5,
                right: -5,
                backgroundColor: COLORS.primary,
                width: 35,
                height: 35,
                borderRadius: 17.5,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 2,
                borderColor: '#fff',
                elevation: 5,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.2,
                shadowRadius: 3.84,
              }}
              onPress={() => setEditUsernameModalVisible(true)}
            >
              <Ionicons name="pencil" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <Text style={styles.memberSince}>Member since {new Date(user?.createdAt).toLocaleDateString()}</Text>

          {/* Username Edit Modal */}
          <Modal
            visible={editUsernameModalVisible}
            animationType="slide"
            transparent={true}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Edit Username</Text>
                <TextInput
                  style={styles.modalInput}
                  value={newUsername}
                  onChangeText={setNewUsername}
                  placeholder="Enter new username"
                  autoCapitalize="none"
                />
                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setEditUsernameModalVisible(false)}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={handleUsernameUpdate}
                  >
                    <Text style={styles.buttonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Profile Image Edit Modal */}
          <Modal
            visible={editImageModalVisible}
            animationType="slide"
            transparent={true}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Update Profile Image</Text>
                <View style={styles.imagePreviewContainer}>
                  {selectedImage ? (
                    <Image
                      source={{ uri: selectedImage }}
                      style={{
                        width: 150,
                        height: 150,
                        borderRadius: 75,
                        borderWidth: 3,
                        borderColor: '#fff',
                        resizeMode: 'cover',
                      }}
                    />
                  ) : (
                    <View style={styles.imagePlaceholder}>
                      <Ionicons name="camera" size={48} color={COLORS.primary} />
                    </View>
                  )}
                </View>
                <TouchableOpacity
                  style={[styles.modalButton, styles.imageButton]}
                  onPress={pickImage}
                >
                  <Text style={styles.buttonText}>Choose Image</Text>
                </TouchableOpacity>
                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setEditImageModalVisible(false)}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={handleImageUpdate}
                    disabled={!selectedImage}
                  >
                    <Text style={styles.buttonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
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
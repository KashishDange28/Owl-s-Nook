// mobile/app/(tabs)/create.jsx
import { View, Text, SafeAreaView, TextInput, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import styles from '../../assets/styles/create.styles';
import COLORS from '../../constants/colors';
import { useBookStore } from '../../store/bookStore';

export default function CreateBook() {
  const [formData, setFormData] = useState({
    title: '',
    rating: 0,
    caption: '',
    image: null,
    base64Image: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const { createBook, fetchUserBooks } = useBookStore();

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const pickImage = useCallback(async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'We need permission to access your photos to select a book image.'
        );
        return;
      }

      // Pick image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: true,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        const base64 = result.assets[0].base64;
        
        // Validate image size
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const imageSize = blob.size;
        
        if (imageSize > 5000000) { // 5MB limit
          Alert.alert(
            'Image Too Large',
            'Please select an image smaller than 5MB.'
          );
          return;
        }

        handleInputChange('image', imageUri);
        handleInputChange('base64Image', base64);
        Alert.alert(
          'Image Selected',
          'Your book image has been selected. Tap Save to add the book.'
        );
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert(
        'Error',
        'Failed to pick image. Please try again.'
      );
    }
  }, [handleInputChange]);

  const renderStars = useCallback(() => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity 
          key={i} 
          onPress={() => handleInputChange('rating', i)}
          style={styles.starContainer}
        >
          <Ionicons
            name={i <= formData.rating ? "star" : "star-outline"}
            size={30}
            color={i <= formData.rating ? "#FFD700" : COLORS.gray}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  }, [formData.rating, handleInputChange]);

  const handleSubmit = useCallback(async () => {
    if (!formData.title || !formData.rating || !formData.caption || !formData.image) {
      Alert.alert("Missing Information", "Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      // Ensure base64 is properly formatted
      const base64Image = formData.base64Image 
        ? (formData.base64Image.startsWith('data:image') 
          ? formData.base64Image 
          : `data:image/jpeg;base64,${formData.base64Image}`)
        : null;

      // Show loading state
      Alert.alert('Uploading...', 'Please wait while we add your book');
      
      // Send to backend
      const result = await createBook({
        title: formData.title,
        rating: formData.rating,
        caption: formData.caption,
        image: base64Image
      });

      console.log("Book creation result:", result);
      
      // Fetch user books to update profile immediately
      await fetchUserBooks();
      
      Alert.alert("Success", "Book added successfully!");
      setFormData({ title: '', rating: 0, caption: '', image: null, base64Image: null });
      
    } catch (error) {
      console.error("Book creation error:", JSON.stringify(error, null, 2));
      Alert.alert(
        "Error", 
        error.response?.data?.message || 
        error.message || 
        "Failed to add book"
      );
    } finally {
      setIsLoading(false);
    }
  }, [formData, createBook, fetchUserBooks]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/images/favicon.png')}
              style={styles.logoImage}
            />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.brandName}>Owl's Nook</Text>
            
            <Text style={styles.subText}>Share your favorite reads</Text>
          </View>
        </View>
        <View style={styles.decorativeLine} />
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentContainer}
      >
        {/* Book Title Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Book Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter book title"
            value={formData.title}
            onChangeText={(text) => handleInputChange('title', text)}
          />
        </View>

        {/* Rating */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Your Rating</Text>
          <View style={styles.starsContainer}>
            {renderStars()}
          </View>
        </View>

        {/* Image Upload */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Book Image</Text>
          <TouchableOpacity 
            style={styles.imageUploadContainer} 
            onPress={pickImage}
          >
            {formData.image ? (
              <Image 
                source={{ uri: formData.image }} 
                style={styles.uploadedImage} 
              />
            ) : (
              <>
                <Ionicons 
                  name="image-outline" 
                  size={40} 
                  color={COLORS.gray} 
                />
                <Text style={styles.uploadText}>Tap to select image</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Caption Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Caption</Text>
          <TextInput
            style={[styles.input, styles.captionInput]}
            placeholder="Write your review or thoughts about this book"
            value={formData.caption}
            onChangeText={(text) => handleInputChange('caption', text)}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          style={[
            styles.submitButton,
            (!formData.title || !formData.rating || !formData.caption || !formData.image) && 
            styles.submitButtonDisabled
          ]} 
          onPress={handleSubmit}
          disabled={isLoading || !formData.title || !formData.rating || !formData.caption || !formData.image}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>
              Post Recommendation
            </Text>
          )}
        </TouchableOpacity>

        {/* Add bottom padding for scrolling */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}
// mobile/app/(tabs)/index.jsx
import { View, Text, ScrollView, SafeAreaView, Image, TouchableOpacity, Linking, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import styles from '../../assets/styles/home.styles';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';
import { useBookStore } from '../../store/bookStore';
import { useAuthStore } from '../../store/authStore';

export default function Home() {
  const router = useRouter();
  const { books, fetchBooks, deleteBook } = useBookStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDelete = async (bookId) => {
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
              await deleteBook(bookId);
              Alert.alert("Success", "Book deleted successfully");
            } catch (error) {
              Alert.alert("Error", error.message || "Failed to delete book");
            }
          } 
        }
      ]
    );
  };

  const [dummyBooks, setDummyBooks] = useState([
    {
      id: 1,
      title: 'Harry Potter and the Philosopher\'s Stone',
      rating: 5,
      description: 'The first book in the Harry Potter series, introducing the magical world of Hogwarts.',
      image: 'https://upload.wikimedia.org/wikipedia/en/6/6b/Harry_Potter_and_the_Philosopher%27s_Stone_Book_Cover.jpg',
      date: '3/10/2025',
      wikiLink: 'https://en.wikipedia.org/wiki/Harry_Potter_and_the_Philosopher%27s_Stone',
      user: {
        name: 'Emma Watson',
        avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=Emma'
      }
    },
    {
      id: 2,
      title: 'The Hobbit',
      rating: 5,
      description: 'A fantasy novel about the adventures of Bilbo Baggins in Middle-earth.',
      image: 'https://upload.wikimedia.org/wikipedia/en/4/4a/TheHobbit_FirstEdition.jpg',
      date: '3/9/2025',
      wikiLink: 'https://en.wikipedia.org/wiki/The_Hobbit',
      user: {
        name: 'Peter Jackson',
        avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=Peter'
      }
    },
    {
      id: 3,
      title: 'Pride and Prejudice',
      rating: 5,
      description: 'A romantic novel of manners by Jane Austen, following the emotional development of Elizabeth Bennet.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/PrideAndPrejudiceTitlePage.jpg',
      date: '3/8/2025',
      wikiLink: 'https://en.wikipedia.org/wiki/Pride_and_Prejudice',
      user: {
        name: 'Jane Austen',
        avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=Jane'
      }
    },
    {
      id: 4,
      title: 'To Kill a Mockingbird',
      rating: 5,
      description: 'A powerful story of racial injustice and the loss of innocence in the American South.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/To_Kill_a_Mockingbird_%28first_edition_cover%29.jpg',
      date: '3/7/2025',
      wikiLink: 'https://en.wikipedia.org/wiki/To_Kill_a_Mockingbird',
      user: {
        name: 'Harper Lee',
        avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=Harper'
      }
    },
    {
      id: 5,
      title: 'The Great Gatsby',
      rating: 5,
      description: 'A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/The_Great_Gatsby_Cover_1925_Retouched.jpg',
      date: '3/6/2025',
      wikiLink: 'https://en.wikipedia.org/wiki/The_Great_Gatsby',
      user: {
        name: 'F. Scott Fitzgerald',
        avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=Scott'
      }
    },
    {
      id: 6,
      title: 'The Alchemist',
      rating: 5,
      description: 'A philosophical book about a young Andalusian shepherd who dreams of finding a worldly treasure.',
      image: 'https://m.media-amazon.com/images/I/51Z0nLAfLmL._SY425_.jpg',
      date: '3/5/2025',
      wikiLink: 'https://en.wikipedia.org/wiki/The_Alchemist_(novel)',
      user: {
        name: 'Paulo Coelho',
        avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=Paulo'
      }
    }
  ]);

  // Combine default books with user recommendations
  const allBooks = [...dummyBooks, ...books];

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

  const handleWikiLink = (url) => {
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Logo */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/images/favicon.png')}
              style={styles.logoImage}
            />
          </View>
          <Text style={styles.headerTitle}>Owl's Nook 📚</Text>
        </View>
        <Text style={styles.headerSubtitle}>Discover great reads from the community ⚡</Text>
      </View>

      <ScrollView 
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {allBooks.map((book) => (
          <View key={book._id || book.id} style={styles.bookCard}>
            <View style={styles.userInfo}>
              <Image 
                source={{ uri: book.user?.avatar || 'https://api.dicebear.com/6.x/avataaars/svg?seed=default' }}
                style={styles.userAvatar}
              />
              <Text style={styles.userName}>{book.user?.name || 'Anonymous'}</Text>
            </View>

            <TouchableOpacity 
              style={styles.bookImageContainer}
              onPress={() => handleWikiLink(book.wikiLink)}
            >
              <Image
                source={{ uri: book.image }}
                style={styles.bookImage}
                resizeMode="cover"
              />
              <View style={styles.wikiLinkOverlay}>
                <Ionicons name="information-circle-outline" size={24} color="#fff" />
                <Text style={styles.wikiLinkText}>Learn More</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.bookInfo}>
              <Text style={styles.bookTitle}>{book.title}</Text>
              <View style={styles.ratingContainer}>
                {renderStars(book.rating)}
              </View>
              <Text style={styles.bookDescription}>{book.caption || book.description}</Text>
              <Text style={styles.dateText}>{book.createdAt || book.date}</Text>
            </View>

            {/* Only show delete button for the book's owner */}
            {user?._id === book.user?._id && (
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => handleDelete(book._id)}
              >
                <Ionicons name="trash-outline" size={20} color="#666" />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Chat Button */}
      <TouchableOpacity 
        style={chatButtonStyles.chatButton}
        onPress={() => router.push('/chat')}
      >
        <Ionicons name="chatbubbles" size={24} color="#fff" />
        <View style={chatButtonStyles.chatBadge}>
          <Text style={chatButtonStyles.badgeText}>3</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// Chat button styles
const chatButtonStyles = StyleSheet.create({
  chatButton: {
    position: 'absolute',
    right: 20,
    bottom: 80, // Positioned above the tab bar
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  chatBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF3B30',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
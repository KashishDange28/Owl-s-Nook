// mobile/app/chat.jsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import styles from '../assets/styles/chat.styles';
import COLORS from '../constants/colors';

// User profiles with distinct personalities
const USER_PROFILES = {
  'Sarah Smith': {
    avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=Sarah',
    personality: "Sarah is an avid reader who loves psychological thrillers and contemporary fiction. She's analytical and enjoys deep discussions about character development and plot twists. She often recommends books with complex narratives.",
  },
  'John Doe': {
    avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=John',
    personality: "John is a sci-fi and fantasy enthusiast. He's passionate about world-building and scientific accuracy in books. He enjoys discussing the technical aspects of stories and often recommends books with strong world-building.",
  },
  'Emma Wilson': {
    avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=Emma',
    personality: "Emma loves historical fiction and literary classics. She's eloquent and enjoys discussing themes and symbolism in books. She often recommends books with rich historical context and beautiful prose.",
  },
};

export default function Chat() {
  const router = useRouter();
  const scrollViewRef = useRef();
  const [message, setMessage] = useState('');
  const [showAddPeople, setShowAddPeople] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [participants, setParticipants] = useState(3);

  // Initial messages state with some sample conversations
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: {
        name: 'Sarah Smith',
        avatar: USER_PROFILES['Sarah Smith'].avatar,
      },
      text: "Just finished 'The Midnight Library' by Matt Haig. It's a must-read!",
      timestamp: '2:30 PM',
    },
    {
      id: 2,
      user: {
        name: 'John Doe',
        avatar: USER_PROFILES['John Doe'].avatar,
      },
      text: "I've heard great things about that book. What's your favorite part?",
      timestamp: '2:32 PM',
    },
    {
      id: 3,
      user: {
        name: 'Emma Wilson',
        avatar: USER_PROFILES['Emma Wilson'].avatar,
      },
      text: "I'm currently reading it too! The concept is fascinating.",
      timestamp: '2:35 PM',
    },
  ]);

  // Sample suggested users to add
  const [suggestedUsers] = useState([
    {
      id: 1,
      name: 'Michael Johnson',
      avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=Michael',
      status: 'Active now',
    },
    {
      id: 2,
      name: 'Lisa Anderson',
      avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=Lisa',
      status: 'Last seen 2h ago',
    },
    {
      id: 3,
      name: 'David Wilson',
      avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=David',
      status: 'Active now',
    },
  ]);

  const getCohereResponse = async (userName, conversationHistory, userMessage) => {
    try {
      const userProfile = USER_PROFILES[userName];
      const prompt = `
        You are ${userName}, a book enthusiast with the following personality: ${userProfile.personality}
        
        Previous conversation:
        ${conversationHistory.map(msg => `${msg.user.name}: ${msg.text}`).join('\n')}
        
        Latest message: ${userMessage}
        
        Respond naturally as ${userName}, maintaining your personality and interests. Keep the response conversational and book-focused.
      `;

      const response = await fetch('https://api.cohere.ai/v1/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer TwFXtvmN63UMvGZjGrO3zZNFHHrOVKo5I0PpzXO8`,
        },
        body: JSON.stringify({
          prompt: prompt,
          max_tokens: 150,
          temperature: 0.7,
          k: 0,
          stop_sequences: ['\n'],
          return_likelihoods: 'NONE',
        }),
      });

      const data = await response.json();
      return data.generations[0].text.trim();
    } catch (error) {
      console.error('Error getting Cohere response:', error);
      return "I'm having trouble responding right now. Please try again later.";
    }
  };

  const handleSend = async () => {
    if (message.trim()) {
      const userMessage = {
        id: messages.length + 1,
        user: {
          name: 'You',
          avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=You',
        },
        text: message.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, userMessage]);
      setMessage('');
      
      // Get responses from different users
      setIsLoading(true);
      
      // Get the last 5 messages for context
      const recentMessages = messages.slice(-5);
      
      // Get responses from each user
      const users = ['Sarah Smith', 'John Doe', 'Emma Wilson'];
      for (const userName of users) {
        const response = await getCohereResponse(userName, recentMessages, userMessage.text);
        
        const responseMessage = {
          id: messages.length + 2,
          user: {
            name: userName,
            avatar: USER_PROFILES[userName].avatar,
          },
          text: response,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages(prev => [...prev, responseMessage]);
        
        // Add a small delay between responses
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      setIsLoading(false);
      
      // Scroll to bottom after all responses
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleAddUser = (user) => {
    // Add welcome message for new user
    const welcomeMessage = {
      id: messages.length + 1,
      user: {
        name: 'System',
        avatar: 'https://api.dicebear.com/6.x/bottts/svg?seed=System',
      },
      text: `Welcome ${user.name} to our book community! 🎉`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, welcomeMessage]);
    setParticipants(prev => prev + 1);
    setShowAddPeople(false);
  };

  // Filter suggested users based on search query
  const filteredUsers = suggestedUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../assets/images/favicon.png')}
              style={styles.logoImage}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Book Club Chat</Text>
            <Text style={styles.headerSubtitle}>{participants} participants</Text>
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowAddPeople(true)}
          >
            <Ionicons name="person-add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((msg) => (
            <View key={msg.id} style={styles.messageWrapper}>
              <Image 
                source={{ uri: msg.user.avatar }}
                style={styles.userAvatar}
              />
              <View style={styles.messageContent}>
                <View style={styles.messageHeader}>
                  <Text style={styles.userName}>{msg.user.name}</Text>
                  <Text style={styles.timestamp}>{msg.timestamp}</Text>
                </View>
                <Text style={styles.messageText}>{msg.text}</Text>
              </View>
            </View>
          ))}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={styles.loadingText}>Community members are typing...</Text>
            </View>
          )}
        </ScrollView>

        {/* Message Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Type your message..."
            multiline
            maxLength={500}
            placeholderTextColor={COLORS.gray}
          />
          <TouchableOpacity
            style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!message.trim() || isLoading}
          >
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Add People Modal */}
      <Modal
        visible={showAddPeople}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddPeople(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add People</Text>
              <TouchableOpacity 
                onPress={() => setShowAddPeople(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search people..."
              placeholderTextColor={COLORS.gray}
            />

            <ScrollView style={styles.suggestedUsers}>
              {filteredUsers.map((user) => (
                <TouchableOpacity 
                  key={user.id} 
                  style={styles.userItem}
                  onPress={() => handleAddUser(user)}
                >
                  <Image 
                    source={{ uri: user.avatar }}
                    style={styles.suggestedUserAvatar}
                  />
                  <View style={styles.userInfo}>
                    <Text style={styles.suggestedUserName}>{user.name}</Text>
                    <Text style={styles.userStatus}>{user.status}</Text>
                  </View>
                  <Ionicons name="add-circle-outline" size={24} color={COLORS.primary} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
# Owl's Nook - AI-Powered Book Recommendation Platform

## Project Overview
Owl's Nook is an innovative mobile application created using MERN Stack in react native expo that revolutionizes book discovery through AI-powered community interactions. Leveraging cutting-edge technology, the app creates a dynamic ecosystem where book lovers can share, discover, and engage with literary content in unprecedented ways.

## Key Innovations
- **AI-Powered Community Chat**: Intelligent conversational features that enhance book recommendations
- **Personalized Discovery**: Machine learning algorithms that understand user preferences
- **Social Reading Experience**: Connect with like-minded readers and explore diverse literary worlds

## Core Features
- 🔐 Secure User Authentication
- 📚 Personal Book Collections
- ⭐ Book Rating and Captioning
- 🤖 AI-Driven Recommendation Engine
- 📸 Image-Based Book Uploads
- 💬 Community Interaction Spaces

## Problem Solved
Traditional book recommendation platforms lack personalization and meaningful community engagement. Owl's Nook bridges this gap by:
- Providing intelligent, context-aware book suggestions
- Creating an interactive platform for book enthusiasts
- Leveraging AI to understand nuanced reading preferences

## Tech Stack

### Frontend
- React Native
- Expo
- Zustand (State Management)
- Axios (HTTP Requests)
- Expo Router
- Expo Image Picker

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Cloudinary (Image Storage)
- JSON Web Token (Authentication)

### Development Tools
- TypeScript
- ESLint
- Prettier

## Prerequisites
- Node.js (v16+)
- npm or Yarn
- Expo CLI
- MongoDB
- Cloudinary Account

## Installation

### Clone the Repository
```bash
git clone https://github.com/yourusername/owls-nook.git
cd owls-nook
```

### Backend Setup
1. Navigate to backend directory
```bash
cd backend
npm install
```

2. Create `.env` file with:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

3. Run backend server
```bash
npm run dev
```

### Frontend App Setup
1. Navigate to mobile directory
```bash
cd mobile
npm install
```

2. Update API endpoint in `store/bookStore.js`:
```javascript
const API_URL = 'http://your-local-ip:3000/api'
```

3. Start Expo development server
```bash
npx expo start
```

## Environment Configuration
- Development: Use local MongoDB Atlas and backend
- Production: Configure cloud MongoDB and backend deployment

## Testing and Deployment
- Backend: Postman, deploy: Render or Heroku
- Frontend: React Native Testing Library, deploy: Expo App Store

## License
Distributed under the MIT License. See [LICENSE](LICENSE) file for more details.

## Contact
Kashish Dange - [Your Email]
Project Link: [https://github.com/yourusername/owls-nook](https://github.com/yourusername/owls-nook)

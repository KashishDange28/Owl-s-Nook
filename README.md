# 🦉 Owl's Nook – Book Recommendation Platform with AI community

A smart and social mobile app for discovering books through AI-powered community interactions It is a mobile application built using the **MERN Stack + React Native (Expo)** that enhances book discovery through intelligent suggestions and community engagement.

## 🛠 Tech Stack

### Frontend
- React Native (Expo)
- Zustand
- Axios
- Expo Router
- Expo Image Picker

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Cloudinary
- JSON Web Token (JWT) Authentication

### Development Tools
- TypeScript
- ESLint
- Prettier

---

## ⚙️ Installation

### 1. Clone the Repository

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

## Testing and Deployment
- Backend: Postman, deploy: Render or Heroku
- Frontend: React Native Testing Library, deploy: Expo App Store

## License
Distributed under the MIT License. See [LICENSE](LICENSE) file for more details.

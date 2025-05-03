# Owl's Nook - Book Recommendation Mobile App

## Description
Owl's Nook is a mobile application that allows users to discover, share, and recommend books. Users can create personal book collections, rate books, and explore recommendations from the community.

## Features
- User Authentication (Login/Signup)
- Create and manage book recommendations
- Rate and caption books
- View community book recommendations
- Profile management
- Image upload for book covers

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

### Mobile App Setup
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
- Development: Use local MongoDB and backend
- Production: Configure cloud MongoDB and backend deployment

## Testing
- Backend: Jest
- Frontend: React Native Testing Library

## Deployment
- Backend: Render or Heroku
- Frontend: Expo App Store / Google Play Store

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
Distributed under the MIT License.

## Contact
Kashish Dange - [Your Email]
Project Link: [https://github.com/yourusername/owls-nook](https://github.com/yourusername/owls-nook)

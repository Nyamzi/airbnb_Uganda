# Airbnb Uganda - React Application

A modern React-based Airbnb clone showcasing properties across Uganda, built with Firebase for backend services and authentication.

## Features

- 🔐 User Authentication (Email/Password, Google, Facebook)
- 🏠 Property Listings with detailed views
- 🔍 Advanced filtering and search functionality
- 📱 Responsive design for all devices
- 🗺️ Property location information
- 👥 Host profiles and contact information
- 💰 Price display in Ugandan Shillings (UGX)
- 🖼️ Image galleries for properties
- 📞 Direct contact options (WhatsApp, SMS, Call, Email)

## Technologies Used

- **Frontend**: React.js, React Router
- **Backend**: Firebase (Firestore, Authentication)
- **Styling**: CSS3 with responsive design
- **Deployment**: Ready for deployment on various platforms

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/airbnb-uganda.git
cd airbnb-uganda
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:
   - Create a new Firebase project
   - Enable Authentication (Email/Password, Google, Facebook)
   - Create a Firestore database
   - Update the Firebase configuration in `src/firebase.js`

4. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## Project Structure

```
airbnb/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Auth.jsx
│   │   ├── Auth.css
│   │   ├── Listings.jsx
│   │   ├── Listings.css
│   │   ├── PropertyDetails.jsx
│   │   ├── PropertyDetails.css
│   │   ├── Navbar.jsx
│   │   ├── Navbar.css
│   │   ├── ContactHostModal.jsx
│   │   └── ContactHostModal.css
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── data/
│   │   ├── sampleProperties.js
│   │   └── hosts.js
│   ├── App.jsx
│   ├── App.css
│   ├── firebase.js
│   └── index.js
├── package.json
└── README.md
```

## Features in Detail

### Authentication
- Secure user registration and login
- Social authentication with Google and Facebook
- Protected routes for authenticated users
- User session management

### Property Listings
- Browse properties across Uganda
- Filter by location, price range, and property type
- Search functionality
- Responsive grid layout

### Property Details
- Comprehensive property information
- Image galleries with navigation
- Host profiles and contact details
- Location information and nearby attractions
- Booking/contact functionality

### Contact System
- Multiple contact methods (WhatsApp, SMS, Call, Email)
- Pre-filled messages for easy communication
- Host-specific contact information

## Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication with desired providers
3. Create a Firestore database
4. Update the configuration in `src/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Firebase Hosting
1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase hosting:
```bash
firebase init hosting
```

4. Deploy:
```bash
firebase deploy
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by Airbnb's design and functionality
- Built with modern React practices
- Firebase for backend services
- Community contributors and feedback

## Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter) - email@example.com

Project Link: [https://github.com/yourusername/airbnb-uganda](https://github.com/yourusername/airbnb-uganda) 
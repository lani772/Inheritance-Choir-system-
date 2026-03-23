# Inheritance Choir Management System

A full-featured React-based choir management dashboard.

## Setup Instructions

### Firebase Configuration

This application uses Firebase for authentication and database storage. To set it up:

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project or select an existing one.
3. Enable **Authentication** (Email/Password provider).
4. Enable **Firestore Database** (Start in test mode for development, then update security rules).
5. Register a Web App in your Firebase project settings.
6. Copy the configuration values and add them to your AI Studio environment variables (or `.env.local` if running locally):
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

Once these are set, the application will connect to your Firebase instance.

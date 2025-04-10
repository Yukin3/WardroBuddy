# 👗 WardroBuddy

WardroBuddy is your AI-powered wardrobe assistant designed to help you **manage your closet, plan outfits**, and **get smart recommendations** before you buy. Say goodbye to impulse shopping and fashion mismatches — our system gives you curated style advice based on your wardrobe, wishlist, and personal aesthetic.

### ✨ Key Features

- Save and organize outfit photos
- Get AI-based compatibility feedback before buying new clothes
- Track your personal style and wishlist over time
- Make better wardrobe decisions based on data

---

## 🛠️ Tech Stack

- **Expo Go** + **React Native** for cross-platform mobile app development
- **Firebase** for authentication, backend, and cloud storage
- **NativeWind CSS** for Tailwind styling principles
- **OpenAI API** for fashion recommendation and style intelligence
- **Keras** + **Tensor Flow** for deep-learning and similarity model

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npx expo start
```

From here, you'll be able to launch the app in:

- [Expo Go](https://expo.dev/go) on your mobile device
- iOS/Android simulator
- A development build

---

## ⚙️ Required Setup Before Running Locally

To fully run WardroBuddy locally, you'll go through a few extra steps:

### 🔐 1. Create a `.env` file

Use the provided `.env.example` file and insert your Firebase API key:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=replace-with-your-own-key
```

> This is used in `config/firebase.ts` to initialize Firebase securely.

### 🔧 2. Replace Firebase Config

Update the following in `config/firebase.ts` using your own Firebase project credentials:

```ts
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-messaging-id",
  appId: "your-app-id",
  databaseURL: "your-database-url",
};
```

You’ll need a Firebase project set up with **Authentication**, **Firestore**, and **Storage** enabled.

> To use Firebase Storage you'll have to `upgrade` your account and include`billing info`.

### 📱 3. Create an Expo account & download Expo Go

- Sign up at [expo.dev](https://expo.dev)
- Download [Expo Go](https://expo.dev/go) on your iOS/Android device
- Log in to your Expo account via the CLI or Expo Go app

---

## 🧹 Resetting Project (Optional)

To reset and start clean:

```bash
npm run reset-project
```

This will archive the starter files and create a blank slate in the `app/` directory.

---

## 📚 Learn More

- [Expo Docs](https://docs.expo.dev/)
- [Firebase Docs](https://firebase.google.com/docs/)
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [OpenAI Docs](https://platform.openai.com/docs)

---

## 🌐 Join the Community

- [Expo on GitHub](https://github.com/expo/expo)
- [Expo Discord](https://chat.expo.dev)

---

## 💌 Contact

Have ideas, feedback, or want to contribute?

Open an issue or contact me at my **[LinkedIn](https://www.linkedin.com/in/mmokutu/)**.

---

## ![WardroBuddy demo](https://raw.githubusercontent.com/Yukin3/Yukin3/refs/heads/main/asset/space.jpg)

## 📊 Project Insights

Upcoming

```

---

```

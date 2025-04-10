import { User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';

interface FirestoreUser {
  name: string;
  email: string;
  photoUrl: string;
  onboardingCompleted: boolean;
  preferences: {
    aesthetics: string[];
    shoppingGoals: string[];
  };
  followers: string[];
  following: string[];
  createdAt: any;
  updatedAt: any;
}

export const createUserDocument = async (user: User): Promise<void> => {
  if (!user) return;

  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const userData: FirestoreUser = {
      name: user.displayName || '',
      email: user.email || '',
      photoUrl: user.photoURL || '',
      onboardingCompleted: false,
      preferences: {
        aesthetics: [],
        shoppingGoals: []
      },
      followers: [],
      following: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    try {
      await setDoc(userRef, userData);
      console.log('User document created successfully');
    } catch (error) {
      console.error('Error creating user document:', error);
    }
  } else {
    console.log('User document already exists');
  }
}; 
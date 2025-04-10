import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';

export async function saveUserPreferences(preferences) {
  const user = auth.currentUser;
  if (!user) return;

  const userRef = doc(db, 'users', user.uid);
  await setDoc(userRef, {
    preferences,
    onboardingCompleted: true,
  }, { merge: true });
}

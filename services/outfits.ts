import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';

export async function addOutfit({ imageUrl, details, rating, genre, date }) {
  const outfitRef = collection(db, 'outfits');
  return await addDoc(outfitRef, {
    userId: auth.currentUser?.uid,
    imageUrl,
    details,
    rating,
    genre,
    date: date || null,
    createdAt: serverTimestamp(),
  });
}

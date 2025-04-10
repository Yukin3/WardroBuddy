import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';

export async function addWishlistItem({ imageUrl, name, notes, clothingAnalysis }) {
  const wishlistRef = collection(db, 'wishlist');
  return await addDoc(wishlistRef, {
    userId: auth.currentUser?.uid,
    imageUrl,
    name,
    notes,
    clothingAnalysis: clothingAnalysis || null,
    createdAt: serverTimestamp(),
  });
}

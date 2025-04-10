import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { auth, db } from '@/config/firebase';

export function useOutfits() {
  const [outfits, setOutfits] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, 'outfits'),
      where('userId', '==', user.uid)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setOutfits(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsub();
  }, []);

  return outfits;
}

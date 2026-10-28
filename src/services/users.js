import { db } from '../firebase.js';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';

const USERS_COLLECTION = 'users';

export const usersService = {
  // Crear o actualizar perfil de usuario
  async upsertUser(userId, userData) {
    const data = {
      ...userData,
      updatedAt: serverTimestamp(),
    };
    await setDoc(doc(db, USERS_COLLECTION, userId), data, { merge: true });
  },

  // Obtener perfil de usuario
  async getUser(userId) {
    const docRef = doc(db, USERS_COLLECTION, userId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() };
  },
};

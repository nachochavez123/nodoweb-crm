import { db } from '../firebase.js';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  where,
} from 'firebase/firestore';

const PROSPECTS_COLLECTION = 'prospects';

export const prospectService = {
  // Escuchar cambios en tiempo real de los prospectos
  onProspectsChange(callback) {
    const q = query(collection(db, PROSPECTS_COLLECTION), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const prospects = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      callback(prospects);
    });
  },

  // Obtener un prospecto por ID
  async getProspect(id) {
    const docRef = doc(db, PROSPECTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() };
  },

  // Crear un nuevo prospecto
  async createProspect(prospectData, userId) {
    const data = {
      ...prospectData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const docRef = await addDoc(collection(db, PROSPECTS_COLLECTION), data);
    return docRef.id;
  },

  // Actualizar un prospecto existente
  async updateProspect(id, updates, userId) {
    const data = {
      ...updates,
      updatedAt: serverTimestamp(),
      updatedBy: userId,
    };
    await updateDoc(doc(db, PROSPECTS_COLLECTION, id), data);
  },

  // Eliminar un prospecto
  async deleteProspect(id) {
    await deleteDoc(doc(db, PROSPECTS_COLLECTION, id));
  },
};

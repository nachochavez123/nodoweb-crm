import { db } from '../firebase.js';
import {
  collection,
  doc,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  where,
} from 'firebase/firestore';

const NOTES_COLLECTION = 'notes';

export const notesService = {
  // Escuchar notas en tiempo real de un prospecto
  onProspectNotesChange(prospectId, callback) {
    const q = query(
      collection(db, NOTES_COLLECTION),
      where('prospectId', '==', prospectId),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const notes = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      callback(notes);
    });
  },

  // Crear una nueva nota
  async createNote(noteData, userId, userName) {
    const data = {
      ...noteData,
      userId,
      userName,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const docRef = await addDoc(collection(db, NOTES_COLLECTION), data);
    return docRef.id;
  },

  // Actualizar una nota existente
  async updateNote(id, updates, userId) {
    const data = {
      ...updates,
      updatedAt: serverTimestamp(),
      updatedBy: userId,
    };
    await updateDoc(doc(db, NOTES_COLLECTION, id), data);
  },

  // Eliminar una nota
  async deleteNote(id) {
    await deleteDoc(doc(db, NOTES_COLLECTION, id));
  },
};

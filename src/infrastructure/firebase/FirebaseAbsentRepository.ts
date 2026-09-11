import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from './firebaseClient';
import { AbsentRepository } from '../../domain/ports/AbsentRepository';
import { Absent } from '../../domain/types';

export class FirebaseAbsentRepository implements AbsentRepository {
  async getAbsentsByMonth(year: number, month: number): Promise<Absent[]> {
    try {
      const prefix = `${year}-${String(month).padStart(2, '0')}`;
      const q = query(
        collection(db, 'absents'),
        where('date', '>=', `${prefix}-01`),
        where('date', '<=', `${prefix}-31`)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Absent, 'id'>),
      }));
    } catch (e) {
      console.warn('Firestore getAbsentsByMonth restricted:', e);
      return [];
    }
  }

  async createAbsent(absent: Omit<Absent, 'id'>): Promise<Absent> {
    try {
      const docRef = await addDoc(collection(db, 'absents'), absent);
      return { id: docRef.id, ...absent };
    } catch (e) {
      console.warn('Firestore createAbsent restricted:', e);
      return { id: `local-${Date.now()}`, ...absent };
    }
  }

  async deleteAbsent(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'absents', id));
    } catch (e) {
      console.warn('Firestore deleteAbsent restricted:', e);
    }
  }

  async getAbsentsByUser(userId: string): Promise<Absent[]> {
    try {
      const q = query(collection(db, 'absents'), where('userId', '==', userId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Absent, 'id'>),
      }));
    } catch (e) {
      console.warn('Firestore getAbsentsByUser restricted:', e);
      return [];
    }
  }
}

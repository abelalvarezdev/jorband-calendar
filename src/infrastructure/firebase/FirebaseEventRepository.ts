import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from './firebaseClient';
import { EventRepository } from '../../domain/ports/EventRepository';
import { Event } from '../../domain/types';

export class FirebaseEventRepository implements EventRepository {
  async getEventsByMonth(year: number, month: number): Promise<Event[]> {
    try {
      const prefix = `${year}-${String(month).padStart(2, '0')}`;
      const q = query(
        collection(db, 'events'),
        where('date', '>=', `${prefix}-01`),
        where('date', '<=', `${prefix}-31`)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Event, 'id'>),
      }));
    } catch (e) {
      console.warn('Firestore getEventsByMonth restricted:', e);
      return [];
    }
  }

  async createEvents(events: Omit<Event, 'id'>[]): Promise<Event[]> {
    const created: Event[] = [];
    for (const item of events) {
      try {
        const docRef = await addDoc(collection(db, 'events'), item);
        created.push({ id: docRef.id, ...item });
      } catch (e) {
        console.warn('Firestore createEvent restricted:', e);
        created.push({ id: `local-${Date.now()}`, ...item });
      }
    }
    return created;
  }

  async updateEvent(id: string, updates: Partial<Event>): Promise<Event> {
    try {
      const docRef = doc(db, 'events', id);
      await updateDoc(docRef, updates);
    } catch (e) {
      console.warn('Firestore updateEvent restricted:', e);
    }
    return { id, ...updates } as Event;
  }

  async deleteEvent(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'events', id));
    } catch (e) {
      console.warn('Firestore deleteEvent restricted:', e);
    }
  }
}

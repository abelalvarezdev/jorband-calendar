import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { auth, db } from './firebaseClient';
import { AuthRepository } from '../../domain/ports/AuthRepository';
import { User, LoginCredentials, RegisterData } from '../../domain/types';

export class FirebaseAuthRepository implements AuthRepository {
  async login(credentials: LoginCredentials): Promise<User> {
    const res = await signInWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password || 'password123'
    );
    try {
      const userDoc = await getDoc(doc(db, 'users', res.user.uid));
      if (userDoc.exists()) {
        return { id: res.user.uid, ...(userDoc.data() as Omit<User, 'id'>) };
      }
    } catch (e) {
      console.warn('Firestore read restricted by security rules:', e);
    }

    return {
      id: res.user.uid,
      name: res.user.displayName || credentials.email.split('@')[0],
      email: credentials.email,
      role: 'User',
      instrument: 'Voz Principal',
    };
  }

  async register(data: RegisterData): Promise<User> {
    const res = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password || 'password123'
    );
    const newUser: User = {
      id: res.user.uid,
      name: data.name,
      email: data.email,
      role: data.role,
      instrument: data.instrument,
    };
    try {
      await setDoc(doc(db, 'users', res.user.uid), {
        name: data.name,
        email: data.email,
        role: data.role,
        instrument: data.instrument,
      });
    } catch (e) {
      console.warn('Firestore write restricted by security rules:', e);
    }
    return newUser;
  }

  async logout(): Promise<void> {
    await signOut(auth);
  }

  async getCurrentUser(): Promise<User | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        unsubscribe();
        if (!fbUser) {
          resolve(null);
          return;
        }
        try {
          const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
          if (userDoc.exists()) {
            resolve({ id: fbUser.uid, ...(userDoc.data() as Omit<User, 'id'>) });
            return;
          }
        } catch (e) {
          console.warn('Firestore user fetch restricted:', e);
        }
        resolve({
          id: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Usuario',
          email: fbUser.email || '',
          role: 'User',
          instrument: 'Voz Principal',
        });
      });
    });
  }

  async getAllMembers(): Promise<User[]> {
    try {
      const snapshot = await getDocs(collection(db, 'users'));
      return snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<User, 'id'>),
      }));
    } catch (e) {
      console.warn('Firestore getAllMembers restricted:', e);
      return [];
    }
  }
}

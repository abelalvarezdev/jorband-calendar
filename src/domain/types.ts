export type UserRole = 'Admin' | 'User';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  instrument: string;
}

export interface Event {
  id: string;
  date: string; // ISO format: YYYY-MM-DD
  eventName: string;
  time: string;
  principalSinger: string; // Member name or Guest name
  isGuestSinger: boolean;
}

export interface Absent {
  id: string;
  date: string; // ISO format: YYYY-MM-DD
  userId: string;
  userName: string;
  reason: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  instrument: string;
}

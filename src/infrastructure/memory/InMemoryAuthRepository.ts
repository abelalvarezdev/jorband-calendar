import { AuthRepository } from '../../domain/ports/AuthRepository';
import { User, LoginCredentials, RegisterData } from '../../domain/types';

const USERS_KEY = 'jorband_users';
const CURRENT_USER_KEY = 'jorband_current_user';

const INITIAL_USERS: User[] = [
  {
    id: 'user-admin-1',
    name: 'Carlos Admin',
    email: 'admin@jorband.com',
    role: 'Admin',
    instrument: 'Director / Guitarra',
  },
  {
    id: 'user-2',
    name: 'María Voz',
    email: 'maria@jorband.com',
    role: 'User',
    instrument: 'Voz Principal',
  },
  {
    id: 'user-3',
    name: 'Juan Guitarra',
    email: 'juan@jorband.com',
    role: 'User',
    instrument: 'Guitarra',
  },
  {
    id: 'user-4',
    name: 'Ana Trompeta',
    email: 'ana@jorband.com',
    role: 'User',
    instrument: 'Trompeta',
  },
  {
    id: 'user-5',
    name: 'David Batería',
    email: 'david@jorband.com',
    role: 'User',
    instrument: 'Batería',
  },
];

export class InMemoryAuthRepository implements AuthRepository {
  private getStoredUsers(): User[] {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_USERS;
    }
  }

  private saveUsers(users: User[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  async login(credentials: LoginCredentials): Promise<User> {
    const users = this.getStoredUsers();
    const found = users.find(
      (u) => u.email.toLowerCase() === credentials.email.toLowerCase()
    );

    if (found) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(found));
      return found;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: credentials.email.split('@')[0],
      email: credentials.email,
      role: 'User',
      instrument: 'Voz Principal',
    };
    users.push(newUser);
    this.saveUsers(users);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    return newUser;
  }

  async register(data: RegisterData): Promise<User> {
    const users = this.getStoredUsers();
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role,
      instrument: data.instrument,
    };
    users.push(newUser);
    this.saveUsers(users);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    return newUser;
  }

  async logout(): Promise<void> {
    localStorage.setItem(CURRENT_USER_KEY, 'null');
  }

  async getCurrentUser(): Promise<User | null> {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (raw === 'null') return null;
    if (!raw) {
      const defaultUser = INITIAL_USERS[0];
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(defaultUser));
      return defaultUser;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  async getAllMembers(): Promise<User[]> {
    return this.getStoredUsers();
  }
}

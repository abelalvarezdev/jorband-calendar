import { User, LoginCredentials, RegisterData } from '../types';

export interface AuthRepository {
  login(credentials: LoginCredentials): Promise<User>;
  register(data: RegisterData): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  getAllMembers(): Promise<User[]>;
}

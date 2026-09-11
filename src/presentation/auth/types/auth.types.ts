import { UserRole } from '../../../domain/types';

export interface AuthState {
  isLoginMode: boolean;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  instrument: string;
  error: string | null;
  loading: boolean;
}

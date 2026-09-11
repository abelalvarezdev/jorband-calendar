import { User } from '../../../domain/types';

export interface ProfileProps {
  user: User | null;
  onLogout: () => void;
}

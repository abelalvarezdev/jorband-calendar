import { Absent } from '../../../domain/types';

export interface AbsentFormState {
  date: string;
  reason: string;
  loading: boolean;
  toastMessage: string | null;
  toastType: 'success' | 'error';
}

export interface AbsentHistoryProps {
  absents: Absent[];
  onDelete?: (id: string) => void;
}

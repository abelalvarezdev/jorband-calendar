import { User } from '../../../domain/types';

export interface ConflictInfo {
  date: string;
  singerName: string;
  reason: string;
}

export interface EventsFormState {
  selectedDates: string[];
  eventName: string;
  eventTime: string;
  principalSinger: string;
  isGuestSinger: boolean;
  guestSingerName: string;
  conflicts: ConflictInfo[];
  loading: boolean;
}

export interface SingerSelectorProps {
  members: User[];
  principalSinger: string;
  setPrincipalSinger: (v: string) => void;
  isGuestSinger: boolean;
  setIsGuestSinger: (v: boolean) => void;
  guestSingerName: string;
  setGuestSingerName: (v: string) => void;
}

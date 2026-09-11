import { Absent } from '../types';

export interface AbsentRepository {
  getAbsentsByMonth(year: number, month: number): Promise<Absent[]>;
  createAbsent(absent: Omit<Absent, 'id'>): Promise<Absent>;
  deleteAbsent(id: string): Promise<void>;
  getAbsentsByUser(userId: string): Promise<Absent[]>;
}

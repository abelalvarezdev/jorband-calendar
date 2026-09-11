import { AbsentRepository } from '../../domain/ports/AbsentRepository';
import { Absent } from '../../domain/types';

const ABSENTS_KEY = 'jorband_absents';

function getInitialAbsents(): Absent[] {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');

  return [
    {
      id: 'absent-1',
      date: `${year}-${month}-08`,
      userId: 'user-2',
      userName: 'María Voz',
      reason: 'Viaje de trabajo fuera de la ciudad',
    },
    {
      id: 'absent-2',
      date: `${year}-${month}-15`,
      userId: 'user-3',
      userName: 'Juan Guitarra',
      reason: 'Cita médica familiar',
    },
  ];
}

export class InMemoryAbsentRepository implements AbsentRepository {
  private getStoredAbsents(): Absent[] {
    const raw = localStorage.getItem(ABSENTS_KEY);
    if (!raw) {
      const initial = getInitialAbsents();
      localStorage.setItem(ABSENTS_KEY, JSON.stringify(initial));
      return initial;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return getInitialAbsents();
    }
  }

  private saveAbsents(absents: Absent[]): void {
    localStorage.setItem(ABSENTS_KEY, JSON.stringify(absents));
  }

  async getAbsentsByMonth(year: number, month: number): Promise<Absent[]> {
    const absents = this.getStoredAbsents();
    const prefix = `${year}-${String(month).padStart(2, '0')}`;
    return absents.filter((a) => a.date.startsWith(prefix));
  }

  async createAbsent(data: Omit<Absent, 'id'>): Promise<Absent> {
    const absents = this.getStoredAbsents();
    const newAbsent: Absent = {
      ...data,
      id: `absent-${Date.now()}`,
    };
    absents.push(newAbsent);
    this.saveAbsents(absents);
    return newAbsent;
  }

  async deleteAbsent(id: string): Promise<void> {
    const absents = this.getStoredAbsents().filter((a) => a.id !== id);
    this.saveAbsents(absents);
  }

  async getAbsentsByUser(userId: string): Promise<Absent[]> {
    return this.getStoredAbsents().filter((a) => a.userId === userId);
  }
}

import { Event } from '../types';

export interface EventRepository {
  getEventsByMonth(year: number, month: number): Promise<Event[]>;
  createEvents(events: Omit<Event, 'id'>[]): Promise<Event[]>;
  deleteEvent(id: string): Promise<void>;
}

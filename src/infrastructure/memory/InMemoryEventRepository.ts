import { EventRepository } from '../../domain/ports/EventRepository';
import { Event } from '../../domain/types';

const EVENTS_KEY = 'jorband_events';

function getInitialEvents(): Event[] {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');

  return [
    {
      id: 'event-1',
      date: `${year}-${month}-03`,
      eventName: 'Concierto Dominical',
      time: '10:00 AM',
      principalSinger: 'María Voz',
      isGuestSinger: false,
    },
    {
      id: 'event-2',
      date: `${year}-${month}-08`,
      eventName: 'Culto de Adoración',
      time: '07:00 PM',
      principalSinger: 'María Voz',
      isGuestSinger: false,
    },
    {
      id: 'event-3',
      date: `${year}-${month}-12`,
      eventName: 'Noche de Gala',
      time: '08:00 PM',
      principalSinger: 'Carlos Admin',
      isGuestSinger: false,
    },
    {
      id: 'event-4',
      date: `${year}-${month}-17`,
      eventName: 'Evento Especial',
      time: '06:00 PM',
      principalSinger: 'Luis Rivera',
      isGuestSinger: true,
    },
  ];
}

export class InMemoryEventRepository implements EventRepository {
  private getStoredEvents(): Event[] {
    const raw = localStorage.getItem(EVENTS_KEY);
    if (!raw) {
      const initial = getInitialEvents();
      localStorage.setItem(EVENTS_KEY, JSON.stringify(initial));
      return initial;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return getInitialEvents();
    }
  }

  private saveEvents(events: Event[]): void {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  }

  async getEventsByMonth(year: number, month: number): Promise<Event[]> {
    const events = this.getStoredEvents();
    const prefix = `${year}-${String(month).padStart(2, '0')}`;
    return events.filter((e) => e.date.startsWith(prefix));
  }

  async createEvents(eventsData: Omit<Event, 'id'>[]): Promise<Event[]> {
    const existing = this.getStoredEvents();
    const newEvents: Event[] = eventsData.map((data, index) => ({
      ...data,
      id: `event-${Date.now()}-${index}`,
    }));

    // Replace any existing event on the same date or add new
    const eventMap = new Map<string, Event>();
    existing.forEach((e) => eventMap.set(e.date, e));
    newEvents.forEach((e) => eventMap.set(e.date, e));

    const updated = Array.from(eventMap.values());
    this.saveEvents(updated);
    return newEvents;
  }

  async deleteEvent(id: string): Promise<void> {
    const events = this.getStoredEvents().filter((e) => e.id !== id);
    this.saveEvents(events);
  }
}

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRepositories } from '../../../infrastructure/di/RepositoryContext';
import { User, Absent, Event } from '../../../domain/types';
import { buildSpecialEventNotification } from '../../../domain/services/notificationMessages';
import { getRecurringDatesInMonth, findSingerConflicts } from '../utils/eventsFormHelpers';

export const useEventsForm = () => {
  const { authRepository, eventRepository, absentRepository, notificationRepository } = useRepositories();
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
  const [members, setMembers] = useState<User[]>([]);
  const [monthAbsents, setMonthAbsents] = useState<Absent[]>([]);
  const [monthEvents, setMonthEvents] = useState<Event[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [eventName, setEventName] = useState('Culto de Adoración');
  const [eventTime, setEventTime] = useState('07:00 PM');
  const [notes, setNotes] = useState('');
  const [principalSinger, setPrincipalSinger] = useState('');
  const [isGuestSinger, setIsGuestSinger] = useState(false);
  const [guestSingerName, setGuestSingerName] = useState('');
  const [isSpecialEvent, setIsSpecialEvent] = useState(false);
  const [eventToRestore, setEventToRestore] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error' = 'success') => { setToast({ message, type }); setTimeout(() => setToast(null), 3500); };

  const loadData = useCallback(async () => {
    const [evts, mList, abs] = await Promise.all([eventRepository.getEventsByMonth(currentYear, currentMonth), authRepository.getAllMembers(), absentRepository.getAbsentsByMonth(currentYear, currentMonth)]);
    setMonthEvents(evts); setMembers(mList); setMonthAbsents(abs);
    if (mList.length > 0 && !principalSinger) setPrincipalSinger((mList.find((m) => m.instrument?.toLowerCase().includes('voz') || m.instrument?.toLowerCase().includes('cantante')) || mList[0]).name);
  }, [authRepository, eventRepository, absentRepository, currentYear, currentMonth, principalSinger]);
  useEffect(() => { loadData(); }, [loadData]);

  const activeSingerName = isGuestSinger ? guestSingerName.trim() : principalSinger;
  const conflicts = useMemo(() => findSingerConflicts(activeSingerName, isGuestSinger, selectedDates, members, monthAbsents), [activeSingerName, isGuestSinger, selectedDates, members, monthAbsents]);

  const handleConfirmRestore = async () => {
    if (!eventToRestore) return;
    setLoading(true);
    try {
      const updated = await eventRepository.updateEvent(eventToRestore.id, { eventName: eventName.trim(), time: eventTime, principalSinger: activeSingerName, isGuestSinger, isSpecialEvent, notes: notes.trim(), isCancelled: false, cancelReason: '' });
      if (isSpecialEvent) await notificationRepository.sendNotification(buildSpecialEventNotification({ ...eventToRestore, ...updated }));
      showToast(`¡Evento del ${eventToRestore.date} restaurado!`); setEventToRestore(null); setSelectedDates([]); setNotes(''); setIsSpecialEvent(false); await loadData();
    } finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDates.length === 0 || !activeSingerName || conflicts.length > 0) return showToast('Verifica fechas y disponibilidad del cantante', 'error');
    const cancelledMatch = monthEvents.find((evt) => evt.isCancelled && selectedDates.includes(evt.date));
    if (cancelledMatch) return setEventToRestore(cancelledMatch);
    setLoading(true);
    try {
      const created = await eventRepository.createEvents(selectedDates.map((date) => ({ date, eventName: eventName.trim(), time: eventTime, principalSinger: activeSingerName, isGuestSinger, isSpecialEvent, notes: notes.trim(), isCancelled: false })));
      if (isSpecialEvent) await Promise.all(created.map((evt) => notificationRepository.sendNotification(buildSpecialEventNotification(evt))));
      showToast(`¡${created.length} evento(s) programado(s)!`); setSelectedDates([]); setGuestSingerName(''); setNotes(''); setIsSpecialEvent(false); await loadData();
    } finally { setLoading(false); }
  };

  return { members, monthEvents, selectedDates, eventName, setEventName, eventTime, setEventTime, notes, setNotes, principalSinger, setPrincipalSinger, isGuestSinger, setIsGuestSinger, guestSingerName, setGuestSingerName, isSpecialEvent, setIsSpecialEvent, activeSingerName, conflicts, loading, toast, currentYear, currentMonth, eventToRestore, setEventToRestore, handlePrevMonth: () => currentMonth === 1 ? (setCurrentMonth(12), setCurrentYear((y) => y - 1)) : setCurrentMonth((m) => m - 1), handleNextMonth: () => currentMonth === 12 ? (setCurrentMonth(1), setCurrentYear((y) => y + 1)) : setCurrentMonth((m) => m + 1), toggleDateSelection: (d: string) => setSelectedDates((p) => p.includes(d) ? p.filter((x) => x !== d) : [...p, d]), selectRecurringDay: (dow: number) => setSelectedDates((p) => Array.from(new Set([...p, ...getRecurringDatesInMonth(currentYear, currentMonth, dow)]))), handleSubmit, handleConfirmRestore };
};

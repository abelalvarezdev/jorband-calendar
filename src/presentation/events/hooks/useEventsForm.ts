import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRepositories } from '../../../infrastructure/di/RepositoryContext';
import { User, Absent, Event } from '../../../domain/types';
import { ConflictInfo } from '../types/events.types';

export const useEventsForm = () => {
  const { authRepository, eventRepository, absentRepository } = useRepositories();

  const [members, setMembers] = useState<User[]>([]);
  const [monthAbsents, setMonthAbsents] = useState<Absent[]>([]);
  const [monthEvents, setMonthEvents] = useState<Event[]>([]);

  const today = new Date();
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth() + 1);

  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [eventName, setEventName] = useState<string>('Culto de Adoración');
  const [eventTime, setEventTime] = useState<string>('07:00 PM');
  const [notes, setNotes] = useState<string>('');
  const [principalSinger, setPrincipalSinger] = useState<string>('');
  const [isGuestSinger, setIsGuestSinger] = useState<boolean>(false);
  const [guestSingerName, setGuestSingerName] = useState<string>('');

  const [eventToRestore, setEventToRestore] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [evts, mList, abs] = await Promise.all([
        eventRepository.getEventsByMonth(currentYear, currentMonth),
        authRepository.getAllMembers(),
        absentRepository.getAbsentsByMonth(currentYear, currentMonth),
      ]);
      setMonthEvents(evts);
      setMembers(mList);
      setMonthAbsents(abs);
      if (mList.length > 0 && !principalSinger) {
        const firstSinger = mList.find((m) => m.instrument?.toLowerCase().includes('voz') || m.instrument?.toLowerCase().includes('cantante')) || mList[0];
        setPrincipalSinger(firstSinger.name);
      }
    } catch (err) {
      console.error('Error loading events form data:', err);
    }
  }, [authRepository, eventRepository, absentRepository, currentYear, currentMonth, principalSinger]);

  useEffect(() => { loadData(); }, [loadData]);

  const handlePrevMonth = () => {
    if (currentMonth === 1) { setCurrentMonth(12); setCurrentYear((y) => y - 1); }
    else { setCurrentMonth((m) => m - 1); }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) { setCurrentMonth(1); setCurrentYear((y) => y + 1); }
    else { setCurrentMonth((m) => m + 1); }
  };

  const toggleDateSelection = (dateStr: string) => {
    setSelectedDates((prev) => prev.includes(dateStr) ? prev.filter((d) => d !== dateStr) : [...prev, dateStr]);
  };

  const selectRecurringDay = (dayOfWeek: number) => {
    const dates: string[] = [];
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(currentYear, currentMonth - 1, d);
      if (dateObj.getDay() === dayOfWeek) {
        dates.push(`${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
      }
    }
    setSelectedDates((prev) => Array.from(new Set([...prev, ...dates])));
  };

  const activeSingerName = isGuestSinger ? guestSingerName.trim() : principalSinger;

  const conflicts = useMemo<ConflictInfo[]>(() => {
    if (!activeSingerName || isGuestSinger || selectedDates.length === 0) return [];
    const user = members.find((m) => m.name.toLowerCase() === activeSingerName.toLowerCase());
    if (!user) return [];
    const found: ConflictInfo[] = [];
    selectedDates.forEach((dateStr) => {
      const abs = monthAbsents.find((a) => a.userId === user.id && a.date === dateStr);
      if (abs) found.push({ date: dateStr, singerName: user.name, reason: abs.reason });
    });
    return found;
  }, [activeSingerName, isGuestSinger, selectedDates, members, monthAbsents]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const createNewEvents = async () => {
    const newEvents = selectedDates.map((dateStr) => ({
      date: dateStr,
      eventName: eventName.trim(),
      time: eventTime,
      principalSinger: activeSingerName,
      isGuestSinger,
      notes: notes.trim(),
      isCancelled: false,
    }));
    await eventRepository.createEvents(newEvents);
    showToast(`¡${newEvents.length} evento(s) programado(s) exitosamente!`);
    setSelectedDates([]);
    setGuestSingerName('');
    setNotes('');
    await loadData();
  };

  const handleConfirmRestore = async () => {
    if (!eventToRestore) return;
    setLoading(true);
    try {
      await eventRepository.updateEvent(eventToRestore.id, {
        eventName: eventName.trim(),
        time: eventTime,
        principalSinger: activeSingerName,
        isGuestSinger,
        notes: notes.trim(),
        isCancelled: false,
        cancelReason: '',
      });
      showToast(`¡Evento del ${eventToRestore.date} restaurado y actualizado!`);
      setEventToRestore(null);
      setSelectedDates([]);
      setNotes('');
      await loadData();
    } catch (err: any) {
      showToast(err.message || 'Error al restaurar el evento', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDates.length === 0) return showToast('Selecciona al menos una fecha para programar el evento', 'error');
    if (!activeSingerName) return showToast('Por favor asigna un cantante principal', 'error');
    if (conflicts.length > 0) return showToast('El cantante seleccionado no está disponible en las fechas en ROJO', 'error');

    const cancelledMatch = monthEvents.find((evt) => evt.isCancelled && selectedDates.includes(evt.date));
    if (cancelledMatch) {
      setEventToRestore(cancelledMatch);
      return;
    }

    setLoading(true);
    try {
      await createNewEvents();
    } catch (err: any) {
      showToast(err.message || 'Error al guardar los eventos', 'error');
    } finally {
      setLoading(false);
    }
  };

  return {
    members, monthEvents, selectedDates, eventName, setEventName, eventTime, setEventTime, notes, setNotes,
    principalSinger, setPrincipalSinger, isGuestSinger, setIsGuestSinger, guestSingerName, setGuestSingerName,
    activeSingerName, conflicts, loading, toast, currentYear, currentMonth, eventToRestore, setEventToRestore,
    handlePrevMonth, handleNextMonth, toggleDateSelection, selectRecurringDay, handleSubmit, handleConfirmRestore,
  };
};

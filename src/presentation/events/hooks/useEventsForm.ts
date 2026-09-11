import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRepositories } from '../../../infrastructure/di/RepositoryContext';
import { User, Absent } from '../../../domain/types';
import { ConflictInfo } from '../types/events.types';

export const useEventsForm = () => {
  const { authRepository, eventRepository, absentRepository } = useRepositories();

  const [members, setMembers] = useState<User[]>([]);
  const [monthAbsents, setMonthAbsents] = useState<Absent[]>([]);

  const today = new Date();
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth() + 1);

  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [eventName, setEventName] = useState<string>('Culto de Adoración');
  const [eventTime, setEventTime] = useState<string>('07:00 PM');
  const [principalSinger, setPrincipalSinger] = useState<string>('');
  const [isGuestSinger, setIsGuestSinger] = useState<boolean>(false);
  const [guestSingerName, setGuestSingerName] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [mList, abs] = await Promise.all([
        authRepository.getAllMembers(),
        absentRepository.getAbsentsByMonth(currentYear, currentMonth),
      ]);
      setMembers(mList);
      setMonthAbsents(abs);
      if (mList.length > 0 && !principalSinger) {
        const firstSinger =
          mList.find(
            (m) =>
              m.instrument?.toLowerCase().includes('voz') ||
              m.instrument?.toLowerCase().includes('cantante')
          ) || mList[0];
        setPrincipalSinger(firstSinger.name);
      }
    } catch (err) {
      console.error('Error loading events form data:', err);
    }
  }, [authRepository, absentRepository, currentYear, currentMonth, principalSinger]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const toggleDateSelection = (dateStr: string) => {
    setSelectedDates((prev) =>
      prev.includes(dateStr) ? prev.filter((d) => d !== dateStr) : [...prev, dateStr]
    );
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
      if (abs) {
        found.push({
          date: dateStr,
          singerName: user.name,
          reason: abs.reason,
        });
      }
    });
    return found;
  }, [activeSingerName, isGuestSinger, selectedDates, members, monthAbsents]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDates.length === 0) {
      showToast('Selecciona al menos una fecha para programar el evento', 'error');
      return;
    }
    if (!activeSingerName) {
      showToast('Por favor asigna un cantante principal', 'error');
      return;
    }
    if (conflicts.length > 0) {
      showToast('El cantante seleccionado no está disponible en las fechas marcadas en ROJO', 'error');
      return;
    }

    setLoading(true);
    try {
      const newEvents = selectedDates.map((dateStr) => ({
        date: dateStr,
        eventName: eventName.trim(),
        time: eventTime,
        principalSinger: activeSingerName,
        isGuestSinger,
      }));

      await eventRepository.createEvents(newEvents);
      showToast(`¡${newEvents.length} evento(s) programado(s) exitosamente!`);
      setSelectedDates([]);
      setGuestSingerName('');
    } catch (err: any) {
      showToast(err.message || 'Error al guardar los eventos', 'error');
    } finally {
      setLoading(false);
    }
  };

  return {
    members,
    selectedDates,
    eventName,
    setEventName,
    eventTime,
    setEventTime,
    principalSinger,
    setPrincipalSinger,
    isGuestSinger,
    setIsGuestSinger,
    guestSingerName,
    setGuestSingerName,
    activeSingerName,
    conflicts,
    loading,
    toast,
    currentYear,
    currentMonth,
    handlePrevMonth,
    handleNextMonth,
    toggleDateSelection,
    selectRecurringDay,
    handleSubmit,
  };
};

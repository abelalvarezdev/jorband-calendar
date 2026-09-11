import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRepositories } from '../../../infrastructure/di/RepositoryContext';
import { Event, Absent, User } from '../../../domain/types';
import { DayData } from '../types/calendar.types';

export const useCalendar = () => {
  const { eventRepository, absentRepository, authRepository } = useRepositories();
  const today = new Date();

  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth() + 1);
  const [showAbsentsView, setShowAbsentsView] = useState<boolean>(false);
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const [selectedDateStr, setSelectedDateStr] = useState<string>(todayStr);

  const [events, setEvents] = useState<Event[]>([]);
  const [absents, setAbsents] = useState<Absent[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [cancellingEvent, setCancellingEvent] = useState<Event | null>(null);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [evts, abs, mList, user] = await Promise.all([
        eventRepository.getEventsByMonth(currentYear, currentMonth),
        absentRepository.getAbsentsByMonth(currentYear, currentMonth),
        authRepository.getAllMembers(),
        authRepository.getCurrentUser(),
      ]);
      setEvents(evts);
      setAbsents(abs);
      setMembers(mList);
      setCurrentUser(user);
    } catch (err) {
      console.error('Error loading calendar data:', err);
    } finally {
      setLoading(false);
    }
  }, [eventRepository, absentRepository, authRepository, currentYear, currentMonth]);

  useEffect(() => { loadData(); }, [loadData]);

  const handlePrevMonth = () => {
    if (currentMonth === 1) { setCurrentMonth(12); setCurrentYear((y) => y - 1); }
    else { setCurrentMonth((m) => m - 1); }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) { setCurrentMonth(1); setCurrentYear((y) => y + 1); }
    else { setCurrentMonth((m) => m + 1); }
  };

  const handleSaveEdit = async (updates: Partial<Event>) => {
    if (!editingEvent) return;
    setActionLoading(true);
    try {
      await eventRepository.updateEvent(editingEvent.id, updates);
      setEditingEvent(null);
      await loadData();
    } catch (err) {
      console.error('Error updating event:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmCancel = async (cancelReason: string) => {
    if (!cancellingEvent) return;
    setActionLoading(true);
    try {
      await eventRepository.updateEvent(cancellingEvent.id, { isCancelled: true, cancelReason });
      setCancellingEvent(null);
      await loadData();
    } catch (err) {
      console.error('Error cancelling event:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const daysGrid = useMemo<DayData[]>(() => {
    const days: DayData[] = [];
    const firstDay = new Date(currentYear, currentMonth - 1, 1);
    const lastDay = new Date(currentYear, currentMonth, 0);
    const startDayIndex = firstDay.getDay();
    const totalDays = lastDay.getDate();
    const prevMonthLastDay = new Date(currentYear, currentMonth - 1, 0).getDate();

    for (let i = startDayIndex - 1; i >= 0; i--) {
      const dNum = prevMonthLastDay - i;
      const prevM = currentMonth === 1 ? 12 : currentMonth - 1;
      const prevY = currentMonth === 1 ? currentYear - 1 : currentYear;
      days.push({ dateStr: `${prevY}-${String(prevM).padStart(2, '0')}-${String(dNum).padStart(2, '0')}`, dayNumber: dNum, isCurrentMonth: false, isToday: false, absents: [] });
    }

    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ dateStr, dayNumber: d, isCurrentMonth: true, isToday: dateStr === todayStr, event: events.find((e) => e.date === dateStr), absents: absents.filter((a) => a.date === dateStr) });
    }
    return days;
  }, [currentYear, currentMonth, events, absents, todayStr]);

  const selectedDayData = useMemo(() => {
    const day = daysGrid.find((d) => d.dateStr === selectedDateStr);
    if (day) return day;
    const [, , dNumStr] = selectedDateStr.split('-');
    return { dateStr: selectedDateStr, dayNumber: parseInt(dNumStr || '1', 10), isCurrentMonth: true, isToday: selectedDateStr === todayStr, event: events.find((e) => e.date === selectedDateStr), absents: absents.filter((a) => a.date === selectedDateStr) };
  }, [selectedDateStr, daysGrid, events, absents, todayStr]);

  const isAdmin = currentUser?.role === 'Admin';

  return {
    currentYear, currentMonth, showAbsentsView, setShowAbsentsView, selectedDateStr, setSelectedDateStr,
    loading, actionLoading, daysGrid, selectedDayData, members, isAdmin, editingEvent, setEditingEvent,
    cancellingEvent, setCancellingEvent, handlePrevMonth, handleNextMonth, handleSaveEdit, handleConfirmCancel, refreshCalendar: loadData,
  };
};

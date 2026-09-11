import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRepositories } from '../../../infrastructure/di/RepositoryContext';
import { Event, Absent } from '../../../domain/types';
import { DayData } from '../types/calendar.types';

export const useCalendar = () => {
  const { eventRepository, absentRepository } = useRepositories();
  const today = new Date();

  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth() + 1);
  const [showAbsentsView, setShowAbsentsView] = useState<boolean>(false);
  
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const [selectedDateStr, setSelectedDateStr] = useState<string>(todayStr);

  const [events, setEvents] = useState<Event[]>([]);
  const [absents, setAbsents] = useState<Absent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [evts, abs] = await Promise.all([
        eventRepository.getEventsByMonth(currentYear, currentMonth),
        absentRepository.getAbsentsByMonth(currentYear, currentMonth),
      ]);
      setEvents(evts);
      setAbsents(abs);
    } catch (err) {
      console.error('Error loading calendar data:', err);
    } finally {
      setLoading(false);
    }
  }, [eventRepository, absentRepository, currentYear, currentMonth]);

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

  const daysGrid = useMemo<DayData[]>(() => {
    const days: DayData[] = [];
    const firstDay = new Date(currentYear, currentMonth - 1, 1);
    const lastDay = new Date(currentYear, currentMonth, 0);

    // Get day index of first day (0 = Sun, 1 = Mon ... adjust to Mon start if desired or Sun start)
    const startDayIndex = firstDay.getDay(); // 0 is Sun
    const totalDays = lastDay.getDate();

    // Previous month padding days
    const prevMonthLastDay = new Date(currentYear, currentMonth - 1, 0).getDate();
    for (let i = startDayIndex - 1; i >= 0; i--) {
      const dNum = prevMonthLastDay - i;
      const prevM = currentMonth === 1 ? 12 : currentMonth - 1;
      const prevY = currentMonth === 1 ? currentYear - 1 : currentYear;
      const dateStr = `${prevY}-${String(prevM).padStart(2, '0')}-${String(dNum).padStart(2, '0')}`;
      days.push({
        dateStr,
        dayNumber: dNum,
        isCurrentMonth: false,
        isToday: false,
        absents: [],
      });
    }

    // Current month days
    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayEvt = events.find((e) => e.date === dateStr);
      const dayAbs = absents.filter((a) => a.date === dateStr);
      days.push({
        dateStr,
        dayNumber: d,
        isCurrentMonth: true,
        isToday: dateStr === todayStr,
        event: dayEvt,
        absents: dayAbs,
      });
    }

    return days;
  }, [currentYear, currentMonth, events, absents, todayStr]);

  const selectedDayData = useMemo(() => {
    const day = daysGrid.find((d) => d.dateStr === selectedDateStr);
    if (day) return day;
    const dayEvt = events.find((e) => e.date === selectedDateStr);
    const dayAbs = absents.filter((a) => a.date === selectedDateStr);
    const [, , dNumStr] = selectedDateStr.split('-');
    return {
      dateStr: selectedDateStr,
      dayNumber: parseInt(dNumStr || '1', 10),
      isCurrentMonth: true,
      isToday: selectedDateStr === todayStr,
      event: dayEvt,
      absents: dayAbs,
    };
  }, [selectedDateStr, daysGrid, events, absents, todayStr]);

  return {
    currentYear,
    currentMonth,
    showAbsentsView,
    setShowAbsentsView,
    selectedDateStr,
    setSelectedDateStr,
    loading,
    daysGrid,
    selectedDayData,
    handlePrevMonth,
    handleNextMonth,
    refreshCalendar: loadData,
  };
};

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRepositories } from '../../../infrastructure/di/RepositoryContext';
import { Event, Absent, User } from '../../../domain/types';
import { buildCalendarDaysGrid, resolveSelectedDay } from '../utils/calendarGridBuilder';
import { useEventNotifications } from './useEventNotifications';

export const useCalendar = () => {
  const { eventRepository, absentRepository, authRepository, notificationRepository } = useRepositories();
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
  const [showAbsentsView, setShowAbsentsView] = useState(false);
  const [selectedDateStr, setSelectedDateStr] = useState(todayStr);
  const [events, setEvents] = useState<Event[]>([]);
  const [absents, setAbsents] = useState<Absent[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [cancellingEvent, setCancellingEvent] = useState<Event | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const { notifyEventEdited, notifyEventCancelled } = useEventNotifications(notificationRepository, events, currentUser);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [evts, abs, mList, user] = await Promise.all([eventRepository.getEventsByMonth(currentYear, currentMonth), absentRepository.getAbsentsByMonth(currentYear, currentMonth), authRepository.getAllMembers(), authRepository.getCurrentUser()]);
      setEvents(evts); setAbsents(abs); setMembers(mList); setCurrentUser(user);
    } finally { setLoading(false); }
  }, [eventRepository, absentRepository, authRepository, currentYear, currentMonth]);

  useEffect(() => { loadData(); }, [loadData]);
  const handlePrevMonth = () => currentMonth === 1 ? (setCurrentMonth(12), setCurrentYear((y) => y - 1)) : setCurrentMonth((m) => m - 1);
  const handleNextMonth = () => currentMonth === 12 ? (setCurrentMonth(1), setCurrentYear((y) => y + 1)) : setCurrentMonth((m) => m + 1);
  const handleSaveEdit = async (updates: Partial<Event>) => {
    if (!editingEvent) return;
    setActionLoading(true);
    try { await eventRepository.updateEvent(editingEvent.id, updates); await notifyEventEdited(editingEvent, updates); setEditingEvent(null); await loadData(); } finally { setActionLoading(false); }
  };
  const handleConfirmCancel = async (cancelReason: string) => {
    if (!cancellingEvent) return;
    setActionLoading(true);
    try { await eventRepository.updateEvent(cancellingEvent.id, { isCancelled: true, cancelReason }); await notifyEventCancelled(cancellingEvent, cancelReason); setCancellingEvent(null); await loadData(); } finally { setActionLoading(false); }
  };

  const daysGrid = useMemo(() => buildCalendarDaysGrid(currentYear, currentMonth, events, absents, todayStr), [currentYear, currentMonth, events, absents, todayStr]);
  const selectedDayData = useMemo(() => resolveSelectedDay(selectedDateStr, daysGrid, events, absents, todayStr), [selectedDateStr, daysGrid, events, absents, todayStr]);
  return { currentYear, currentMonth, showAbsentsView, setShowAbsentsView, selectedDateStr, setSelectedDateStr, loading, actionLoading, daysGrid, selectedDayData, members, isAdmin: currentUser?.role === 'Admin', editingEvent, setEditingEvent, cancellingEvent, setCancellingEvent, handlePrevMonth, handleNextMonth, handleSaveEdit, handleConfirmCancel, refreshCalendar: loadData };
};

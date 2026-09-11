import { useState, useEffect, useCallback } from 'react';
import { useRepositories } from '../../../infrastructure/di/RepositoryContext';
import { User, Absent } from '../../../domain/types';

export const useAbsentForm = (currentUser: User | null) => {
  const { absentRepository } = useRepositories();

  const [date, setDate] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [userAbsents, setUserAbsents] = useState<Absent[]>([]);

  const loadAbsents = useCallback(async () => {
    if (!currentUser) return;
    try {
      const list = await absentRepository.getAbsentsByUser(currentUser.id);
      setUserAbsents(list);
    } catch (err) {
      console.error('Error fetching user absents:', err);
    }
  }, [absentRepository, currentUser]);

  useEffect(() => {
    loadAbsents();
  }, [loadAbsents]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSelectQuickThursday = () => {
    // Find next Thursday date from today
    const now = new Date();
    const currentDay = now.getDay(); // 0 Sun, 1 Mon... 4 Thu
    const daysUntilThu = (4 + 7 - currentDay) % 7 || 7;
    const nextThu = new Date(now);
    nextThu.setDate(now.getDate() + daysUntilThu);
    const dateStr = nextThu.toISOString().split('T')[0];
    setDate(dateStr);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!date) {
      showToast('Por favor selecciona una fecha de ausencia', 'error');
      return;
    }
    if (!reason.trim()) {
      showToast('Por favor ingresa un motivo para la ausencia', 'error');
      return;
    }

    setLoading(true);
    try {
      await absentRepository.createAbsent({
        date,
        userId: currentUser.id,
        userName: currentUser.name,
        reason: reason.trim(),
      });

      // Show toast, reset form, stay on screen, reload list!
      showToast('¡Ausencia registrada con éxito!');
      setDate('');
      setReason('');
      await loadAbsents();
    } catch (err: any) {
      showToast(err.message || 'Error al registrar la ausencia', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await absentRepository.deleteAbsent(id);
      showToast('Ausencia eliminada');
      await loadAbsents();
    } catch (err: any) {
      showToast(err.message || 'Error al eliminar', 'error');
    }
  };

  return {
    date,
    setDate,
    reason,
    setReason,
    loading,
    toast,
    userAbsents,
    handleSelectQuickThursday,
    handleSubmit,
    handleDelete,
  };
};

import React from 'react';
import { useAbsentForm } from './hooks/useAbsentForm';
import { AbsentHeader } from './components/AbsentHeader';
import { AbsentForm } from './components/AbsentForm';
import { AbsentHistoryList } from './components/AbsentHistoryList';
import { Toast } from '../shared/Toast';
import { User } from '../../domain/types';

export const AbsentScreen: React.FC<{ currentUser: User | null }> = ({
  currentUser,
}) => {
  const form = useAbsentForm(currentUser);

  return (
    <div>
      {form.toast && <Toast message={form.toast.message} type={form.toast.type} />}
      <AbsentHeader />
      <AbsentForm
        date={form.date}
        setDate={form.setDate}
        reason={form.reason}
        setReason={form.setReason}
        onQuickThursday={form.handleSelectQuickThursday}
        onSubmit={form.handleSubmit}
        loading={form.loading}
      />
      <AbsentHistoryList absents={form.userAbsents} onDelete={form.handleDelete} />
    </div>
  );
};

import React, { createContext, useContext, useMemo } from 'react';
import { AuthRepository } from '../../domain/ports/AuthRepository';
import { EventRepository } from '../../domain/ports/EventRepository';
import { AbsentRepository } from '../../domain/ports/AbsentRepository';

import { InMemoryAuthRepository } from '../memory/InMemoryAuthRepository';
import { InMemoryEventRepository } from '../memory/InMemoryEventRepository';
import { InMemoryAbsentRepository } from '../memory/InMemoryAbsentRepository';

import { FirebaseAuthRepository } from '../firebase/FirebaseAuthRepository';
import { FirebaseEventRepository } from '../firebase/FirebaseEventRepository';
import { FirebaseAbsentRepository } from '../firebase/FirebaseAbsentRepository';

interface Repositories {
  authRepository: AuthRepository;
  eventRepository: EventRepository;
  absentRepository: AbsentRepository;
}

const RepositoryContext = createContext<Repositories | null>(null);

export const RepositoryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const repositories = useMemo<Repositories>(() => {
    const useFirebase = import.meta.env.VITE_USE_FIREBASE === 'true';

    if (useFirebase) {
      return {
        authRepository: new FirebaseAuthRepository(),
        eventRepository: new FirebaseEventRepository(),
        absentRepository: new FirebaseAbsentRepository(),
      };
    }

    return {
      authRepository: new InMemoryAuthRepository(),
      eventRepository: new InMemoryEventRepository(),
      absentRepository: new InMemoryAbsentRepository(),
    };
  }, []);

  return (
    <RepositoryContext.Provider value={repositories}>
      {children}
    </RepositoryContext.Provider>
  );
};

export const useRepositories = (): Repositories => {
  const ctx = useContext(RepositoryContext);
  if (!ctx) {
    throw new Error('useRepositories must be used within RepositoryProvider');
  }
  return ctx;
};

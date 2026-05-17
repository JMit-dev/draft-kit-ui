'use client';

import { useContext } from 'react';
import type { NotificationEvent } from './useNotificationStream';
import { NotificationCenterContext } from '@/shared/components/notifications/notification-center-provider';

export function useNotificationCenter() {
  const context = useContext(NotificationCenterContext);

  if (!context) {
    throw new Error(
      'useNotificationCenter must be used within NotificationCenterProvider',
    );
  }

  return context;
}

export type { NotificationEvent };

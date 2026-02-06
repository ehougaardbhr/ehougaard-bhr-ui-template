import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

export interface AINotification {
  id: string;
  title: string;
  message: string;
  conversationId?: string;
  type?: 'info' | 'action_needed' | 'completed';
  createdAt: Date;
}

interface AINotificationContextType {
  notifications: AINotification[];
  addNotification: (notification: Omit<AINotification, 'id' | 'createdAt'>) => void;
  dismissNotification: (id: string) => void;
  clearAll: () => void;
}

const AINotificationContext = createContext<AINotificationContextType | undefined>(undefined);

export function AINotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AINotification[]>([]);

  const addNotification = useCallback((notification: Omit<AINotification, 'id' | 'createdAt'>) => {
    const id = String(Date.now()) + '-' + Math.random().toString(36).slice(2, 7);
    const newNotification: AINotification = {
      ...notification,
      id,
      createdAt: new Date(),
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-dismiss after 10 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 10000);
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <AINotificationContext.Provider value={{ notifications, addNotification, dismissNotification, clearAll }}>
      {children}
    </AINotificationContext.Provider>
  );
}

export function useAINotifications() {
  const context = useContext(AINotificationContext);
  if (context === undefined) {
    throw new Error('useAINotifications must be used within an AINotificationProvider');
  }
  return context;
}

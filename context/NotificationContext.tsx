import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Bell, CheckCircle, AlertCircle, Info } from 'lucide-react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string; // Ideally a date object, but string for mock simplicity
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'time'>) => void;
  deleteNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'New Lead Assigned',
    message: 'You have been assigned a new lead: Aarav Patel.',
    time: '2 minutes ago',
    read: false,
    type: 'info'
  },
  {
    id: '2',
    title: 'System Update',
    message: 'Lumina CRM will undergo maintenance at midnight.',
    time: '1 hour ago',
    read: false,
    type: 'warning'
  },
  {
    id: '3',
    title: 'Goal Reached',
    message: 'Congratulations! You reached your monthly conversion goal.',
    time: '5 hours ago',
    read: true,
    type: 'success'
  }
];

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addNotification = (data: Omit<Notification, 'id' | 'read' | 'time'>) => {
    const newNotification: Notification = {
      ...data,
      id: Math.random().toString(36).substring(2, 9),
      read: false,
      time: 'Just now'
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, addNotification, deleteNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within a NotificationProvider');
  return context;
};
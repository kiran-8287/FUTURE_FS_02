import React, { useState, useRef, useEffect } from 'react';
import { Bell, Menu, Check, Info, AlertTriangle, CheckCircle, X, User, LogOut, Camera, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications, Notification } from '../../context/NotificationContext';
import { Link, useNavigate } from 'react-router-dom';

interface NavbarProps {
  onMenuClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return <CheckCircle size={16} className="text-green-500" />;
      case 'warning': return <AlertTriangle size={16} className="text-amber-500" />;
      case 'error': return <AlertTriangle size={16} className="text-red-500" />;
      default: return <Info size={16} className="text-blue-500" />;
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="md:hidden text-gray-500 hover:text-gray-700">
          <Menu size={24} />
        </button>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notification Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className={`relative p-2 rounded-full transition-colors ${isNotificationsOpen ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'}`}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 z-50 transform origin-top-right transition-all">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <Check size={14} className="mr-1" />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Bell className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                    <p className="text-sm">No notifications yet</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {notifications.map((notification) => (
                      <li
                        key={notification.id}
                        className={`p-4 hover:bg-white border-b border-gray-50 transition-colors relative group ${notification.read ? 'opacity-75' : 'bg-blue-50/30'}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 flex-shrink-0 ${notification.read ? 'opacity-50' : ''}`}>
                            {getIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0" onClick={() => markAsRead(notification.id)}>
                            <p className={`text-sm font-medium ${notification.read ? 'text-gray-600' : 'text-gray-900'}`}>
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {notification.time}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                            title="Dismiss"
                          >
                            <X size={14} />
                          </button>
                        </div>
                        {!notification.read && (
                          <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-blue-500"></div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="p-3 border-t border-gray-100 bg-white text-center rounded-b-lg">
                <button className="text-xs font-medium text-gray-600 hover:text-gray-900">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative ml-2" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-3 pl-4 border-l border-gray-200 focus:outline-none group p-1"
          >
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
            <img
              src={user?.avatar}
              alt={user?.name}
              className="h-9 w-9 rounded-full bg-white border-2 border-white shadow-sm group-hover:ring-2 group-hover:ring-blue-100 transition-all"
            />
            <ChevronDown size={16} className="text-gray-400 hidden md:block group-hover:text-gray-600" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 z-50 transform origin-top-right transition-all">
              <div className="p-6 border-b border-gray-100 flex flex-col items-center text-center">
                <div className="relative mb-3 group">
                  <img
                    src={user?.avatar}
                    alt={user?.name}
                    className="h-20 w-20 rounded-full bg-white border-4 border-white shadow-md object-cover"
                  />
                  <Link
                    to="/settings"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700 shadow-md transition-all hover:scale-110"
                    title="Change Profile Picture"
                  >
                    <Camera size={14} />
                  </Link>
                </div>
                <h3 className="font-semibold text-gray-900 text-lg">{user?.name}</h3>
                <p className="text-gray-500 text-sm mb-2">{user?.email}</p>
                <div className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                  {user?.role}
                </div>
              </div>

              <div className="p-2 space-y-1">
                <Link
                  to="/settings"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors"
                >
                  <User size={18} className="text-gray-400" />
                  Edit Profile
                </Link>
              </div>

              <div className="p-2 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
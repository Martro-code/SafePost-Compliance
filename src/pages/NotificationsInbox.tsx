import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell } from 'lucide-react';
import LoggedInLayout from '../components/layout/LoggedInLayout';
import { useAuth } from '../hooks/useAuth';
import { getNotifications, markAsRead, markAllNotificationsRead, type Notification } from '../services/notificationService';

const NotificationsInbox: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications from Supabase on mount
  useEffect(() => {
    if (!user) return;
    getNotifications(user.id).then(data => {
      setNotifications(data);
      const unreadCount = data.filter(n => !n.read).length;
      sessionStorage.setItem('safepost_notification_count', String(unreadCount));
      window.dispatchEvent(new Event('safepost-notifications-updated'));
    });
  }, [user]);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n);
      const unreadCount = updated.filter(n => !n.read).length;
      sessionStorage.setItem('safepost_notification_count', String(unreadCount));
      window.dispatchEvent(new Event('safepost-notifications-updated'));
      return updated;
    });
    markAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    sessionStorage.setItem('safepost_notification_count', '0');
    window.dispatchEvent(new Event('safepost-notifications-updated'));
    if (user) {
      markAllNotificationsRead(user.id);
    }
  };

  const hasUnread = notifications.some(n => !n.read);

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60_000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
  };

  return (
    <LoggedInLayout>
      <div className="max-w-2xl mx-auto px-6 pt-6 pb-10 md:pt-8 md:pb-16">
        {/* Back to Dashboard */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors mb-8 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Notifications</h1>
              <p className="text-[14px] text-gray-500 mt-1">Your recent activity and updates from SafePost</p>
            </div>
            {hasUnread && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-[13px] text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* Notification list */}
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
              <Bell className="w-8 h-8 text-gray-300 mx-auto mb-3" />
              <p className="text-[14px] font-medium text-gray-500">No notifications yet</p>
              <p className="text-[13px] text-gray-400 mt-1">You'll see updates here when there's new activity.</p>
            </div>
          ) : notifications.every(n => n.read) ? (
            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
              <Bell className="w-8 h-8 text-gray-300 mx-auto mb-3" />
              <p className="text-[14px] font-medium text-gray-500">You're all caught up</p>
              <p className="text-[13px] text-gray-400 mt-1">No new notifications right now.</p>
            </div>
          ) : (
            notifications.map(notification => (
              <div
                key={notification.id}
                className={`bg-white rounded-xl border transition-colors ${
                  notification.read
                    ? 'border-gray-100'
                    : 'border-blue-100 bg-blue-50/30'
                } p-4 flex items-start gap-4`}
              >
                {/* Unread indicator dot */}
                {!notification.read && (
                  <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-2" />
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={`text-[14px] font-semibold ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                    {notification.title}
                  </p>
                  <p className="text-[13px] text-gray-500 mt-0.5 leading-relaxed">
                    {notification.message}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1.5">{formatTime(notification.created_at)}</p>
                </div>

                {/* Mark as read button */}
                {!notification.read && (
                  <button
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="text-[11px] text-blue-500 hover:text-blue-700 font-medium flex-shrink-0 transition-colors"
                  >
                    Mark read
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {/* Notification preferences link */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/settings')}
            className="text-[13px] text-gray-400 hover:text-blue-600 transition-colors"
          >
            Manage notification preferences in Settings →
          </button>
        </div>
      </div>
    </LoggedInLayout>
  );
};

export default NotificationsInbox;

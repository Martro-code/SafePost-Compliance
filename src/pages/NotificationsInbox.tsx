import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, CheckCircle2, AlertTriangle } from 'lucide-react';
import LoggedInFooter from '../components/LoggedInFooter';

const initialNotifications = [
  {
    id: 1,
    title: "Compliance check complete",
    description: "Your recent post has been analysed and your results are ready to view.",
    time: "2 mins ago",
    icon: CheckCircle2,
    iconColor: "text-green-500",
    iconBg: "bg-green-50",
    read: false,
  },
  {
    id: 2,
    title: "Guideline update",
    description: "AHPRA advertising guidelines have been updated. Your knowledge base will be refreshed shortly.",
    time: "1 hour ago",
    icon: AlertTriangle,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-50",
    read: false,
  },
  {
    id: 3,
    title: "Billing notification",
    description: "Your next subscription payment is due soon. Ensure your payment details are up to date.",
    time: "Yesterday",
    icon: Bell,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-50",
    read: false,
  },
];

const NotificationsInbox: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    sessionStorage.setItem('safepost_notification_count', '0');
  };

  const hasUnread = notifications.some(n => !n.read);

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f7f4] dark:bg-gray-900">
      <main className="flex-grow">
        <div className="max-w-3xl mx-auto px-6 py-12">
          {/* Page header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-gray-900 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
                <p className="text-[14px] text-gray-500 mt-1">Your recent activity and updates from SafePost™</p>
              </div>
              {hasUnread && (
                <button
                  onClick={markAllAsRead}
                  className="text-[13px] text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>

          {/* Notification list */}
          <div className="space-y-3">
            {notifications.every(n => n.read) && notifications.length > 0 ? (
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

                  {/* Icon */}
                  <div className={`w-9 h-9 rounded-lg ${notification.iconBg} flex items-center justify-center flex-shrink-0`}>
                    <notification.icon className={`w-4 h-4 ${notification.iconColor}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-[14px] font-semibold ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                      {notification.title}
                    </p>
                    <p className="text-[13px] text-gray-500 mt-0.5 leading-relaxed">
                      {notification.description}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1.5">{notification.time}</p>
                  </div>

                  {/* Mark as read button */}
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
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
      </main>
      <LoggedInFooter />
    </div>
  );
};

export default NotificationsInbox;

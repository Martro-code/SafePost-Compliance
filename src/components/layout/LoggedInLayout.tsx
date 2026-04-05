/**
 * LoggedInLayout — shared wrapper for all authenticated pages.
 * Provides the sticky header (nav, bell, My Account dropdown) and LoggedInFooter.
 * Usage: wrap any logged-in page content in <LoggedInLayout>{children}</LoggedInLayout>
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X, LogOut, Bell, HelpCircle, Loader2, AlertTriangle, Info } from 'lucide-react';
import SafePostLogo from '../ui/SafePostLogo';
import LoggedInFooter from './LoggedInFooter';
import { useAuth } from '../../hooks/useAuth';
import { useAccount } from '../../context/AccountContext';
import { getDisplayPlanName } from '../../utils/planUtils';
import {
  getUnreadCount,
  getNotificationsPreview,
  getAnnouncements,
  markAsRead,
  markAllNotificationsRead,
  type Notification,
  type Announcement,
} from '../../services/notificationService';

// ── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const DISMISSED_KEY = 'safepost_dismissed_announcements';

function getDismissedIds(): string[] {
  try { return JSON.parse(localStorage.getItem(DISMISSED_KEY) ?? '[]'); } catch { return []; }
}

function persistDismissed(ids: string[]): void {
  localStorage.setItem(DISMISSED_KEY, JSON.stringify(ids));
}

interface LoggedInLayoutProps {
  children: React.ReactNode;
}

const LoggedInLayout: React.FC<LoggedInLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userEmail, signOut } = useAuth();
  const { role, plan: accountPlan, abnRequired, auditPurchased } = useAccount();

  // SECURITY: Never fall back to sessionStorage for plan — it's user-controlled.
  // Only trust the database-backed value from AccountContext.
  const planName = accountPlan || '';
  const isOwner = role === 'owner';

  const dropdownPlanName = getDisplayPlanName(planName);

  // Header state
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(() => {
    const saved = sessionStorage.getItem('safepost_notification_count');
    return saved !== null ? parseInt(saved, 10) : 0;
  });
  const [previewNotifications, setPreviewNotifications] = useState<Notification[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [dropdownLoading, setDropdownLoading] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const accountDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationDropdownOpen(false);
      }
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target as Node)) {
        setAccountDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calculate and cache the total notification count (unread + non-dismissed announcements).
  const refreshCount = useCallback(async () => {
    if (!user) return;
    try {
      const [unreadCount, allAnnouncements] = await Promise.all([
        getUnreadCount(user.id),
        getAnnouncements(),
      ]);
      const dismissed = getDismissedIds();
      const visibleAnnouncements = allAnnouncements.filter(a => !dismissed.includes(a.id));
      const total = unreadCount + visibleAnnouncements.length;
      setNotificationCount(total);
      sessionStorage.setItem('safepost_notification_count', String(total));
    } catch {
      // Non-fatal — keep previous count
    }
  }, [user]);

  // Fetch count on mount/login
  useEffect(() => {
    refreshCount();
  }, [refreshCount]);

  // Re-fetch count when other parts of the app dispatch the update event
  useEffect(() => {
    const handleNotificationUpdate = () => { refreshCount(); };
    window.addEventListener('safepost-notifications-updated', handleNotificationUpdate);
    return () => window.removeEventListener('safepost-notifications-updated', handleNotificationUpdate);
  }, [refreshCount]);

  // Lazily load dropdown content when it opens
  useEffect(() => {
    if (!notificationDropdownOpen || !user) return;
    setDropdownLoading(true);
    Promise.all([
      getNotificationsPreview(user.id),
      getAnnouncements(),
    ]).then(([notifs, allAnnouncements]) => {
      setPreviewNotifications(notifs);
      const dismissed = getDismissedIds();
      setAnnouncements(allAnnouncements.filter(a => !dismissed.includes(a.id)));
    }).catch(() => {}).finally(() => setDropdownLoading(false));
  }, [notificationDropdownOpen, user]);

  const handleNotificationClick = useCallback(async (notif: Notification) => {
    if (!notif.read) {
      await markAsRead(notif.id);
      setPreviewNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
      setNotificationCount(prev => {
        const next = Math.max(0, prev - 1);
        sessionStorage.setItem('safepost_notification_count', String(next));
        return next;
      });
    }
  }, []);

  const handleDismissAnnouncement = useCallback((id: string) => {
    const ids = getDismissedIds();
    if (!ids.includes(id)) persistDismissed([...ids, id]);
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    setNotificationCount(prev => {
      const next = Math.max(0, prev - 1);
      sessionStorage.setItem('safepost_notification_count', String(next));
      return next;
    });
  }, []);

  const handleMarkAllRead = useCallback(async () => {
    // Dismiss all visible announcements
    const dismissed = getDismissedIds();
    const newDismissed = [...new Set([...dismissed, ...announcements.map(a => a.id)])];
    persistDismissed(newDismissed);
    setAnnouncements([]);
    // Mark all user notifications read
    setPreviewNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setNotificationCount(0);
    sessionStorage.setItem('safepost_notification_count', '0');
    window.dispatchEvent(new Event('safepost-notifications-updated'));
    if (user) await markAllNotificationsRead(user.id);
  }, [announcements, user]);

  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogOut = useCallback(async () => {
    if (loggingOut) return; // guard against double-clicks
    setLoggingOut(true);
    try {
      await signOut();
    } catch (err) {
      console.error('Logout failed:', err);
    }
    // Always redirect regardless of success/failure — signOut already
    // clears local state so the user won't remain authenticated.
    navigate('/');
  }, [loggingOut, signOut, navigate]);

  const isUltra = planName.toLowerCase() === 'ultra';

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard', locked: false },
    { label: 'Website Audit', path: auditPurchased ? '/audit/start' : '/audit', locked: !auditPurchased },
    { label: 'History', path: '/history', locked: false },
    { label: 'Settings', path: '/settings', locked: false },
    ...(isUltra && isOwner ? [{ label: 'Team', path: '/settings/team', locked: false }] : []),
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f7f4] dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-black/[0.06]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-8">
            <Link to="/dashboard">
              <SafePostLogo />
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium rounded-lg transition-colors duration-200 ${
                    location.pathname === link.path || location.pathname.startsWith(link.path + '/')
                      ? 'text-gray-900 bg-black/[0.04] dark:bg-gray-100 dark:text-gray-900'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] dark:text-gray-400 dark:hover:text-gray-900'
                  }`}
                >
                  {link.label}
                  {link.locked && <Lock className="w-3 h-3 opacity-60" />}
                </button>
              ))}
            </nav>
          </div>

          {/* Right: Bell + My Account */}
          <div className="hidden md:flex items-center gap-1 justify-end min-w-[180px]">
            {/* Notification Bell */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => { setNotificationDropdownOpen(!notificationDropdownOpen); setAccountDropdownOpen(false); }}
                className="relative p-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-colors duration-200 dark:text-gray-400 dark:hover:text-white"
              >
                <Bell className="w-[18px] h-[18px]" />
                {notificationCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-[9px] font-bold text-white">{notificationCount}</span>
                  </span>
                )}
              </button>
              {notificationDropdownOpen && (
                <div className="absolute top-full right-0 mt-1 w-80 bg-white rounded-xl border border-black/[0.06] shadow-lg shadow-black/[0.06] py-1.5 fade-in dark:bg-gray-800 dark:border-gray-700 z-50">
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-2.5">
                    <p className="text-[13px] font-semibold text-gray-900 dark:text-white">Notifications</p>
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[12px] text-blue-600 hover:text-blue-700 font-medium transition-colors dark:text-blue-400"
                    >
                      Mark all as read
                    </button>
                  </div>
                  <div className="border-t border-black/[0.06] dark:border-gray-700" />

                  {/* Body */}
                  {dropdownLoading ? (
                    <div className="flex items-center justify-center py-6">
                      <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    </div>
                  ) : (
                    <div>
                      {/* Announcements — blue info banners */}
                      {announcements.map(a => (
                        <div key={a.id} className="mx-2 mt-2 rounded-lg bg-blue-50 border border-blue-100 px-3 py-2.5">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-2 min-w-0">
                              <Info className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                              <div className="min-w-0">
                                <p className="text-[12px] font-semibold text-blue-900 leading-snug">{a.title}</p>
                                <p className="text-[12px] text-blue-700 mt-0.5 leading-snug">{a.message}</p>
                                {a.link_url && a.link_text && (
                                  <a
                                    href={a.link_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[11px] font-medium text-blue-600 hover:text-blue-800 underline mt-1 inline-block"
                                    onClick={() => setNotificationDropdownOpen(false)}
                                  >
                                    {a.link_text}
                                  </a>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => handleDismissAnnouncement(a.id)}
                              className="flex-shrink-0 text-blue-400 hover:text-blue-600 transition-colors"
                              aria-label="Dismiss"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* User notifications */}
                      {previewNotifications.length > 0 ? (
                        <div className={announcements.length > 0 ? 'mt-2' : ''}>
                          {previewNotifications.map(notif => (
                            <button
                              key={notif.id}
                              onClick={() => handleNotificationClick(notif)}
                              className={`w-full text-left px-4 py-3 hover:bg-black/[0.03] transition-colors dark:hover:bg-white/[0.04] ${
                                !notif.read ? 'bg-blue-50/60 dark:bg-blue-900/10' : ''
                              }`}
                            >
                              <div className="flex items-start gap-2.5">
                                {!notif.read && (
                                  <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5" />
                                )}
                                <div className={`min-w-0 ${notif.read ? 'pl-4' : ''}`}>
                                  <p className={`text-[12px] leading-snug truncate ${notif.read ? 'text-gray-600 dark:text-gray-400' : 'font-semibold text-gray-900 dark:text-white'}`}>
                                    {notif.title}
                                  </p>
                                  <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-2 leading-snug">
                                    {notif.message}
                                  </p>
                                  <p className="text-[11px] text-gray-300 dark:text-gray-600 mt-0.5">
                                    {timeAgo(notif.created_at)}
                                  </p>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : announcements.length === 0 ? (
                        <div className="px-4 py-6 text-center">
                          <p className="text-[13px] text-gray-400">No new notifications</p>
                        </div>
                      ) : null}
                    </div>
                  )}

                  <div className="border-t border-black/[0.06] dark:border-gray-700 mt-1.5" />
                  <button
                    onClick={() => { navigate('/notifications'); setNotificationDropdownOpen(false); }}
                    className="block w-full text-center px-4 py-2.5 text-[13px] font-medium text-blue-600 hover:text-blue-700 transition-colors dark:text-blue-400"
                  >
                    View all notifications
                  </button>
                </div>
              )}
            </div>

            {/* My Account dropdown */}
            <div className="relative" ref={accountDropdownRef}>
              <button
                onClick={() => { setAccountDropdownOpen(!accountDropdownOpen); setNotificationDropdownOpen(false); }}
                className="flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium text-gray-700 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-colors duration-200"
              >
                My Account
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${accountDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {accountDropdownOpen && (
                <div className="absolute top-full right-0 mt-1 w-56 bg-white rounded-xl border border-black/[0.06] shadow-lg shadow-black/[0.06] py-1.5 fade-in dark:bg-gray-800 dark:border-gray-700">
                  <div className="px-4 py-2.5">
                    <p className="text-[12px] text-gray-400 truncate">{userEmail}</p>
                    <p className="text-[10px] font-medium text-[#2563EB] mt-1">{dropdownPlanName}</p>
                  </div>
                  <div className="border-t border-black/[0.06] dark:border-gray-700 my-1" />
                  <button onClick={() => navigate('/profile')} className="block w-full text-left px-4 py-2 text-[13px] text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] transition-colors dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/[0.06]">
                    Profile
                  </button>
                  {isOwner && (
                    <button onClick={() => navigate('/billing')} className="block w-full text-left px-4 py-2 text-[13px] text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] transition-colors dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/[0.06]">
                      Billing
                    </button>
                  )}
                  <button onClick={() => navigate('/settings')} className="block w-full text-left px-4 py-2 text-[13px] text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] transition-colors dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/[0.06]">
                    Settings
                  </button>
                  <button onClick={() => navigate('/help')} className="flex items-center gap-2 w-full text-left px-4 py-2 text-[13px] text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] transition-colors dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/[0.06]">
                    <HelpCircle className="w-3.5 h-3.5" />
                    Help & Support
                  </button>
                  <div className="border-t border-black/[0.06] dark:border-gray-700 my-1" />
                  <button
                    onClick={handleLogOut}
                    disabled={loggingOut}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-[13px] text-gray-600 hover:text-gray-900 hover:bg-black/[0.04] transition-colors dark:text-gray-400 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loggingOut ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LogOut className="w-3.5 h-3.5" />}
                    {loggingOut ? 'Signing out\u2026' : 'Log out'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] transition-all duration-200 dark:text-gray-400 dark:hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-6 pb-5 pt-2 border-t border-black/[0.06] dark:border-gray-700 space-y-1">
            <div className="px-3 py-2.5">
              <p className="text-[12px] text-gray-400 dark:text-gray-500 truncate">{userEmail}</p>
              <p className="text-[10px] font-medium text-[#2563EB] mt-1">{dropdownPlanName}</p>
            </div>
            <div className="border-t border-black/[0.06] dark:border-gray-700 my-1" />
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => { navigate(link.path); setMobileMenuOpen(false); }}
                className={`flex items-center gap-1.5 w-full text-left px-3 py-2.5 text-[13px] font-medium rounded-lg transition-colors duration-200 ${
                  location.pathname === link.path || location.pathname.startsWith(link.path + '/')
                    ? 'text-gray-900 bg-black/[0.04] dark:bg-gray-100 dark:text-gray-900'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] dark:text-gray-400 dark:hover:text-gray-900'
                }`}
              >
                {link.label}
                {link.locked && <Lock className="w-3 h-3 opacity-60" />}
              </button>
            ))}
            <div className="border-t border-black/[0.06] dark:border-gray-700 my-1" />
            <button onClick={() => { navigate('/profile'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2.5 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200 dark:text-gray-400 dark:hover:text-white">
              Profile
            </button>
            {isOwner && (
              <button onClick={() => { navigate('/billing'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2.5 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200 dark:text-gray-400 dark:hover:text-white">
                Billing
              </button>
            )}
            <button onClick={() => { navigate('/settings'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2.5 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200 dark:text-gray-400 dark:hover:text-white">
              Settings
            </button>
            <div className="border-t border-black/[0.06] dark:border-gray-700 my-1" />
            <button
              onClick={handleLogOut}
              disabled={loggingOut}
              className="flex items-center gap-2 w-full text-left px-3 py-2.5 text-[13px] font-medium text-gray-600 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200 dark:text-gray-400 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loggingOut ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LogOut className="w-3.5 h-3.5" />}
              {loggingOut ? 'Signing out\u2026' : 'Log out'}
            </button>
          </div>
        </div>
      </header>

      {/* ABN prompt banner */}
      {abnRequired && (
        <div className="bg-amber-50 border-b border-amber-200">
          <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <p className="text-[13px] text-amber-800">
                Complete your profile — Add your ABN to ensure your account meets compliance requirements.
              </p>
            </div>
            <button
              onClick={() => navigate('/update-personal-details')}
              className="flex-shrink-0 px-4 py-1.5 text-[13px] font-semibold text-amber-800 bg-amber-100 hover:bg-amber-200 rounded-lg border border-amber-300 transition-colors duration-200"
            >
              Add ABN &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Page content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <LoggedInFooter />
    </div>
  );
};

export default LoggedInLayout;

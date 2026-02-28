import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  ChevronDown, Menu, X, ArrowLeft, LogOut, Clock, Bell,
  CheckCircle2, XCircle, AlertTriangle, Loader2, Search,
  Filter, Trash2, ExternalLink, ChevronRight, FileText, Lock,
  ChevronLeft
} from 'lucide-react';
import SafePostLogo from './components/SafePostLogo';
import { useAuth } from './useAuth';
import { useComplianceChecker, SavedComplianceCheck, HISTORY_LIMITS } from './src/hooks/useComplianceChecker';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const statusConfig: Record<string, {
  label: string;
  icon: React.ReactNode;
  badge: string;
  row: string;
}> = {
  compliant: {
    label: 'Compliant',
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />,
    badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    row: 'border-l-emerald-400',
  },
  non_compliant: {
    label: 'Non-Compliant',
    icon: <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />,
    badge: 'bg-red-50 text-red-700 border border-red-200',
    row: 'border-l-red-400',
  },
  requires_review: {
    label: 'Requires Review',
    icon: <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />,
    badge: 'bg-amber-50 text-amber-700 border border-amber-200',
    row: 'border-l-amber-400',
  },
  warning: {
    label: 'Requires Review',
    icon: <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />,
    badge: 'bg-amber-50 text-amber-700 border border-amber-200',
    row: 'border-l-amber-400',
  },
};

function getStatusConfig(status: string) {
  return statusConfig[status] ?? statusConfig.warning;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
}

const PAGE_SIZE = 10;

// ─── Check Row Component ──────────────────────────────────────────────────────
const CheckRow: React.FC<{
  check: SavedComplianceCheck;
  onView: (check: SavedComplianceCheck) => void;
  onDelete: (id: string) => void;
  isUltra: boolean;
}> = ({ check, onView, onDelete, isUltra }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showPdfTooltip, setShowPdfTooltip] = useState(false);
  const [showPdfToast, setShowPdfToast] = useState(false);
  const cfg = getStatusConfig(check.overall_status);
  const issueCount = check.result_json?.issues?.length ?? 0;
  const criticalCount = check.result_json?.issues?.filter(
    (i: any) => i.severity?.toLowerCase() === 'critical'
  ).length ?? 0;

  const handleExportPdf = () => {
    if (!isUltra) return;
    setShowPdfToast(true);
    setTimeout(() => setShowPdfToast(false), 3000);
  };

  return (
    <div className={`bg-white rounded-xl border border-gray-100 border-l-4 ${cfg.row} shadow-sm shadow-black/[0.02] hover:shadow-md hover:shadow-black/[0.04] transition-all duration-200 overflow-visible`}>
      {/* PDF Toast */}
      {showPdfToast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 bg-gray-900 text-white text-[13px] font-medium rounded-xl shadow-lg shadow-black/20">
          Coming soon — this feature is in development
        </div>
      )}

      <div className="flex items-start gap-4 p-4 md:p-5">

        {/* Status icon */}
        <div className="mt-0.5 flex-shrink-0">
          {cfg.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Content preview */}
          <p className="text-[14px] font-medium text-gray-800 leading-snug mb-2 line-clamp-2">
            {check.content_text}
          </p>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status badge */}
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold ${cfg.badge}`}>
              {cfg.label}
            </span>

            {/* Issue count */}
            {issueCount > 0 && (
              <span className="text-[11px] text-gray-400">
                {criticalCount > 0 && (
                  <span className="text-red-500 font-medium">{criticalCount} critical</span>
                )}
                {criticalCount > 0 && issueCount > criticalCount && ' · '}
                {issueCount > criticalCount && (
                  <span>{issueCount - criticalCount} warning{issueCount - criticalCount !== 1 ? 's' : ''}</span>
                )}
              </span>
            )}

            {/* Timestamp */}
            <span className="text-[11px] text-gray-400 flex items-center gap-1 ml-auto">
              <Clock className="w-3 h-3" />
              {formatDateShort(check.created_at)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0 overflow-visible">
          {/* Export PDF icon button */}
          <div className="relative z-10">
            <button
              onClick={handleExportPdf}
              onMouseEnter={() => !isUltra && setShowPdfTooltip(true)}
              onMouseLeave={() => setShowPdfTooltip(false)}
              className={`relative p-1.5 rounded-lg transition-all duration-150 ${
                isUltra
                  ? 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                  : 'text-gray-300 cursor-not-allowed'
              }`}
            >
              {!isUltra && <Lock className="w-2.5 h-2.5 absolute -top-0.5 -right-0.5 text-gray-400" />}
              <FileText className="w-3.5 h-3.5" />
            </button>
            {showPdfTooltip && !isUltra && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-[11px] rounded-lg whitespace-nowrap shadow-lg z-50 pointer-events-none">
                PDF export is available on SafePost™ Ultra
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-gray-900 rotate-45" />
              </div>
            )}
          </div>

          {/* View button */}
          <button
            onClick={() => onView(check)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-all duration-150"
          >
            View
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* Delete button */}
          {confirmDelete ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => { onDelete(check.id); setConfirmDelete(false); }}
                className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-gray-500 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="p-1.5 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all duration-150"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Full date on hover — shown as tooltip-style footer */}
      <div className="px-5 pb-3 -mt-1">
        <p className="text-[11px] text-gray-300">{formatDate(check.created_at)}</p>
      </div>
    </div>
  );
};

// ─── Main History Page ─────────────────────────────────────────────────────────
const History: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userEmail, firstName, signOut } = useAuth();

  const planName = sessionStorage.getItem('safepost_plan') || '';
  const checker = useComplianceChecker(planName);

  const isUltra = planName.toLowerCase() === 'ultra';
  const historyLimit = HISTORY_LIMITS[planName.toLowerCase()] ?? HISTORY_LIMITS.free;

  const planDisplayNames: Record<string, string> = {
    professional: 'SafePost Professional',
    proplus: 'SafePost Pro+',
    ultra: 'SafePost Ultra',
  };
  const dropdownPlanName = planDisplayNames[planName.toLowerCase()] || 'SafePost Professional';

  // Header state
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(() => {
    const saved = sessionStorage.getItem('safepost_notification_count');
    return saved !== null ? parseInt(saved, 10) : 3;
  });
  const notificationRef = useRef<HTMLDivElement>(null);

  // Filter/search state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [filterOpen, setFilterOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Plan limit banner dismissal
  const [bannerDismissed, setBannerDismissed] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load history on mount
  useEffect(() => {
    checker.loadHistory();
  }, []);

  // Auto-open a check navigated from Dashboard sidebar
  useEffect(() => {
    if (checker.isLoadingHistory) return;
    const targetId = sessionStorage.getItem('safepost_view_check_id');
    if (!targetId) return;
    sessionStorage.removeItem('safepost_view_check_id');
    const match = checker.history.find((c) => c.id === targetId);
    if (match) {
      // Navigate to dashboard with the check result loaded
      if (match.result_json) {
        const normalised = {
          ...match.result_json,
          overall_status: match.overall_status,
          summary: match.result_json.summary ?? match.result_json.overallVerdict ?? '',
          issues: match.result_json.issues ?? [],
        };
        sessionStorage.setItem('safepost_last_result', JSON.stringify(normalised));
      }
      sessionStorage.setItem('safepost_last_content', match.content_text ?? '');
      navigate('/dashboard');
    }
  }, [checker.isLoadingHistory, checker.history]);

  const handleLogOut = async () => {
    sessionStorage.clear();
    await signOut();
    navigate('/');
  };

  // View a check on the dashboard
  const handleViewCheck = (check: SavedComplianceCheck) => {
    if (check.result_json) {
      const normalised = {
        ...check.result_json,
        overall_status: check.overall_status,
        summary: check.result_json.summary ?? check.result_json.overallVerdict ?? '',
        issues: check.result_json.issues ?? [],
      };
      sessionStorage.setItem('safepost_last_result', JSON.stringify(normalised));
    }
    // Always save content — even if result_json is missing
    sessionStorage.setItem('safepost_last_content', check.content_text ?? '');
    navigate('/dashboard');
  };

  // Filter logic
  const filteredHistory = checker.history.filter(check => {
    const matchesSearch = searchQuery === '' ||
      check.content_text?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || check.overall_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalFiltered = filteredHistory.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * PAGE_SIZE;
  const endIdx = Math.min(startIdx + PAGE_SIZE, totalFiltered);
  const paginatedHistory = filteredHistory.slice(startIdx, endIdx);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // Stats
  const totalChecks = checker.history.length;
  const compliantCount = checker.history.filter(c => c.overall_status === 'compliant').length;
  const nonCompliantCount = checker.history.filter(c => c.overall_status === 'non_compliant').length;
  const reviewCount = checker.history.filter(c =>
    c.overall_status === 'warning' || c.overall_status === 'requires_review'
  ).length;

  // Show plan limit banner
  const showLimitBanner = !isUltra && !bannerDismissed && totalChecks >= historyLimit;

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'History', path: '/history' },
    { label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f7f4] dark:bg-gray-900">

      {/* ── Header (same as Dashboard) ──────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white border-b border-black/[0.06]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/dashboard"><SafePostLogo /></Link>
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`px-3.5 py-2 text-[13px] font-medium rounded-lg transition-colors duration-200 ${
                    location.pathname === link.path
                      ? 'text-gray-900 bg-black/[0.04]'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-black/[0.04]'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-1 justify-end min-w-[180px]">
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => { setNotificationDropdownOpen(!notificationDropdownOpen); setAccountDropdownOpen(false); }}
                className="relative p-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-colors duration-200"
              >
                <Bell className="w-[18px] h-[18px]" />
                {notificationCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-[9px] font-bold text-white">{notificationCount}</span>
                  </span>
                )}
              </button>
            </div>
            <div className="relative">
              <button
                onClick={() => { setAccountDropdownOpen(!accountDropdownOpen); setNotificationDropdownOpen(false); }}
                onBlur={() => setTimeout(() => setAccountDropdownOpen(false), 150)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium text-gray-700 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-colors duration-200"
              >
                My Account
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${accountDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {accountDropdownOpen && (
                <div className="absolute top-full right-0 mt-1 w-56 bg-white rounded-xl border border-black/[0.06] shadow-lg py-1.5">
                  <div className="px-4 py-2.5">
                    <p className="text-[12px] text-gray-400 truncate">{userEmail}</p>
                    <p className="text-[10px] font-medium text-[#2563EB] mt-1">{dropdownPlanName}</p>
                  </div>
                  <div className="border-t border-black/[0.06] my-1" />
                  <button onClick={() => navigate('/profile')} className="block w-full text-left px-4 py-2 text-[13px] text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] transition-colors">Profile</button>
                  <button onClick={() => navigate('/billing')} className="block w-full text-left px-4 py-2 text-[13px] text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] transition-colors">Billing</button>
                  <button onClick={() => navigate('/settings')} className="block w-full text-left px-4 py-2 text-[13px] text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] transition-colors">Settings</button>
                  <div className="border-t border-black/[0.06] my-1" />
                  <button onClick={handleLogOut} className="flex items-center gap-2 w-full text-left px-4 py-2 text-[13px] text-gray-600 hover:text-gray-900 hover:bg-black/[0.04] transition-colors">
                    <LogOut className="w-3.5 h-3.5" />Log Out
                  </button>
                </div>
              )}
            </div>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] transition-all duration-200">
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* ── Main Content ─────────────────────────────────────────────────────── */}
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-6 pt-8 pb-16">

          {/* Back link */}
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 mb-2 dark:text-white">
              Compliance History
            </h1>
            <p className="text-[14px] text-gray-500 dark:text-gray-300">
              A full record of all your AHPRA compliance checks
            </p>
          </div>

          {/* Plan limit banner */}
          {showLimitBanner && (
            <div className="mb-6 px-5 py-3.5 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between dark:bg-blue-950 dark:border-blue-800">
              <p className="text-[13px] text-blue-700 dark:text-blue-300">
                You're seeing your most recent {historyLimit} checks.{' '}
                Upgrade to {historyLimit < 100 ? 'Pro+ or Ultra' : 'Ultra'} to access your full history.
              </p>
              <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                <button
                  onClick={() => navigate('/change-plan?mode=upgrade')}
                  className="text-[13px] font-semibold text-blue-600 hover:text-blue-700 transition-colors dark:text-blue-400"
                >
                  Upgrade
                </button>
                <button
                  onClick={() => setBannerDismissed(true)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Stats row */}
          {!checker.isLoadingHistory && totalChecks > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                { label: 'Total Checks', value: totalChecks, color: 'text-gray-700', bg: 'bg-white' },
                { label: 'Compliant', value: compliantCount, color: 'text-emerald-700', bg: 'bg-emerald-50' },
                { label: 'Non-Compliant', value: nonCompliantCount, color: 'text-red-700', bg: 'bg-red-50' },
                { label: 'Requires Review', value: reviewCount, color: 'text-amber-700', bg: 'bg-amber-50' },
              ].map(stat => (
                <div key={stat.label} className={`${stat.bg} rounded-xl border border-black/[0.06] p-4`}>
                  <p className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Search and filter bar */}
          {!checker.isLoadingHistory && totalChecks > 0 && (
            <div className="flex items-center gap-3 mb-5">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by content..."
                  className="w-full pl-9 pr-4 py-2.5 text-[13px] bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200 placeholder:text-gray-400"
                />
              </div>

              {/* Status filter */}
              <div className="relative">
                <button
                  onClick={() => setFilterOpen(!filterOpen)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-[13px] font-medium transition-all duration-150 ${
                    statusFilter !== 'all'
                      ? 'bg-blue-50 border-blue-200 text-blue-700'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <Filter className="w-3.5 h-3.5" />
                  {statusFilter === 'all' ? 'All' : getStatusConfig(statusFilter).label}
                </button>
                {filterOpen && (
                  <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-xl border border-black/[0.06] shadow-lg py-1.5 z-10">
                    {[
                      { value: 'all', label: 'All Checks' },
                      { value: 'compliant', label: 'Compliant' },
                      { value: 'non_compliant', label: 'Non-Compliant' },
                      { value: 'requires_review', label: 'Requires Review' },
                    ].map(option => (
                      <button
                        key={option.value}
                        onClick={() => { setStatusFilter(option.value); setFilterOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-[13px] transition-colors ${
                          statusFilter === option.value
                            ? 'text-blue-600 bg-blue-50 font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Content area */}
          {checker.isLoadingHistory ? (
            <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm p-12 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-7 h-7 text-blue-500 animate-spin" />
              <p className="text-[14px] text-gray-400 font-medium">Loading your compliance history...</p>
            </div>
          ) : totalChecks === 0 ? (
            <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm p-12 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-[15px] font-semibold text-gray-700 mb-2">No checks yet</h3>
              <p className="text-[13px] text-gray-400 mb-5 max-w-xs">
                Run your first compliance check on the dashboard and it will appear here.
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold rounded-lg transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm p-10 text-center">
              <p className="text-[14px] text-gray-400">No checks match your search or filter.</p>
              <button
                onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
                className="mt-3 text-[13px] text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {/* Results count */}
              <p className="text-[12px] text-gray-400 px-1 mb-3">
                {totalFiltered} {totalFiltered === 1 ? 'check' : 'checks'}
                {statusFilter !== 'all' || searchQuery ? ' matching your filters' : ' total'}
              </p>

              {/* Top pagination bar */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-black/[0.06]">
                  <p className="text-[13px] text-gray-500">
                    Showing {startIdx + 1}–{endIdx} of {totalFiltered} checks
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={safePage === 1}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                        safePage === 1
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                          page === safePage
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={safePage === totalPages}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                        safePage === totalPages
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      Next
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {paginatedHistory.map((check) => (
                <CheckRow
                  key={check.id}
                  check={check}
                  onView={handleViewCheck}
                  onDelete={checker.deleteCheck}
                  isUltra={isUltra}
                />
              ))}

              {/* Pagination bar */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-black/[0.06]">
                  <p className="text-[13px] text-gray-500">
                    Showing {startIdx + 1}–{endIdx} of {totalFiltered} checks
                  </p>
                  <div className="flex items-center gap-1">
                    {/* Prev button */}
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={safePage === 1}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                        safePage === 1
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      Prev
                    </button>

                    {/* Page number buttons */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                          page === safePage
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    {/* Next button */}
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={safePage === totalPages}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                        safePage === totalPages
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      Next
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="bg-[#f7f7f4] dark:bg-gray-900 border-t border-black/[0.06] pt-14 pb-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8">
            <div>
              <h4 className="text-[13px] font-semibold text-gray-900 mb-4">Features</h4>
              <ul className="space-y-2.5">
                <li><button onClick={() => navigate('/features')} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">Features</button></li>
                <li><button onClick={() => navigate('/pricing/medical-practitioners')} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">Pricing</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[13px] font-semibold text-gray-900 mb-4">Resources</h4>
              <ul className="space-y-2.5">
                <li><a href="https://www.ahpra.gov.au/Resources/Advertising-hub.aspx" target="_blank" rel="noopener noreferrer" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">Advertising hub</a></li>
                <li><a href="https://www.tga.gov.au/resources/guidance/advertising-therapeutic-goods-social-media" target="_blank" rel="noopener noreferrer" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">TGA guidelines</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[13px] font-semibold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2.5">
                <li><button onClick={() => navigate('/terms-of-use')} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">Terms of Use</button></li>
                <li><button onClick={() => navigate('/privacy-policy')} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">Privacy Policy</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[13px] font-semibold text-gray-900 mb-4">Connect</h4>
              <ul className="space-y-2.5">
                <li><button onClick={() => navigate('/contact')} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">Contact us</button></li>
              </ul>
            </div>
          </div>
          <div className="mt-14 pt-6 border-t border-black/[0.06]">
            <p className="text-[10px] text-gray-400 leading-relaxed tracking-wide">
              Disclaimer: This application is an AI-powered guidance tool and does not constitute legal or regulatory advice.
              AHPRA and the National Boards do not provide pre-approval for advertising.
              Registered health practitioners are ultimately responsible for ensuring their social media activities and advertising complies with the Health Practitioner Regulation National Law.
            </p>
            <p className="text-[11px] text-gray-400 mt-4">&copy; SafePost&trade; 2026</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default History;

import React, { useState } from 'react';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Trash2,
  Eye,
  Clock,
  ChevronRight,
} from 'lucide-react';
import type { SavedComplianceCheck } from '../../hooks/useComplianceChecker';
import { ComplianceReport } from './ComplianceReport';

interface ComplianceHistoryProps {
  history: SavedComplianceCheck[];
  isLoading: boolean;
  onDelete: (id: string) => Promise<void>;
  onReview: (check: SavedComplianceCheck) => void;
}

function StatusIcon({ status }: { status: string }) {
  if (status === 'compliant') return <CheckCircle className="w-4 h-4 text-green-500" />;
  if (status === 'non_compliant') return <XCircle className="w-4 h-4 text-red-500" />;
  return <AlertTriangle className="w-4 h-4 text-amber-500" />;
}

function ScorePill({ score }: { score: number }) {
  const color =
    score >= 85
      ? 'bg-green-100 text-green-700'
      : score >= 60
      ? 'bg-amber-100 text-amber-700'
      : 'bg-red-100 text-red-700';
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${color}`}>{score}/100</span>
  );
}

export function ComplianceHistory({
  history,
  isLoading,
  onDelete,
  onReview,
}: ComplianceHistoryProps) {
  const [selectedCheck, setSelectedCheck] = useState<SavedComplianceCheck | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
    if (selectedCheck?.id === id) setSelectedCheck(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-3">
          <Clock className="w-8 h-8 text-gray-300 animate-pulse" />
          <p className="text-sm text-gray-400">Loading your compliance history…</p>
        </div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <Clock className="w-8 h-8 text-gray-300" />
        </div>
        <h3 className="text-base font-medium text-gray-700 mb-1">No checks yet</h3>
        <p className="text-sm text-gray-400">
          Your compliance check history will appear here after you run your first check.
        </p>
      </div>
    );
  }

  if (selectedCheck) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedCheck(null)}
            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
          >
            ← Back to history
          </button>
          <span className="text-gray-300">|</span>
          <span className="text-sm text-gray-500">
            {new Date(selectedCheck.created_at).toLocaleString('en-AU')}
          </span>
        </div>
        <ComplianceReport
          result={selectedCheck.result_json}
          savedCheckId={selectedCheck.id}
          onReset={() => setSelectedCheck(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-900">
          Compliance History
          <span className="ml-2 text-sm font-normal text-gray-400">({history.length} checks)</span>
        </h2>
      </div>

      {history.map((check) => (
        <div
          key={check.id}
          className="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors"
        >
          <div className="flex items-start gap-3">
            <StatusIcon status={check.overall_status} />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <ScorePill score={check.compliance_score} />
                <span className="text-xs text-gray-500 capitalize">
                  {check.content_type.replace(/_/g, ' ')}
                </span>
                <span className="text-gray-300 text-xs">·</span>
                <span className="text-xs text-gray-500 capitalize">
                  {check.platform}
                </span>
                <span className="text-gray-300 text-xs">·</span>
                <span className="text-xs text-gray-400">
                  {new Date(check.created_at).toLocaleDateString('en-AU', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <p className="text-sm text-gray-700 truncate">{check.content_text}</p>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0 ml-2">
              <button
                onClick={() => setSelectedCheck(check)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="View report"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(check.id)}
                disabled={deletingId === check.id}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
import React, { useState } from 'react';
import { useComplianceChecker } from '../hooks/useComplianceChecker';
import { ContentInputForm } from './ComplianceChecker/ContentInputForm';
import { AnalysisProgress } from './ComplianceChecker/AnalysisProgress';
import { ComplianceReport } from './ComplianceChecker/ComplianceReport';
import { ComplianceHistory } from './ComplianceChecker/ComplianceHistory';
import { Shield } from 'lucide-react';

type ActiveTab = 'checker' | 'history';

export function ComplianceCheckerPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('checker');
  const checker = useComplianceChecker();

  const showForm = checker.step === 'idle' || checker.step === 'error';
  const showProgress =
    checker.step === 'fetching_guidelines' || checker.step === 'analyzing';
  const showReport = checker.step === 'complete' && checker.result !== null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-600">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">SafePost™</h1>
                <p className="text-xs text-gray-500">AHPRA Compliance Checker</p>
              </div>
            </div>

            {/* Tabs */}
            <nav className="flex gap-1">
              {(['checker', 'history'] as ActiveTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    if (tab === 'history') checker.loadHistory();
                  }}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {tab === 'checker' ? 'Compliance Checker' : 'History'}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'checker' && (
          <div className="space-y-6">
            {showForm && (
              <ContentInputForm
                onSubmit={checker.runCheck}
                error={checker.error}
              />
            )}
            {showProgress && <AnalysisProgress step={checker.step} />}
            {showReport && checker.result && (
              <ComplianceReport
                result={checker.result}
                savedCheckId={checker.savedCheckId}
                onReset={checker.resetChecker}
              />
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <ComplianceHistory
            history={checker.history}
            isLoading={checker.isLoadingHistory}
            onDelete={checker.deleteCheck}
            onReview={(check) => {}}
          />
        )}
      </div>
    </div>
  );
}
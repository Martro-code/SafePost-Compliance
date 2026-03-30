import React, { useState } from 'react';
import { useComplianceChecker } from '../hooks/useComplianceChecker';
import { useAccount } from '../context/AccountContext';
import { ContentInputForm } from '../components/compliance/ContentInputForm';
import { AnalysisProgress } from '../components/compliance/AnalysisProgress';
import { ComplianceReport } from '../components/compliance/ComplianceReport';
import { ComplianceHistory } from '../components/compliance/ComplianceHistory';
import { Shield } from 'lucide-react';
import { trackComplianceCheckRun } from '../services/analytics';

type ActiveTab = 'checker' | 'history';

export function ComplianceCheckerPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('checker');
  const { accountId, plan, checksUsed, checksLimit, specialty, refreshAccount } = useAccount();
  const checker = useComplianceChecker({
    planName: plan,
    accountId,
    specialty,
    checksUsed,
    checksLimit,
    onCheckComplete: refreshAccount,
  });

  const showForm = checker.step === 'idle' || checker.step === 'error';
  const showProgress = checker.step === 'analyzing';
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
                <h1 className="text-lg font-semibold text-gray-900">SafePost</h1>
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
                onSubmit={(content, contentType, platform) => {
                  trackComplianceCheckRun(platform, contentType);
                  return checker.runCheck(content, contentType, platform);
                }}
                error={checker.error}
                authError={checker.authError}
              />
            )}
            {showProgress && <AnalysisProgress step={checker.step} />}
            {showReport && checker.result && (
              <ComplianceReport
                result={checker.result}
                savedCheckId={null}
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
export interface AuditStep {
  name: string;
  description: string;
  url: string;
  status: 'pending' | 'active' | 'complete';
  result?: AuditStepResult;
}

export interface AuditStepResult {
  url: string;
  complianceStatus: 'pass' | 'warning' | 'fail';
  issues: {
    severity: 'low' | 'medium' | 'high';
    description: string;
    recommendation: string;
  }[];
  summary: string;
}

export interface AuditSession {
  id: string;
  account_id: string;
  created_at: string;
  updated_at: string;
  status: 'in_progress' | 'complete';
  steps: AuditStep[];
}

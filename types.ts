
export enum ComplianceStatus {
  COMPLIANT = 'COMPLIANT',
  NON_COMPLIANT = 'NON_COMPLIANT',
  WARNING = 'WARNING',
  NOT_HEALTHCARE = 'NOT_HEALTHCARE'
}

export interface ComplianceIssue {
  guidelineReference: string;
  finding: string;
  severity: 'Critical' | 'Warning';
  recommendation: string;
}

export interface AnalysisResult {
  status: ComplianceStatus;
  summary: string;
  issues: ComplianceIssue[];
  overallVerdict: string;
}

export interface RewrittenPost {
  optionTitle: string;
  content: string;
  explanation: string;
}
// Types for the store
export interface CreditApprovalFinancialSummaryDTO {
  createdAt: string | null;
  updatedAt: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  id: number | null;
  cartableId: number | null;
  employmentCount: number;
  exportValue: number;
  operatingRevenue: number;
  operatingCosts: number;
  goodsPurchased: number;
  operatingProfit: number;
  netProfit: number;
  currentRatio: number;
  otherRatio: number;
  tradeReceivables: number;
  inventoryValue: number;
  totalAssets: number;
  shareholdersEquity: number;
  retainedEarnings: number;
  debtRatio: number;
  hasReturnedChecks: boolean;
  guaranteeOutstanding: number;
  creditOutstanding: number;
  debtOutstanding: number;
  lastVisit: string;
}

export interface ApplicantRequestDTO {
  letterNo: string;
  letterDate: string;
  reqDescription: string;
}
export interface ConditionsDTO {
  otherConditionsAndObservations: string
}
export interface CreditApprovalLastDecisionDTO {
  createdAt: string | null;
  updatedAt: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  id: number | null;
  cartableId: number | null;
  finalApprovalReference: string;
  attachedByLetterNo: string;
  attachedByLetterNoDate: string;
  regionOrCorpBankingSuggestion: string;
}

export interface PreApprovalState {
  creditApprovalFinancialSummaryDTO: CreditApprovalFinancialSummaryDTO | null;
  creditApprovalLastDecisionDTO: CreditApprovalLastDecisionDTO | null;
  loading: boolean;
  error: string | null;
}

export interface CreditSuggestionData {
  templateBody: string;
  conditions: string;
}

export interface CreditSuggestionDescriptionData {
  description: string;
  cartableId: number;
}

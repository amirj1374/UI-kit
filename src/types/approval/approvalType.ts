export interface CustomerDto {
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  id?: number;
  trackingCode?: string;
  status?: string;
  requestDate?: string;
  cif?: string;
  summery?: string;
  branchCode?: string;
  nationalCode?: string;
  customerName?: string;
  address?: number;
  postalCode?: number;
  phoneNo?: number;
  branchName?: string;
  clientgroupname?: string;
  facilities?: Facility | Facility[];
  guarantee?: Guarantee | Guarantee[];
  lc?: Lc | Lc[];
  greenLicense?: GreenLicense | GreenLicense[];
}

export interface Facility {
  id: number;
  approvalType: string;
  currency: string;
  amount: number;
  repaymentType: string;
  year?: string;
  month?: string;
  day?: string;
  durationDay?: string;
  collaterals: Collaterals[];
}

export interface Guarantee {
  id: number;
  approvalType: string;
  currency: string;
  amount: number;
  year?: string;
  month?: string;
  day?: string;
  durationDay?: string;
  collaterals: Collaterals[];
}

export interface Lc {
  id: number;
  approvalType: string;
  currency: string;
  amount: number;
  creditType: string;
  year?: string;
  month?: string;
  day?: string;
  durationDay?: string;
  collaterals: Collaterals[];
  preferentialRate: string;
  preReceiving: string;
}

export interface GreenLicense {
  id: number;
  approvalType: string;
  currency: string;
  amount: number;
  collaterals: Collaterals[];
}

export interface Collaterals {
  collateral: { description: string; collateralTypeCode: string };
  amount: number;
  percent: number;
}

export interface FetchCustomerPayload {
  cif?: string | null;
  nationalCode?: string | null;
}

export interface FetchGuarantorPayload {
  nationalCode?: string | null;
  cif?: string | null;
  guarantorName?: string | null;
}

export interface FetchInquiryPayload {
  nationalCode?: string | null;
  loanRequestId: string;
  retry: boolean;
}

export interface GuarantorDto {
  id?: number | null;
  nationalCode?: string | null;
  cif?: string | null;
  guarantorName?: string | null;
  createdAt?: string | null;
  customerType?: string | null;
  existCore?: boolean | null;
  label?: string | null;
  value?: string | null;
  sapInquiryStatus?: boolean | null;
  loanRequestId?: string | null;
  sapInquiry?: {
    value?: string | null;
    label?: string | null;
    changeDate?: string | null;
    collateral?: string | null;
    createdAt?: string | null;
    createdBy?: string | null;
    directObligationAmount?: string | null;
    guarantorInfo?: string | null;
    guarantorInfoId?: string | null;
    id?: string | null;
    inDirectObligationAllOfThem?: string | null;
    inDirectObligationAmount?: string | null;
    loanRequest?: string | null;
    loanRequestId?: string | null;
    mainCustomer?: string | null;
    nationalCode?: string | null;
    obligationDate?: string | null;
    updatedAt?: string | null;
    updatedBy?: string | null;
  } | null;
}

export interface CurrenciesDto {
  description: string;
  code: string;
}

export interface CollateralDto {
  description: string;
  collateralTypeCode: string;
}

export interface RegionsDto {
  code: string;
  name: string;
  status: string;
}

export interface DepartmentLevelDto {
  departmentLevel: string;
  name: string;
}

export interface ContractTypeDto {
  id: number;
  parentId: number;
  code: string;
  shortTitle: string;
  longTitle: string;
  mainGroup: string;
  childOrder: string;
  activationDate: string;
  equivalentCode: number;
  parameterValue: string;
  active: string;
  requestType: 'ContractCode' | 'GuaranteeType' | 'LetterOfCredit';
}

export interface FacilitiesDto {
  facilityId: number;
  facilityCode: number;
  facilityName: string;
  contractId: number;
}

export interface InquiryDto {
  value?: string;
  label?: string;
  collateral?: string;
}

export interface DepositAccount {
  createdAt: string | null;
  updatedAt: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  id: string | null;
  accountNo: string;
  accountStatus: string;
  accountType: string;
  avgBalanceHalf: string;
  avgBalanceQuarter: string;
  avgBalanceYear: string;
  branch: string;
  countCreditTurnoverHalf: string;
  countCreditTurnoverQuarter: string;
  countCreditTurnoverYear: string;
  countDebitTurnoverHalf: string;
  countDebitTurnoverQuarter: string;
  countDebitTurnoverYear: string;
  creditTurnoverHalf: string;
  creditTurnoverQuarter: string;
  creditTurnoverYear: string;
  currency: string;
  debitTurnoverHalf: string;
  debitTurnoverQuarter: string;
  debitTurnoverYear: string;
  finalBalance: string;
  interestRate: string | null;
  openingDate: string;
}

export interface DepositListResponse {
  depositList: DepositAccount[];
}

export interface ConsiderationPayload {
  loanRequestId: string;
  previousLoanAppropriate: boolean;
  havePromissoryNote: boolean;
  signatory: string;
  currentOffersAmount: number;
  creditLimitDate: string;
}

export interface CollateralsInfoPayload {
  loanRequestId: string;
  deposit: DepositDTO;
  estate: EstateDTO;
  sharesBond: SharesBondDTO;
  stock: StockDTO;
  otherCollateralAmount: number;
  id: number;
  description: string;
}

export interface addCreditApprovalDescriptionPayload {
  cartableId: number;
  Description: string;
}

export interface DepositDTO {
  customerName: string;
  blockedAmount: number;
  assignedAmount: number;
  assignedDate: string;
  externalRef?: number;
  id: number;
}

export interface EstateDTO {
  customerName: string;
  houseNumberPlate: string;
  type: string;
  evaluatedPrice: number;
  evaluationDate: string;
  assignedAmount: number;
  assignedDate: string;
  id: number;
}

export interface SharesBondDTO {
  assignedAmount: number;
  parsianBankAgency: boolean;
  assignedDate: string;
  customerName: string;
  id: number;
}

export interface StockDTO {
  stockCount: number;
  customerName: string;
  assignedAmount: number;
  assignedDate: string;
  totalAmount: number;
  companyName: string;
  nationalCode: string;
  id: number;
}

export interface UploadFile {
  customerNumber?: string | null;
  customerCode?: string | null;
  docTypeCode: string;
  file: File;
  description?: string;
}

export interface Collateral {
  type: number;
  amount: number;
  percent: number;
}

export interface LoanRequestDetail {
  summaryRequest: SummaryDto;
  facilities: FacilitiesRequest[];
  guarantee: GuaranteeRequest[];
  lc: LcRequest[];
  greenLicense: GreenLicense[];
}

export interface FacilitiesRequest {
  id: number;
  approvalType?: string;
  currency: string;
  amount: number;
  repaymentType: string;
  year?: string;
  month?: string;
  day?: string;
  durationDay?: string;
  collaterals: Collaterals[];
  preferentialRate: string;
  advancePayment: string;
  contractType: ContractType;
  facility?: FacilityDto;
  contractTypeAndFacilityList?: FacilitySelection[];
  considerPreviousDebt: boolean;
}

export interface FacilitySelection {
  contractType: ContractType;
  facility: FacilityDto;
}

export interface GuaranteeRequest {
  id: number;
  approvalType?: string;
  currency: string;
  amount: number;
  year?: string;
  month?: string;
  day?: string;
  durationDay?: string;
  collaterals: Collaterals[];
  percentDeposit: string;
  contractType: ContractType;
  facility?: FacilityDto;
  contractTypeAndFacilityList?: Array<{
    contractType: ContractType;
  }>;
  considerPreviousDebt: boolean;
}

export interface LcRequest {
  id: number;
  approvalType: string;
  currency: string;
  amount: number;
  year?: string;
  month?: string;
  day?: string;
  durationDay?: string;
  collaterals: Collaterals[];
  intermediatePayment: string;
  advancePayment: string;
  creditContractType: string;
}

export interface ContractType {
  coreId: number;
  activationDate: string;
  active: string;
  childOrder: string;
  code: string;
  equivalentCode: string;
  id: number;
  longTitle: string;
  mainGroup: string;
  parameterValue: string;
  parentId: number;
  shortTitle: string;
}

export interface FacilityDto {
  contractId: number;
  facilityCode: string;
  facilityId: number;
  facilityName: string;
}

export interface SummaryDto {
  summary: string;
  activityType: string;
  description: string;
}

export interface LoanRequest {
  loanRequestDetailList: LoanRequestDetail[];
}

export interface RequestInformationDto {
  contractTypeId: number;
  contractType?: ContractTypeDto;
  approvalType: string;
  requestType: string;
  amount: string;
  currency: string;
  facilityId: number;
  facility?: FacilitiesDto;
  year?: number;
  month?: number;
  day?: number;
  repaymentType: string;
  collaterals: Array<{
    type: string;
    amount: number;
    percent: number;
  }>;
  percentDeposit?: number;
  advancePayment?: string;
  durationDay?: number;
}

export interface RootData {
  customerInfo: CustomerDto[];
  summaryRequest: SummaryDto;
  // Add other sections here...
}

// Add interfaces for saveGeneral payload
export interface LoanRequestDTO {
  cif?: string;
  summary: string;
  activityType: string | null;
  description: string | null;
}

export interface GuarantorInfoDTO {
  nationalCode: string;
  guarantorName: string;
  createdAt: string;
  label?: string;
  sapInquiryStatus?: boolean;
  value?: string;
}

export interface LoanRequestDetailDTO {
  loanRequestDetailList: LoanRequestDetail[];
}

export interface SaveGeneralPayload {
  customerInfoDTO: CustomerDto;
  loanRequestDetailDTO: LoanRequestDetailDTO;
  guarantorInfoDTO: GuarantorInfoDTO[];
  loanRequestId: string;
  trackingCode: string;
}

export interface BranchDto {
  code: number;
  name: string;
  status: boolean;
}

export interface RecentlyApprovalDTO {
  recentApprovalsDesc: string;
  remainDebtParsian: string;
  creditEstimation: string;
}

export interface ApprovalRequest {
  branchCode: string;
  branchName: string;
  cif: string;
  createdBy: string;
  customerName: string;
  id: number;
  nationalCode: string;
  requestDate: string;
  status: string;
  trackingCode: string;
}

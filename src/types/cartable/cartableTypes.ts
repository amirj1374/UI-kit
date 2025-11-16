export interface CartableDetail {
  createdAt: string;
  createdBy: string;
  status: string;
  trackingCode: string;
  updatedAt: string;
  updatedBy: string;
  userName: string;
  roleName: string;
  branchCode: string;
  branchName: string;
}

export interface ValidUserPayload {
  id: number;
  actionType: string;
  roleName: string;
}

export interface ValidRole {
  departmentLevel: string;
  departmentLevelName: string;
  roleName: string;
  roleCode: number;
  roleDescription: string;
  minUserNumber?: number;
  maxUserNumber?: number;
  canSetCorrectionDeadline?: boolean;
}

export interface ActionData {
  actionType: string;
  actionName: string;
  validRoles: ValidRole[];
}


export interface SignerData {
  name: string;
  username: string;
}

export interface RoleDTO {
  name: string;
  code: number;
}

export interface SamapRoleDTO {
  code: number;
  createdAt: string;
  createdBy: string;
  id: number;
  name: string;
  description: string;
  updatedAt: string;
  updatedBy: string;
}

export interface SubmitReferencePayload {
  cartableId: number;
  roleDTO: RoleDTO;
  description: string;
  actionType: string;
  usernameList: string[];
  correctionDeadline ?: string;
  expertReportIsSeen?: boolean;
}


export interface SubmitChangeSignerPayload {
  username: string;
  id: number;
}

export interface SubmitSignPayload {
  cartableId: number;
  comment: string;
  actionType: string;
  expertReportIsSeen: boolean | null;
}

type CartableAction = 'CREATED' | 'UPDATED' | 'DELETED'; // Extend as needed

export interface CartableHistory {
  action: CartableAction;
  comments: string;
  completedAt: string;
  createdAt: string | null;
  createdBy: string | null;
  id: string | null;
  roleCode: number | string;
  roleName: string;
  updatedAt: string | null;
  updatedBy: string | null;
}

// Committee inquiry action types
export type CommitteeActionType = 'AGREED' | 'DISAGREED' | 'RETURNED';

// Committee inquiry interface
export interface CommitteeInquiry {
  id: number;
  username: string;
  name: string;
  actionDone: boolean;
  actionType: CommitteeActionType;
  actionTypeName: string;
  comment: string | null;
  actionDoneAt: string;
}

// Main Cartable interface based on the provided JSON
export interface Cartable {
  // Base fields
  id: number;
  trackingCode: string;
  loanRequestId: number;
  status: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string | null;
  
  // Dates and times
  creationDate: string;
  creationTime: string;
  updateDate: string;
  updateTime: string;
  requestDate: string;
  signDate: string | null;
  correctionDeadline: string | null;
  
  // User information
  createdByUsername: string;
  createByName: string;
  roleName: string | null;
  description: string | null;
  
  // Branch information
  branchCode: number;
  branchName: string;
  
  // Customer information
  customerCode: string;
  customerName: string;
  customerGroup: string;
  customerType: 'Corporate' | 'Individual';
  
  // File URLs
  expertReportUrl: string | null;
  report1016Url: string | null;
  formLetterUrl: string | null;
  formCreditApprovalUrl: string | null;
  
  // Permissions and flags
  hasSignPermission: boolean;
  canAddComment: boolean;
  canSubmit: boolean;
  canChangeSigner: boolean;
  isExpertSeen: boolean;
  committeeTask: boolean;
  mainAssignee: boolean;
  
  // Comments and inquiries
  currentUserComment: string | null;
  commiteInquiries: CommitteeInquiry[];
}

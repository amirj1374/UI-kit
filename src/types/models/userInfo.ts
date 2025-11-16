import type { CustomizerDTO } from '@/types/models/person';

export interface UserInfoResponse {
  name: string;
  sub: string;
  emailVerified: boolean;
  issuer: string | null;
  branchName: string;
  preferredUsername: string;
  nonce: string;
  sid: string;
  branchCode: string;
  audience: string[];
  acr: string;
  azp: string;
  authTime: string;
  fullName: string;
  position: string;
  expiration: string;
  sessionState: string;
  issuedAt: string;
  jti: string;
  authorities: string[];
  username: string;
  email: string | null;
  roles: string[];
  lotusRoles: string[];
  customizer: CustomizerDTO
} 
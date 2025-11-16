export const ApprovalTypeEnum = {
  CASE: 'CASE',
  MULTI_USE: 'MULTI_USE',
  ANNUAL_LIMIT: 'ANNUAL_LIMIT',
} as const;

export type ApprovalType = (typeof ApprovalTypeEnum)[keyof typeof ApprovalTypeEnum];

export const ApprovalTypeOptions = [
  { title: 'موردی', value: ApprovalTypeEnum.CASE },
  { title: 'استفاده چند باره تا سقف', value: ApprovalTypeEnum.MULTI_USE },
  { title: 'حد سالانه', value: ApprovalTypeEnum.ANNUAL_LIMIT },
];

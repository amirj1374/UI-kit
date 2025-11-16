export const RepaymentTypeEnum = {
  INSTALLMENT: 'INSTALLMENT',
  NON_INSTALLMENT: 'NON_INSTALLMENT',
} as const;

export type RepaymentType = (typeof RepaymentTypeEnum)[keyof typeof RepaymentTypeEnum];

export const RepaymentTypeOptions = [
  { title: 'تدریجی', value: RepaymentTypeEnum.INSTALLMENT },
  { title: 'یکجا', value: RepaymentTypeEnum.NON_INSTALLMENT },
];
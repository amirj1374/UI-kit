export const LcProductTypeEnum = {
  TRANSFER_CREDIT: 'TRANSFER_CREDIT',
  INSIDE_LC: 'INSIDE_LC',
  BACK_TO_BACK_LC: 'BACK_TO_BACK_LC',
  NORMAL_LC: 'NORMAL_LC',
  CUSTOMER_LC: 'CUSTOMER_LC',
  NORMAL_EXPORT: 'NORMAL_EXPORT',
  INTERNAL_INSIDE: 'INTERNAL_INSIDE'
} as const;

export type LcProductType = (typeof LcProductTypeEnum)[keyof typeof LcProductTypeEnum];

export const LcProductOption = [
  { title: 'Transfer Of a Documentary Credit', value: LcProductTypeEnum.TRANSFER_CREDIT },
  { title: 'اعتبار اسنادی داخلی', value: LcProductTypeEnum.INSIDE_LC },
  { title: 'Back to Back L/C', value: LcProductTypeEnum.BACK_TO_BACK_LC },
  { title: 'اعتبار اسنادی وارداتی عادی', value: LcProductTypeEnum.NORMAL_LC },
  { title: 'مشتریان بانکی', value: LcProductTypeEnum.CUSTOMER_LC },
  { title: 'اعتبار اسنادی صادراتی عادی', value: LcProductTypeEnum.NORMAL_EXPORT },
  { title: 'اعتبار اسنادی صادراتی داخلی', value: LcProductTypeEnum.INTERNAL_INSIDE },
];
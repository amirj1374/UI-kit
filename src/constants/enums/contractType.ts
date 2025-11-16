export const ContractTypeEnum = {
  IMPORT: 123,
  EXPORT: 124,
} as const;

export type ContractType = (typeof ContractTypeEnum)[keyof typeof ContractTypeEnum];

export const ContractTypeOption = [
  { longTitle: 'اعتبار اسنادی وارداتی', value: ContractTypeEnum.IMPORT},
  { longTitle: 'اعتبار اسنادی صادراتی', value: ContractTypeEnum.EXPORT },
];

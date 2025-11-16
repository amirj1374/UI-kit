export const BooleanEnum = {
  TRUE: true,
  FALSE: false
} as const;

export type BooleanStatus = (typeof BooleanEnum)[keyof typeof BooleanEnum];

export const BooleanEnumOptions = [
  { title: '✅', value: BooleanEnum.TRUE },
  { title: '❌', value: BooleanEnum.FALSE }
];
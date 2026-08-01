export type UiPermissionEvaluator = (permission: string) => boolean;
export type UiMissingPermissionEvaluatorPolicy = 'allow' | 'deny';
export interface UiPermissionOptions { evaluator?: UiPermissionEvaluator; missingEvaluator?: UiMissingPermissionEvaluatorPolicy }
export interface UiPermissionRequirement { permission?: string; any?: string[]; all?: string[] }
export type UiPermissionInput = string | string[] | UiPermissionRequirement;

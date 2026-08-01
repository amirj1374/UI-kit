export { defaultThemes } from './defaults';
export function mergeThemes<T extends Record<string, unknown>>(base: T, overrides: Partial<T>): T { return { ...base, ...overrides }; }

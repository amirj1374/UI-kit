import { describe, expect, it, vi } from 'vitest';
import { CustomDataTable, CustomDataTableV2 } from '@/index';

vi.mock('vue3-lottie', () => ({ Vue3Lottie: {} }));

describe('data table public exports', () => {
  it('keeps both package-root names as aliases of the V2 implementation', () => {
    expect(CustomDataTable).toBeDefined();
    expect(CustomDataTableV2).toBeDefined();
    expect(CustomDataTable).toBe(CustomDataTableV2);
  });
});

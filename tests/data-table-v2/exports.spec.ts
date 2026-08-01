import { describe, expect, it, vi } from 'vitest';

vi.mock('vue3-lottie', () => ({ Vue3Lottie: {} }));

describe('data table public exports', () => {
  it('keeps both package-root names as aliases of the V2 implementation', async () => {
    const { CustomDataTable, CustomDataTableV2 } = await import('@/index');
    expect(CustomDataTable).toBeDefined();
    expect(CustomDataTableV2).toBeDefined();
    expect(CustomDataTable).toBe(CustomDataTableV2);
  }, 20_000);
});

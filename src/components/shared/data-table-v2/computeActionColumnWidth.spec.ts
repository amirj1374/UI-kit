import { describe, it, expect } from 'vitest';
import { computeActionColumnWidth } from './computeActionColumnWidth';
import type { DataTableV2Props } from './types';

const props = (p: Partial<DataTableV2Props>): DataTableV2Props => p as DataTableV2Props;

describe('computeActionColumnWidth', () => {
  it('enforces a minimum width of 200', () => {
    expect(computeActionColumnWidth(props({}))).toBe(200);
  });

  it('sums action widths with gaps and padding', () => {
    // edit(140) + delete(120) = 260; gap (2-1)*8 = 8; padding 32 => 300
    expect(computeActionColumnWidth(props({ actions: ['edit', 'delete'] }))).toBe(300);
  });

  it('accounts for route buttons', () => {
    // view(140) + 1 route(120) = 260; gap (2-1)*8 = 8; padding 32 => 300
    const result = computeActionColumnWidth(props({ actions: ['view'], routes: { details: '/x' } as any }));
    expect(result).toBe(300);
  });

  it('ignores function-style routes for width', () => {
    const fnRoutes = (() => ({})) as any;
    expect(computeActionColumnWidth(props({ routes: fnRoutes }))).toBe(200);
  });

  it('adds width for custom actions and download links', () => {
    const result = computeActionColumnWidth(
      props({ customActions: [{} as any], downloadLink: { pdf: '/p' } as any })
    );
    // customAction(140) + download(120) = 260; gap 8; padding 32 => 300
    expect(result).toBe(300);
  });

  it('uses a fixed allowance when customButtonsFn is provided', () => {
    const result = computeActionColumnWidth(props({ customButtonsFn: (() => []) as any }));
    // 240 + gap (2-1)*8 + 32 = 280
    expect(result).toBe(280);
  });
});

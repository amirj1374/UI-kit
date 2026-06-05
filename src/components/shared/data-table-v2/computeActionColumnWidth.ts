import type { DataTableV2Props } from './types';

/** Shared width calculation for the actions column (used by grouped + normal headers). */
export function computeActionColumnWidth(props: DataTableV2Props): number {
  let totalWidth = 0;

  if (props.actions) {
    for (const action of props.actions) {
      switch (action) {
        case 'edit':
          totalWidth += 140;
          break;
        case 'delete':
          totalWidth += 120;
          break;
        case 'view':
          totalWidth += 140;
          break;
        case 'create':
          totalWidth += 120;
          break;
        default:
          break;
      }
    }
  }

  if (props.routes) {
    const keys = typeof props.routes === 'function' ? [] : Object.keys(props.routes);
    totalWidth += keys.length * 120;
  }

  if (props.downloadLink) {
    totalWidth += Object.keys(props.downloadLink).length * 120;
  }

  if (props.customActions) {
    totalWidth += props.customActions.length * 140;
  }

  if (props.customButtonsFn) {
    totalWidth += 240;
  } else if (props.customButtons) {
    totalWidth += props.customButtons.length * 120;
  }

  const buttonCount =
    (props.actions?.length || 0) +
    (props.routes && typeof props.routes !== 'function' ? Object.keys(props.routes).length : 0) +
    (props.downloadLink ? Object.keys(props.downloadLink).length : 0) +
    (props.customActions?.length || 0) +
    (props.customButtons?.length || (props.customButtonsFn ? 2 : 0));

  totalWidth += Math.max(buttonCount - 1, 0) * 8;
  totalWidth += 32;

  return Math.max(totalWidth, 200);
}

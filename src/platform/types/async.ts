export type UiAsyncStatus = 'idle' | 'loading' | 'empty' | 'error' | 'success' | 'permission-denied';
export interface UiAsyncState<T = unknown, E = unknown> { status: UiAsyncStatus; data?: T; error?: E; message?: string }
export const isUiAsyncLoading = (state: UiAsyncState): boolean => state.status === 'loading';
export const isUiAsyncError = (state: UiAsyncState): boolean => state.status === 'error';
export const hasUiAsyncData = <T>(state: UiAsyncState<T>): state is UiAsyncState<T> & { data: T } => state.data !== undefined;

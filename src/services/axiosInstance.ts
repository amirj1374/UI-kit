/**
 * Axios instance for the UI Kit library
 * 
 * This allows consuming apps to provide their own configured axios instance.
 * If not configured, it falls back to the default axios instance.
 */
import axios, { type AxiosInstance } from 'axios';

let configuredInstance: AxiosInstance | null = null;

/**
 * Configure the default axios instance for the UI Kit library
 * @param instance - Your configured axios instance
 */
export function configureAxiosInstance(instance: AxiosInstance) {
  configuredInstance = instance;
}

/**
 * Get the axios instance to use (configured instance or default)
 */
export default function getAxiosInstance(): AxiosInstance {
  return configuredInstance || axios;
}

// For backward compatibility, also export as default axios
// This allows direct import: import axiosInstance from '@amirjalili1374/ui-kit'
export const defaultAxios = axios;


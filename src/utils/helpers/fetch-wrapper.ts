/**
 * Generic fetch wrapper for HTTP requests
 * 
 * This is a simple wrapper around fetch API. Consuming apps can extend this
 * or provide their own authentication headers by configuring the authHeader function.
 */

export interface AuthConfig {
  getToken?: () => string | null;
  getApiBaseUrl?: () => string | null;
  onUnauthorized?: () => void;
}

let authConfig: AuthConfig | null = null;

/**
 * Configure authentication for fetch wrapper
 * @param config - Auth configuration
 */
export function configureAuth(config: AuthConfig) {
  authConfig = config;
}

export const fetchWrapper = {
  get: request('GET'),
  post: request('POST'),
  put: request('PUT'),
  delete: request('DELETE')
};

interface RequestOptions {
  method: string;
  headers: Record<string, string>;
  body?: string;
}

function request(method: string) {
  return (url: string, body?: object) => {
    const requestOptions: RequestOptions = {
      method,
      headers: authHeader(url)
    };
    if (body) {
      requestOptions.headers['Content-Type'] = 'application/json';
      requestOptions.body = JSON.stringify(body);
    }
    return fetch(url, requestOptions).then(handleResponse);
  };
}

// helper functions

function authHeader(url: string): Record<string, string> {
  // Return auth header with token if configured
  if (!authConfig) return {};

  const token = authConfig.getToken?.();
  const apiBaseUrl = authConfig.getApiBaseUrl?.();
  
  const isLoggedIn = !!token;
  const isApiUrl = apiBaseUrl ? url.startsWith(apiBaseUrl) : false;
  
  if (isLoggedIn && isApiUrl) {
    return { Authorization: `Bearer ${token}` };
  } else {
    return {};
  }
}

function handleResponse<T = any>(response: Response): Promise<T> {
  return response.text().then((text: string) => {
    const data = text && JSON.parse(text);

    if (!response.ok) {
      // Handle unauthorized/forbidden
      if ([401, 403].includes(response.status)) {
        authConfig?.onUnauthorized?.();
      }

      const error: string = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data as T;
  });
}

import { clearAuth, getToken } from './auth';

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';

type RequestOptions = {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
};

type AxiosLikeResponse<T> = {
  data: T;
};

const logError = (payload: { url: string; status?: number; data?: unknown; message?: string }) => {
  console.error('API request failed', payload);
};

const request = async <T>(path: string, options: RequestOptions): Promise<AxiosLikeResponse<T>> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${baseURL}${path}`, {
      method: options.method,
      headers,
      credentials: 'include',
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });

    const text = await response.text();
    let parsed: unknown = null;
    if (text) {
      try {
        parsed = JSON.parse(text);
      } catch (parseError) {
        logError({
          url: path,
          message: parseError instanceof Error ? parseError.message : 'Failed to parse response JSON',
          data: text,
        });
      }
    }

    if (!response.ok) {
      logError({ url: path, status: response.status, data: parsed });
      if (response.status === 401) {
        clearAuth();
      }
      const message =
        parsed && typeof parsed === 'object' && parsed !== null && 'message' in parsed
          ? String((parsed as { message?: string }).message)
          : response.statusText;
      throw new Error(message || 'Request failed');
    }

    return { data: parsed as T };
  } catch (error) {
    if (error instanceof Error) {
      logError({ url: path, message: error.message });
    } else {
      logError({ url: path, message: 'Unknown error' });
    }
    throw error;
  }
};

const axiosClient = {
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body }),
};

export default axiosClient;

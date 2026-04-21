const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

async function getErrorMessage(response: Response): Promise<string> {
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    try {
      const payload = (await response.json()) as {
        message?: string;
        error?: string;
      };

      if (payload.message) {
        return payload.message;
      }

      if (payload.error) {
        return payload.error;
      }
    } catch {
      // Fall through to the default error message.
    }
  } else {
    try {
      const text = await response.text();

      if (text.trim()) {
        return text;
      }
    } catch {
      // Fall through to the default error message.
    }
  }

  return `API Error: ${response.status} ${response.statusText}`.trim();
}

class ApiClient {
  private baseURL: string;
  private apiKey?: string;

  constructor(baseURL: string, apiKey?: string) {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
  }

  private getHeaders(customHeaders?: HeadersInit): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.apiKey) {
      headers['x-api-key'] = this.apiKey;
    }

    // Merge custom headers
    if (customHeaders) {
      if (customHeaders instanceof Headers) {
        customHeaders.forEach((value, key) => {
          headers[key] = value;
        });
      } else if (Array.isArray(customHeaders)) {
        customHeaders.forEach(([key, value]) => {
          headers[key] = value;
        });
      } else {
        Object.assign(headers, customHeaders);
      }
    }

    return headers;
  }

  private buildURL(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>,
  ): string {
    const hasAbsoluteBase = Boolean(this.baseURL);
    const url = hasAbsoluteBase
      ? new URL(`${this.baseURL}${endpoint}`)
      : new URL(endpoint, 'http://localhost');

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    if (!hasAbsoluteBase) {
      return `${url.pathname}${url.search}`;
    }

    return url.toString();
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const url = this.buildURL(endpoint, options?.params);
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(options?.headers),
      ...options,
    });

    if (!response.ok) {
      throw new Error(await getErrorMessage(response));
    }

    return response.json();
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    const url = this.buildURL(endpoint, options?.params);
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(options?.headers),
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    if (!response.ok) {
      throw new Error(await getErrorMessage(response));
    }

    return response.json();
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    const url = this.buildURL(endpoint, options?.params);
    const response = await fetch(url, {
      method: 'PUT',
      headers: this.getHeaders(options?.headers),
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    if (!response.ok) {
      throw new Error(await getErrorMessage(response));
    }

    return response.json();
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const url = this.buildURL(endpoint, options?.params);
    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.getHeaders(options?.headers),
      ...options,
    });

    if (!response.ok) {
      throw new Error(await getErrorMessage(response));
    }

    return response.json();
  }
}

export const backendClient = new ApiClient(BACKEND_URL, API_KEY);
export const externalApiClient = new ApiClient(API_URL, API_KEY);
export const localApiClient = new ApiClient('', API_KEY);
export const apiClient = backendClient;

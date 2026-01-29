import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public requestId?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

let accessToken: string | null = null;
const tokenListeners = new Set<(token: string | null) => void>();

export const getAccessToken = () => accessToken;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
  tokenListeners.forEach((listener) => listener(token));
};

export const subscribeToAccessToken = (listener: (token: string | null) => void) => {
  tokenListeners.add(listener);
  return () => tokenListeners.delete(listener);
};

export type AuthRequestConfig<D = unknown> = InternalAxiosRequestConfig<D> & {
  skipAuth?: boolean;
  _retry?: boolean;
};

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

let refreshPromise: Promise<string | null> | null = null;

const extractErrorMessage = (error: AxiosError): string => {
  const data = error.response?.data as { error?: { message?: string } } | undefined;
  return data?.error?.message || error.message || "Request failed";
};

const extractErrorCode = (error: AxiosError): string => {
  const data = error.response?.data as { error?: { code?: string } } | undefined;
  return data?.error?.code || `HTTP_${error.response?.status || 0}`;
};

const extractRequestId = (error: AxiosError): string | undefined => {
  const data = error.response?.data as { error?: { requestId?: string } } | undefined;
  return data?.error?.requestId;
};

const performRefresh = async (): Promise<string | null> => {
  try {
    const res = await api.post("/refresh", {}, { skipAuth: true } as AuthRequestConfig);
    const newToken = (res.data as { data?: { accessToken?: string } })?.data?.accessToken;
    setAccessToken(newToken ?? null);
    return newToken ?? null;
  } catch (err) {
    setAccessToken(null);
    throw err;
  }
};

api.interceptors.request.use((config) => {
  const authConfig = config as AuthRequestConfig;
  if (!authConfig.skipAuth && accessToken) {
    const headers = authConfig.headers instanceof AxiosHeaders
      ? authConfig.headers
      : new AxiosHeaders(authConfig.headers || {});
    headers.set("Authorization", `Bearer ${accessToken}`);
    authConfig.headers = headers;
  }
  return authConfig;
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const { response, config } = error;
    const originalRequest = config as AuthRequestConfig;

    if (!response || !originalRequest) {
      return Promise.reject(error);
    }

    const status = response.status;
    const isRefreshRequest = originalRequest.url?.includes("/refresh");

    if (status === 401 && !originalRequest._retry && !originalRequest.skipAuth && !isRefreshRequest) {
      originalRequest._retry = true;

      if (!refreshPromise) {
        refreshPromise = performRefresh().finally(() => {
          refreshPromise = null;
        });
      }

      try {
        const newToken = await refreshPromise;
        if (newToken) {
          const headers = originalRequest.headers instanceof AxiosHeaders
            ? originalRequest.headers
            : new AxiosHeaders(originalRequest.headers || {});
          headers.set("Authorization", `Bearer ${newToken}`);
          originalRequest.headers = headers;
          return api(originalRequest);
        }
      } catch (refreshErr) {
        return Promise.reject(refreshErr);
      }
    }

    const message = extractErrorMessage(error);
    const code = extractErrorCode(error);
    const requestId = extractRequestId(error);

    return Promise.reject(new ApiError(status, code, message, requestId));
  }
);

export { api };

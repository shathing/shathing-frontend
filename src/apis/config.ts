import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const GET_NEW_ACCESS_TOKEN_API_PATH = "/auth/refresh"
const AUTH_REDIRECT_PATH = "/auth";
const EXCLUDED_GLOBAL_ERROR_STATUSES = [400, 404];

const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export const s3Client = axios.create()

const isBrowser = () => typeof window !== "undefined";

const isRefreshRequest = (request: RetryableRequestConfig | undefined) =>
  request?.url?.includes(GET_NEW_ACCESS_TOKEN_API_PATH) ?? false;

const shouldRetryWithRefresh = (error: AxiosError, request: RetryableRequestConfig | undefined) =>
  error.response?.status === 401 && !isRefreshRequest(request) && !request?._retry;

const handleRefreshFailure = (refreshError: unknown) => {
  if (isBrowser()) {
    window.location.href = AUTH_REDIRECT_PATH;
  }
  return Promise.reject(refreshError);
};

httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (!shouldRetryWithRefresh(error, originalRequest)) {
      showToastWhenGlobalHandledStatusCode(error);
      return Promise.reject(error);
    }

    if (!originalRequest) {
      return Promise.reject(error);
    }

    try {
      originalRequest._retry = true;
      await httpClient.post(GET_NEW_ACCESS_TOKEN_API_PATH);
      return httpClient(originalRequest);
    } catch (refreshError) {
      return handleRefreshFailure(refreshError);
    }
  },
);

const showToastWhenGlobalHandledStatusCode = (error: AxiosError) => {
  if (!isGlobalHandledStatusCode(error)) return
  if (error.response?.status == 401) return
  const errorMessage = parseAxiosErrorMessage(error);
  if (isBrowser()) {
    toast.error(errorMessage)
  } else {
    console.error(errorMessage)
  }
};

type ApiErrorResponse = {
  message?: string | { message?: string };
};

export const parseAxiosErrorMessage = (error: AxiosError) => {
  const response = error.response?.data as ApiErrorResponse | undefined;
  const nestedMessage = typeof response?.message === "object" ? response.message.message : undefined;
  const message = typeof response?.message === "string" ? response.message : nestedMessage;
  return message || "A temporary error has occurred.";
};

// Backward compatibility for previous misspelled export name.
export const parseAsioxErrorMessage = parseAxiosErrorMessage;

export const isGlobalHandledStatusCode = (error: AxiosError) =>
  !EXCLUDED_GLOBAL_ERROR_STATUSES.includes(error.response?.status ?? -1);

export default httpClient;

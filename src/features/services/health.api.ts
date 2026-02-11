import { AxiosResponse } from "axios";
import { api, AuthRequestConfig } from "@/shared/api/axios";

type ApiResponse<T> = {
  ok: boolean;
  data?: T;
  error?: { code?: string; message?: string; requestId?: string };
};

const unwrap = async <T>(promise: Promise<AxiosResponse<ApiResponse<T>>>): Promise<ApiResponse<T>> => {
  const res = await promise;
  return res.data;
};

const health = () => unwrap<{ status: string }>(api.get("/health", { skipAuth: true } as AuthRequestConfig));

export const healthApi = {
  health,
};

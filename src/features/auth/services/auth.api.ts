import { AxiosResponse } from "axios";
import { api, AuthRequestConfig } from "@/shared/api/axios";

export type AuthUser = {
  id?: string;
  email: string;
  first_name?: string;
  last_name?: string;
  mobile?: string;
  status?: string;
  [key: string]: unknown;
};

export type RegisterPayload = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  mobile?: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

type ApiResponse<T> = {
  ok: boolean;
  data?: T;
  error?: { code?: string; message?: string; requestId?: string };
};

type UserResponse = ApiResponse<{ user: AuthUser } | AuthUser>;

type CustomerResponse = ApiResponse<{ customer: AuthUser } | AuthUser>;

const unwrap = async <T>(promise: Promise<AxiosResponse<ApiResponse<T>>>): Promise<ApiResponse<T>> => {
  const res = await promise;
  return res.data;
};

const register = (payload: RegisterPayload) => unwrap<{
  accessToken: string;
}>(api.post("/register", payload, { skipAuth: true } as AuthRequestConfig));

const login = (payload: LoginPayload) => unwrap<{
  accessToken: string;
}>(api.post("/login", payload, { skipAuth: true } as AuthRequestConfig));

const refresh = () => unwrap<{
  accessToken: string;
}>(api.post("/refresh", {}, { skipAuth: true } as AuthRequestConfig));

const logout = () => unwrap(api.post("/logout", {}));

const me = () => unwrap<UserResponse>(api.get("/me"));

const customerMe = () => unwrap<CustomerResponse>(api.get("/customers/me"));

export const authApi = {
  register,
  login,
  refresh,
  logout,
  me,
  customerMe,
};

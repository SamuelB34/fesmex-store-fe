import { AxiosResponse } from "axios";
import { api } from "@/shared/api/axios";

export type CustomerStatus = "active" | "inactive" | "banned";

export type Customer = {
  _id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  mobile?: string;
  status?: CustomerStatus;
};

export type UpdateCustomerPayload = {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  mobile?: string;
  status?: CustomerStatus;
};

type ApiResponse<T> = {
  ok: boolean;
  data?: T;
  error?: { code?: string; message?: string; requestId?: string };
};

const unwrap = async <T>(promise: Promise<AxiosResponse<ApiResponse<T>>>): Promise<ApiResponse<T>> => {
  const res = await promise;
  return res.data;
};

const getMe = () => unwrap<{ customer: Customer | null }>(api.get("/customers/me"));

const updateMe = (payload: UpdateCustomerPayload) => unwrap<{ customer: Customer | null }>(api.patch("/customers/me", payload));

const deleteMe = () => unwrap(api.delete("/customers/me"));

export const customersApi = {
  getMe,
  updateMe,
  deleteMe,
};

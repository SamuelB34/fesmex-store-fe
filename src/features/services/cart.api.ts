import { AxiosResponse } from "axios";
import { api } from "@/shared/api/axios";

type ApiResponse<T> = {
  ok: boolean;
  data?: T;
  error?: { code?: string; message?: string; requestId?: string };
};

export type CartItem = {
  article_id: string;
  name?: string;
  quantity: number;
  unit_price: number;
  total: number;
};

export type Cart = {
  _id: string;
  customer_id: string;
  items: CartItem[];
  subtotal: number;
  created_at?: string;
  updated_at?: string;
};

export type CartItemPayload = {
  article_id: string;
  quantity: number;
  unit_price?: number;
};

export type CartUpdatePayload = {
  article_id: string;
  quantity: number;
};

const unwrap = async <T>(promise: Promise<AxiosResponse<ApiResponse<T>>>): Promise<ApiResponse<T>> => {
  const res = await promise;
  return res.data;
};

const createOrGetCart = () => unwrap<{ cart: Cart }>(api.post("/cart", {}));

const getCart = () => unwrap<{ cart: Cart }>(api.get("/cart"));

const addItem = (payload: CartItemPayload) => unwrap<{ cart: Cart }>(api.post("/cart/items", payload));

const updateItem = (payload: CartUpdatePayload) => unwrap<{ cart: Cart }>(api.patch("/cart/items", payload));

const deleteItem = (articleId: string) => unwrap<{ cart: Cart }>(api.delete(`/cart/items/${articleId}`));

export const cartApi = {
  createOrGetCart,
  getCart,
  addItem,
  updateItem,
  deleteItem,
};

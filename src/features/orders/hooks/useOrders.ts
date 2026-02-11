"use client";

import { useState, useCallback } from "react";
import {
  ordersApi,
  Order,
  CreateOrderPayload,
  ListOrdersQuery,
  ShippingFeePayload,
  ApiRequestError,
} from "@/features/orders/services/orders.api";

type UseOrdersListState = {
  items: Order[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
};

export function useOrdersList() {
  const [state, setState] = useState<UseOrdersListState>({
    items: [],
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    isLoading: false,
    error: null,
  });

  const fetchOrders = useCallback(async (query?: ListOrdersQuery) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const data = await ordersApi.listOrders(query);
      setState({
        items: data.items,
        page: data.page,
        limit: data.limit,
        total: data.total,
        totalPages: data.totalPages,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const message = err instanceof ApiRequestError ? err.message : "Failed to load orders";
      setState((prev) => ({ ...prev, isLoading: false, error: message }));
    }
  }, []);

  return { ...state, fetchOrders };
}

type UseOrderDetailState = {
  order: Order | null;
  isLoading: boolean;
  error: string | null;
};

export function useOrderDetail() {
  const [state, setState] = useState<UseOrderDetailState>({
    order: null,
    isLoading: false,
    error: null,
  });

  const fetchOrder = useCallback(async (id: string) => {
    setState({ order: null, isLoading: true, error: null });
    try {
      const data = await ordersApi.getOrderById(id);
      setState({ order: data.order, isLoading: false, error: null });
    } catch (err) {
      const message = err instanceof ApiRequestError ? err.message : "Failed to load order";
      setState({ order: null, isLoading: false, error: message });
    }
  }, []);

  const updateShippingFee = useCallback(async (id: string, payload: ShippingFeePayload) => {
    setState((prev) => ({ ...prev, error: null }));
    try {
      const data = await ordersApi.updateShipping(id, payload);
      setState((prev) => ({ ...prev, order: data.order }));
    } catch (err) {
      const message = err instanceof ApiRequestError ? err.message : "Failed to update shipping fee";
      setState((prev) => ({ ...prev, error: message }));
    }
  }, []);

  return { ...state, fetchOrder, updateShippingFee };
}

type UseCreateOrderState = {
  isSubmitting: boolean;
  error: string | null;
};

export function useCreateOrder() {
  const [state, setState] = useState<UseCreateOrderState>({
    isSubmitting: false,
    error: null,
  });

  const createOrder = useCallback(async (payload: CreateOrderPayload): Promise<Order | null> => {
    setState({ isSubmitting: true, error: null });
    try {
      const data = await ordersApi.createOrder(payload);
      setState({ isSubmitting: false, error: null });
      return data.order;
    } catch (err) {
      const message = err instanceof ApiRequestError ? err.message : "Failed to create order";
      setState({ isSubmitting: false, error: message });
      return null;
    }
  }, []);

  return { ...state, createOrder };
}

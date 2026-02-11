"use client";

import { useState, useCallback } from "react";
import { articlesApi, ArticleListItem, ArticlesListResponse, ListArticlesQuery } from "@/features/services/articles.api";
import { ApiError } from "@/shared/api/axios";

type UseArticlesState = {
  items: ArticleListItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
};

export function useArticles() {
  const [state, setState] = useState<UseArticlesState>({
    items: [],
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    isLoading: false,
    error: null,
  });

  const fetchArticles = useCallback(async (query?: ListArticlesQuery) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const res = await articlesApi.list(query);
      if (res.ok && res.data) {
        const data: ArticlesListResponse = res.data;
        setState({
          items: data.items,
          page: data.page,
          limit: data.limit,
          total: data.total,
          totalPages: data.totalPages,
          isLoading: false,
          error: null,
        });
      } else {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: res.error?.message ?? "Failed to load articles",
        }));
      }
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Failed to load articles";
      setState((prev) => ({ ...prev, isLoading: false, error: message }));
    }
  }, []);

  return { ...state, fetchArticles };
}

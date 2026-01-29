"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { apiFetch, setToken, clearToken } from "@/lib/http";

type Customer = Record<string, unknown>;

type AuthContextValue = {
  user: Customer | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshMe: () => Promise<void>;
};

type LoginCredentials = {
  email: string;
  password: string;
};

type LoginResponse = {
  ok: true;
  token: string;
  customer: Customer;
};

type MeResponse = {
  ok: true;
  customer: Customer | null;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshMe = useCallback(async () => {
    try {
      const data = await apiFetch<MeResponse>("/auth/me");
      setUser(data.customer);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      await refreshMe();
      setIsLoading(false);
    };

    initAuth();
  }, [refreshMe]);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const data = await apiFetch<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
        skipAuth: true,
      });

      setToken(data.token);
      setUser(data.customer);

      await refreshMe();

      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const next = params.get("next") || "/";
        window.location.href = next;
      }
    },
    [refreshMe]
  );

  const logout = useCallback(() => {
    clearToken();
    setUser(null);

    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }, []);

  const value: AuthContextValue = {
    user,
    isLoading,
    login,
    logout,
    refreshMe,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

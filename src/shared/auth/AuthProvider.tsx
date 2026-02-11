"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { setAccessToken, subscribeToAccessToken, ApiError } from "@/shared/api/axios";
import { authApi, AuthUser } from "@/features/services/auth.api";

type AuthContextValue = {
  accessToken: string | null;
  user: AuthUser | null;
  isBootstrapping: boolean;
  register: (payload: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    mobile?: string;
  }) => Promise<void>;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
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
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = subscribeToAccessToken((token) => {
      setAccessTokenState(token);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const fetchMe = useCallback(async () => {
    try {
      const res = await authApi.me();
      if (res.ok && res.data) {
        const userData = ("user" in res.data ? res.data.user : res.data) as AuthUser;
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      setIsBootstrapping(true);
      try {
        const res = await authApi.refresh();
        if (res.ok && res.data?.accessToken) {
          setAccessToken(res.data.accessToken);
          await fetchMe();
        }
      } catch {
        setAccessToken(null);
      } finally {
        setIsBootstrapping(false);
      }
    };

    bootstrap();
  }, [fetchMe]);

  const register = useCallback(
    async (payload: {
      email: string;
      password: string;
      first_name: string;
      last_name: string;
      mobile?: string;
    }) => {
      const normalizedPayload = {
        ...payload,
        email: payload.email.trim().toLowerCase(),
      };

      const res = await authApi.register(normalizedPayload);
      if (res.ok && res.data?.accessToken) {
        setAccessToken(res.data.accessToken);
      } else {
        throw new Error(res.error?.message || "Registration failed");
      }
    },
    []
  );

  const login = useCallback(
    async (credentials: { email: string; password: string }) => {
      const normalizedCredentials = {
        email: credentials.email.trim().toLowerCase(),
        password: credentials.password,
      };

      try {
        const res = await authApi.login(normalizedCredentials);
        if (res.ok && res.data?.accessToken) {
          setAccessToken(res.data.accessToken);
          await fetchMe();
          router.push("/account");
        } else {
          throw new Error(res.error?.message || "Login failed");
        }
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          throw new Error("Invalid email or password");
        }
        throw err;
      }
    },
    [fetchMe, router]
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore logout errors
    } finally {
      setAccessToken(null);
      setUser(null);
      router.push("/login");
    }
  }, [router]);

  const value: AuthContextValue = {
    accessToken,
    user,
    isBootstrapping,
    register,
    login,
    logout,
    fetchMe,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

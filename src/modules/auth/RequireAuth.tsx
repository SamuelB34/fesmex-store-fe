"use client";

import { useEffect } from "react";
import { useAuth } from "./AuthProvider";

type RequireAuthProps = {
  children: React.ReactNode;
};

export function RequireAuth({ children }: RequireAuthProps) {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      const currentPath = window.location.pathname + window.location.search;
      const loginUrl = `/login?next=${encodeURIComponent(currentPath)}`;
      window.location.href = loginUrl;
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "100vh" 
      }}>
        <p>Cargando...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}

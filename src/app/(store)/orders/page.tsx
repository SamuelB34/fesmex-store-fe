"use client";

import { RequireAuth } from "@/modules/auth/RequireAuth";
import { useAuth } from "@/modules/auth/AuthProvider";

export default function OrdersPage() {
  const { user, logout } = useAuth();

  return (
    <RequireAuth>
      <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: "2rem",
          borderBottom: "1px solid #ddd",
          paddingBottom: "1rem"
        }}>
          <h1>Mis Pedidos</h1>
          <button
            onClick={logout}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Cerrar Sesión
          </button>
        </div>

        <div style={{
          backgroundColor: "#f8f9fa",
          padding: "1.5rem",
          borderRadius: "8px",
          marginBottom: "2rem"
        }}>
          <p style={{ color: "#666" }}>
            Usuario: <strong>{(user as Record<string, unknown>)?.email as string || "N/A"}</strong>
          </p>
        </div>

        <div style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "8px",
          border: "1px solid #ddd"
        }}>
          <h2 style={{ marginBottom: "1rem" }}>Historial de Pedidos</h2>
          <p style={{ color: "#666" }}>
            Aquí se mostrarían los pedidos del usuario autenticado.
          </p>
        </div>
      </div>
    </RequireAuth>
  );
}

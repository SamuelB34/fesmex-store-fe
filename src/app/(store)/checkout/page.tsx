"use client";

import { RequireAuth } from "@/modules/auth/RequireAuth";
import { useAuth } from "@/modules/auth/AuthProvider";

export default function CheckoutPage() {
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
          <h1>Checkout</h1>
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
          <h2 style={{ marginBottom: "1rem" }}>Usuario Autenticado</h2>
          <pre style={{
            backgroundColor: "white",
            padding: "1rem",
            borderRadius: "4px",
            overflow: "auto",
            fontSize: "0.875rem"
          }}>
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>

        <div style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "8px",
          border: "1px solid #ddd"
        }}>
          <h2 style={{ marginBottom: "1rem" }}>Proceso de Checkout</h2>
          <p style={{ color: "#666", marginBottom: "1.5rem" }}>
            Esta es una página protegida. Solo usuarios autenticados pueden acceder.
          </p>

          <div style={{ marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "1.125rem", marginBottom: "0.5rem" }}>Resumen del Pedido</h3>
            <p style={{ color: "#666" }}>Aquí iría el contenido del carrito y el proceso de pago.</p>
          </div>

          <button
            style={{
              padding: "0.75rem 2rem",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "1rem",
              fontWeight: 500,
              cursor: "pointer"
            }}
          >
            Proceder al Pago
          </button>
        </div>
      </div>
    </RequireAuth>
  );
}

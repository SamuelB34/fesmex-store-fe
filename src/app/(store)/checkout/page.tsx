"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RequireAuth } from "@/shared/auth/RequireAuth";
import { useCreateOrder } from "@/features/orders/hooks/useOrders";
import { PaymentMethod, ShippingAddress } from "@/features/orders/services/orders.api";

const inputStyle: React.CSSProperties = {
  padding: "0.625rem 0.75rem",
  border: "1px solid #ddd",
  borderRadius: "4px",
  fontSize: "0.9375rem",
  width: "100%",
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.875rem",
  fontWeight: 500,
  color: "#555",
  marginBottom: "0.25rem",
  display: "block",
};

const fieldStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.25rem",
};

function CheckoutForm() {
  const router = useRouter();
  const { isSubmitting, error, createOrder } = useCreateOrder();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("MX");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CARD");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const shippingAddress: ShippingAddress = {
      full_name: fullName,
      phone,
      line1,
      line2: line2 || undefined,
      city,
      state,
      postal_code: postalCode,
      country: country || undefined,
    };

    const order = await createOrder({
      payment_method: paymentMethod,
      notes: notes || undefined,
      shipping_address: shippingAddress,
    });

    if (order) {
      router.push(`/orders/${order._id}`);
    }
  };

  return (
    <div>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 0", borderBottom: "1px solid #ddd", marginBottom: "1.5rem" }}>
        <Link href="/" style={{ fontSize: "1.25rem", fontWeight: 700, color: "#007bff" }}>FESMEX Store</Link>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <Link href="/">Articles</Link>
          <Link href="/cart">Cart</Link>
          <Link href="/orders">Orders</Link>
        </div>
      </nav>

      <h1 style={{ fontSize: "1.75rem", fontWeight: 600, marginBottom: "1.5rem", color: "#333" }}>Checkout</h1>

      {error && (
        <div style={{ padding: "0.75rem", marginBottom: "1rem", backgroundColor: "#fee", color: "#c33", borderRadius: "4px", fontSize: "0.875rem" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
          <h2 style={{ gridColumn: "1 / -1", fontSize: "1.25rem", fontWeight: 600, color: "#333" }}>Shipping Address</h2>

          <div style={fieldStyle}>
            <label style={labelStyle}>Full Name *</label>
            <input style={inputStyle} value={fullName} onChange={(e) => setFullName(e.target.value)} required disabled={isSubmitting} />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Phone *</label>
            <input style={inputStyle} value={phone} onChange={(e) => setPhone(e.target.value)} required disabled={isSubmitting} />
          </div>

          <div style={{ ...fieldStyle, gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Address Line 1 *</label>
            <input style={inputStyle} value={line1} onChange={(e) => setLine1(e.target.value)} required disabled={isSubmitting} />
          </div>

          <div style={{ ...fieldStyle, gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Address Line 2</label>
            <input style={inputStyle} value={line2} onChange={(e) => setLine2(e.target.value)} disabled={isSubmitting} />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>City *</label>
            <input style={inputStyle} value={city} onChange={(e) => setCity(e.target.value)} required disabled={isSubmitting} />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>State *</label>
            <input style={inputStyle} value={state} onChange={(e) => setState(e.target.value)} required disabled={isSubmitting} />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Postal Code *</label>
            <input style={inputStyle} value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required disabled={isSubmitting} />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Country</label>
            <input style={inputStyle} value={country} onChange={(e) => setCountry(e.target.value)} disabled={isSubmitting} />
          </div>
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#333", marginBottom: "0.75rem" }}>Payment</h2>

          <div style={fieldStyle}>
            <label style={labelStyle}>Payment Method *</label>
            <select
              style={inputStyle}
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              disabled={isSubmitting}
            >
              <option value="CARD">Card</option>
              <option value="TRANSFER">Transfer</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Notes (optional)</label>
            <textarea
              style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: "0.75rem 2rem",
            backgroundColor: isSubmitting ? "#6c757d" : "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "1rem",
            fontWeight: 500,
            cursor: isSubmitting ? "not-allowed" : "pointer",
            width: "100%",
          }}
        >
          {isSubmitting ? "Placing Order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <RequireAuth>
      <div style={{ padding: "1rem 2rem", maxWidth: "800px", margin: "0 auto" }}>
        <CheckoutForm />
      </div>
    </RequireAuth>
  );
}

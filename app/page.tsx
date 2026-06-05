"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div
      className="min-h-screen d-flex align-items-center justify-content-center"
      style={{
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #312e81 100%)",
      }}
    >
      <div
        className="text-center p-5 rounded-4"
        style={{
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(15px)",
          width: "500px",
          border: "1px solid rgba(255,255,255,0.15)",
          boxShadow: "0 15px 35px rgba(0,0,0,0.3)",
        }}
      >
        <h1
          className="fw-bold mb-3"
          style={{
            color: "#fff",
            fontSize: "3rem",
          }}
        >
          NexCart
        </h1>

        <p className="mb-4" style={{ color: "#cbd5e1", fontSize: "18px" }}>
          Modern E-Commerce Management Platform
        </p>

        <p className="mb-5" style={{ color: "#94a3b8" }}>
          Manage Products, Inventory, Orders, and Customers with a modern Next.js dashboard.
        </p>

        <div className="d-flex justify-content-center gap-3">
          <Link href="/auth/login">
            <button
              className="btn btn-primary px-4 py-2"
              style={{ borderRadius: "12px" }}
            >
              Login
            </button>
          </Link>

          <Link href="/auth/register">
            <button
              className="btn btn-outline-light px-4 py-2"
              style={{ borderRadius: "12px" }}
            >
              Register
            </button>
          </Link>
        </div>

        <div className="mt-4">
          <small style={{ color: "#94a3b8" }}>
            Click Login or Register to continue
          </small>
        </div>
      </div>
    </div>
  );
}
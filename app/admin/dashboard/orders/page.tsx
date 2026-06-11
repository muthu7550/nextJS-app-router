"use client";

import { useEffect, useState } from "react";
import {
  Package,
  Trash2,
  MapPin,
  CreditCard,
  ReceiptText,
  IndianRupee,
} from "lucide-react";
import { getDecryptedItem } from "../../../auth/encript";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const user = getDecryptedItem("user");

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      setLoading(true);

      const response = await fetch("/api/orders", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch orders");
      }

      const filteredOrders = result.data.filter((order: any) =>
        order.products?.some((item: any) => item.userId === user?.id)
      );

      setOrders(filteredOrders);
    } catch (error) {
      console.error("Fetch orders error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteOrder(orderId: string) {
    const confirmDelete = confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch("/api/orders", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: orderId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Delete failed");
      }

      setOrders((prev) => prev.filter((order) => order._id !== orderId));

      alert("Order deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Something went wrong");
    }
  }

  const OrdersSkeleton = () => {
    return (
      <div className="grid gap-5">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="overflow-hidden rounded-2xl border bg-white shadow-sm"
          >
            <div className="flex flex-col gap-4 border-b bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <div className="h-5 w-48 animate-pulse rounded bg-slate-200" />
                <div className="h-3 w-32 animate-pulse rounded bg-slate-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm border">
          <h1 className="text-3xl font-bold text-slate-900">Orders</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage customer orders, payment UTR, delivery address and products.
          </p>
        </div>

        {loading ? (
          <OrdersSkeleton />
        ) : orders.length === 0 ? (
          <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
            <Package className="mx-auto h-10 w-10 text-yellow-600" />
            <h2 className="mt-4 text-xl font-bold text-slate-900">
              No orders found
            </h2>
          </div>
        ) : (
          <div className="grid gap-5">
            {orders.map((order) => {
              const createdDate = order.createdAt
                ? new Date(order.createdAt).toLocaleString()
                : "N/A";

              return (
                <div
                  key={order._id}
                  className="overflow-hidden rounded-2xl border bg-white shadow-sm"
                >
                  <div className="flex flex-col gap-4 border-b bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <ReceiptText className="h-5 w-5 text-slate-700" />
                        <h2 className="font-bold text-slate-900">
                          Order #{order._id}
                        </h2>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        Created: {createdDate}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
                        {order.orderStatus || "Processing"}
                      </span>

                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                        {order.payment?.status || "Payment Pending"}
                      </span>

                      <button
                        onClick={() => handleDeleteOrder(order._id)}
                        className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-4 p-4 lg:grid-cols-3">
                    <div className="rounded-xl border bg-white p-4">
                      <div className="mb-3 flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-green-700" />
                        <h3 className="font-bold text-slate-900">
                          Payment Details
                        </h3>
                      </div>

                      <InfoRow label="Method" value={order.payment?.method} />
                      <InfoRow label="UPI ID" value={order.payment?.upiId} />
                      <InfoRow label="Phone" value={order.payment?.phone} />
                      <InfoRow label="UTR" value={order.payment?.utrNumber} />

                      <div className="mt-4 rounded-xl bg-green-50 p-3">
                        <p className="text-xs font-semibold text-green-700">
                          Total Amount
                        </p>
                        <div className="mt-1 flex items-center text-2xl font-bold text-green-800">
                          <IndianRupee className="h-5 w-5" />
                          {Number(order.totalAmount || 0).toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border bg-white p-4">
                      <div className="mb-3 flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-blue-700" />
                        <h3 className="font-bold text-slate-900">
                          Delivery Address
                        </h3>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                        <p className="font-semibold">
                          {order.address?.street || "No street"}
                        </p>
                        <p className="mt-1">{order.address?.city || "No city"}</p>
                        <p className="mt-1">
                          Pincode: {order.address?.pincode || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-xl border bg-white p-4">
                      <div className="mb-3 flex items-center gap-2">
                        <Package className="h-5 w-5 text-purple-700" />
                        <h3 className="font-bold text-slate-900">Products</h3>
                      </div>

                      <div className="space-y-3">
                        {order.products?.map((item: any) => {
                          const itemTotal =
                            Number(item.price || 0) *
                            Number(item.quantity || 1);

                          return (
                            <div
                              key={item.productId}
                              className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3"
                            >
                              <div className="flex items-center gap-3">
                                <img
                                  src={item.image || "/placeholder.png"}
                                  alt={item.name || "Product"}
                                  className="h-12 w-12 rounded-lg border bg-white object-cover"
                                />

                                <div>
                                  <p className="line-clamp-1 text-sm font-bold text-slate-900">
                                    {item.name}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    ₹{item.price} × {item.quantity}
                                  </p>
                                </div>
                              </div>

                              <p className="text-sm font-bold text-slate-900">
                                ₹{itemTotal}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

function InfoRow({ label, value }: any) {
  return (
    <div className="mb-2 flex items-start justify-between gap-4 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-semibold text-slate-900">
        {value || "N/A"}
      </span>
    </div>
  );
}
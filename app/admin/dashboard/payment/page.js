"use client";

import { useRouter } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useState } from "react";
import { useCounterStore } from "../../../stores/useCounterStore.ts";
import { getDecryptedItem } from "../../../auth/encript.js";

export default function PaymentPage() {
  const router = useRouter();

  const storeItems = useCounterStore((state) => state.items);
  const clearCart = useCounterStore((state) => state.clearCart);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [utrNumber, setUtrNumber] = useState("");
  const [utrError, setUtrError] = useState("");
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const upiId = "6382429837@pthdfc";
  const payeeName = "Marimuthu S";
  const phone = "6382429837";
  const user = getDecryptedItem("user");

  const goToOrders = () => {
    router.push("/admin/dashboard/orders");
  };

  useEffect(() => {
    if (!showPendingModal) return;

    if (countdown === 0) {
      goToOrders();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [showPendingModal, countdown]);

  useEffect(() => {
    if (storeItems?.length > 0) {
      setItems(storeItems);
      return;
    }

    try {
      const storage = JSON.parse(localStorage.getItem("counter-storage"));
      const localItems = storage?.state?.items || [];
      setItems(localItems);
    } catch {
      setItems([]);
    }
  }, [storeItems]);

  const totalAmount = items.reduce((acc, item) => {
    const price = Number(item?.price) || 0;
    const qty = Number(item?.itemCount) || 1;
    return acc + price * qty;
  }, 0);

  const upiUrl = `upi://pay?pa=${encodeURIComponent(
    upiId,
  )}&pn=${encodeURIComponent(payeeName)}&am=${encodeURIComponent(
    Number(totalAmount).toFixed(2),
  )}&cu=INR`;

  const handleUtrChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setUtrNumber(value);

    if (!value) setUtrError("");
    else if (!/^\d{12}$/.test(value)) setUtrError("UTR must be 12 digits");
    else setUtrError("");
  };

  async function handlePaymentDone() {
    try {
      if (!/^\d{12}$/.test(utrNumber)) {
        alert("Please enter a valid 12-digit UTR number");
        return;
      }

      const storedAddress = localStorage.getItem("deliveryAddress");

      if (!storedAddress) {
        alert("Address missing. Please go back to cart.");
        return;
      }

      const address = JSON.parse(storedAddress);

      if (!address.street || !address.city || !address.pincode) {
        alert("Address is incomplete. Please go back to cart.");
        return;
      }

      setLoading(true);

      const orderDetails = {
        products: items.map((item) => ({
          productId: item._id,
          name: item.name,
          price: Number(item.price),
          quantity: Number(item.itemCount || 1),
          image: item.image,
          userId: user?.id,
        })),

        payment: {
          method: "UPI",
          upiId,
          phone,
          status: "Processing",
          utrNumber: utrNumber.trim(),
        },

        address: {
          street: address.street,
          city: address.city,
          pincode: address.pincode,
        },

        totalAmount,
        orderStatus: "Processing",
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderDetails),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Order failed");
      }

      clearCart();
      localStorage.removeItem("deliveryAddress");
      localStorage.removeItem("counter-storage");

      setShowPendingModal(true);
      setCountdown(5);
    } catch (error) {
      console.error("Order error:", error);
      alert(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0 && !showPendingModal) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-xl">
          <h1 className="mb-3 text-xl font-black text-slate-800">
            No cart items found
          </h1>

          <button
            onClick={() => router.push("/admin/dashboard/products")}
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white"
          >
            Go to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-100 px-4 py-8">
        <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-2xl text-white">
              ₹
            </div>

            <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
              NexCart Secure Payment
            </p>

            <h1 className="mt-2 text-4xl font-black text-slate-950">
              ₹{Number(totalAmount).toFixed(2)}
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Scan QR or pay using any UPI app
            </p>
          </div>

          <div className="mt-6 flex justify-center">
            <div className="rounded-[2rem] bg-slate-950 p-4 shadow-xl">
              <div className="rounded-3xl bg-white p-4">
                <QRCodeCanvas value={upiUrl} size={180} />
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-center">
            <p className="text-xs font-bold uppercase text-slate-400">UPI ID</p>
            <p className="mt-1 text-base font-black text-slate-900">{upiId}</p>
            <p className="mt-2 break-all text-[11px] text-slate-400">
              {upiUrl}
            </p>
          </div>

          <div className="mt-5">
            <input
              type="text"
              value={utrNumber}
              onChange={handleUtrChange}
              maxLength={12}
              placeholder="Enter 12-digit UTR number"
              className={`w-full rounded-2xl border-2 px-4 py-3 text-sm font-semibold outline-none transition ${
                utrError
                  ? "border-red-500 bg-red-50"
                  : utrNumber.length === 12
                    ? "border-green-500 bg-green-50"
                    : "border-slate-200 bg-white focus:border-slate-900"
              }`}
            />

            {utrError && (
              <p className="mt-2 text-xs font-bold text-red-500">{utrError}</p>
            )}

            {!utrError && utrNumber.length === 12 && (
              <p className="mt-2 text-xs font-bold text-green-600">
                ✓ Valid UTR format
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handlePaymentDone}
            disabled={
              loading || !utrNumber || utrNumber.length !== 12 || !!utrError
            }
            className="mt-5 w-full rounded-2xl bg-slate-950 py-3.5 text-sm font-black text-white shadow-lg transition hover:scale-[1.01] hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {loading ? "Processing..." : "Payment Done"}
          </button>
        </div>
      </div>

      {showPendingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm overflow-hidden rounded-[2rem] bg-white p-6 text-center shadow-2xl">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-400 border-t-transparent" />
            </div>

            <h2 className="mt-5 text-2xl font-black text-slate-950">
              Payment Pending
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Your order has been placed successfully. Payment verification is
              under process and may take up to{" "}
              <span className="font-black text-slate-900">2 hours</span>.
            </p>

            <div className="mt-5 rounded-2xl bg-slate-100 px-4 py-3">
              <p className="text-xs font-bold uppercase text-slate-400">
                Redirecting to orders in
              </p>
              <p className="mt-1 text-3xl font-black text-slate-950">
                {countdown}s
              </p>
            </div>

            <button
              onClick={goToOrders}
              className="mt-5 w-full rounded-2xl py-3 text-sm font-black shadow-lg hover:bg-amber-100"
            >
              Go to Orders
            </button>
          </div>
        </div>
      )}
    </>
  );
}
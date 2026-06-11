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

  const upiId = "6382429837@pthdfc";
  const payeeName = "Marimuthu S";
  const phone = "6382429837";
  const user = getDecryptedItem("user");

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

  const openUpiApp = () => {
    if (!totalAmount || totalAmount <= 0) {
      alert("Invalid amount");
      return;
    }

    window.location.href = upiUrl;
  };

  const handleUtrChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");

    setUtrNumber(value);

    if (!value) {
      setUtrError("");
    } else if (!/^\d{12}$/.test(value)) {
      setUtrError("UTR must be 12 digits");
    } else {
      setUtrError("");
    }
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

      alert("Order placed successfully");
      router.push("/admin/dashboard/orders");
    } catch (error) {
      console.error("Order error:", error);
      alert(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-lg">
          <h1 className="mb-3 text-xl font-bold text-gray-800">
            No cart items found
          </h1>

          <button
            onClick={() => router.push("/admin/dashboard/products")}
            className="rounded-lg bg-black px-5 py-2 text-white"
          >
            Go to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-4 py-6">
      <div className="w-full max-w-sm rounded-[2rem] bg-white p-5 shadow-2xl">
        <div className="text-center">
          <p className="text-sm font-semibold text-purple-600">
            NexCart Payment
          </p>

          <h1 className="mt-1 text-3xl font-black text-gray-900">
            ₹{Number(totalAmount).toFixed(2)}
          </h1>

          <p className="mt-1 text-xs text-gray-500">
            Pay securely using any UPI app
          </p>
        </div>

        <div className="mt-5 flex justify-center">
          <div className="rounded-3xl bg-gradient-to-br from-yellow-300 to-orange-400 p-3 shadow-lg">
            <div className="rounded-2xl bg-white p-3">
              <QRCodeCanvas value={upiUrl} size={155} />
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          {[
            { name: "GPay", emoji: "🟢" },
            { name: "PhonePe", emoji: "🟣" },
            { name: "Paytm", emoji: "🔵" },
            { name: "BHIM", emoji: "🇮🇳" },
            { name: "Amazon", emoji: "🛒" },
            { name: "Any UPI", emoji: "💳" },
          ].map((app) => (
            <button
              key={app.name}
              type="button"
              onClick={openUpiApp}
              className="rounded-2xl border bg-gradient-to-br from-gray-50 to-gray-100 px-2 py-3 text-center shadow-sm transition hover:scale-105 active:scale-95"
            >
              <div className="text-xl">{app.emoji}</div>
              <div className="mt-1 text-xs font-bold text-gray-800">
                {app.name}
              </div>
            </button>
          ))}
        </div>

        <div className="mt-5 rounded-2xl bg-purple-50 p-3 text-center">
          <p className="text-xs text-purple-500">UPI ID</p>
          <p className="text-sm font-bold text-gray-900">{upiId}</p>

          <p className="mt-2 break-all text-[10px] text-gray-400">{upiUrl}</p>
        </div>

        <div className="mt-4">
          <input
            type="text"
            value={utrNumber}
            onChange={handleUtrChange}
            maxLength={12}
            placeholder="Enter 12-digit UTR number"
            className={`w-full rounded-2xl border-2 px-4 py-3 text-sm outline-none transition ${
              utrError
                ? "border-red-500"
                : utrNumber.length === 12
                  ? "border-green-500"
                  : "border-gray-200 focus:border-purple-500"
            }`}
          />

          {utrError && (
            <p className="mt-1 text-xs font-semibold text-red-500">
              {utrError}
            </p>
          )}

          {!utrError && utrNumber.length === 12 && (
            <p className="mt-1 text-xs font-semibold text-green-600">
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
          className="mt-4 w-full rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 py-3 text-sm font-black text-white shadow-lg hover:opacity-90 disabled:cursor-not-allowed disabled:from-gray-300 disabled:to-gray-300"
        >
          {loading ? "Processing..." : "Payment Done"}
        </button>
      </div>
    </div>
  );
}
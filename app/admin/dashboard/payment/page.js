"use client";

import { useRouter } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import { useState } from "react";
import { useCounterStore } from "../../../stores/useCounterStore.ts";

export default function PaymentPage() {
  const router = useRouter();

  const items = useCounterStore((state) => state.items);

  const [loading, setLoading] = useState(false);
  const [utrNumber, setUtrNumber] = useState("");

  const upiId = "6382429837@ybl";
  const phone = "6382429837";

  const totalAmount = items.reduce((acc, item) => {
    const price = Number(item?.price) || 0;
    const qty = Number(item?.itemCount) || 1;
    return acc + price * qty;
  }, 0);

  async function handlePaymentDone() {
    try {
      if (!utrNumber.trim()) {
        alert("Please enter UTR number");
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

      localStorage.removeItem("deliveryAddress");

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
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
          <h1 className="text-xl font-bold text-gray-800 mb-3">
            No cart items found
          </h1>

          <button
            onClick={() => router.push("/admin/dashboard/products")}
            className="bg-black text-white px-5 py-2 rounded-lg"
          >
            Go to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8 flex justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4 text-gray-800 text-center">
          Payment Page
        </h1>

        <p className="text-gray-600 mb-4 text-center">
          Scan QR code and pay exact amount
        </p>

        <div className="flex justify-center mb-5">
          <QRCodeCanvas
            value={`upi://pay?pa=${upiId}&pn=NexCart&am=${totalAmount}&cu=INR`}
            size={220}
          />
        </div>

        <div className="bg-gray-100 rounded-lg p-4 mb-5">
          <p className="text-sm text-gray-500">UPI ID</p>
          <h2 className="text-lg font-semibold text-gray-800">{upiId}</h2>

          <p className="text-sm text-gray-500 mt-3">Phone Number</p>
          <h2 className="text-lg font-semibold text-gray-800">{phone}</h2>

          <p className="text-sm text-gray-500 mt-3">Total Amount</p>
          <h2 className="text-xl font-bold text-green-700">₹{totalAmount}</h2>
        </div>

        <div className="mb-5">
          <h2 className="text-lg font-bold text-gray-800 mb-3">
            Order Items
          </h2>

          <div className="space-y-3">
            {items.map((item) => {
              const price = Number(item?.price) || 0;
              const qty = Number(item?.itemCount) || 1;
              const subtotal = price * qty;

              return (
                <div
                  key={item._id}
                  className="flex items-center justify-between border rounded-lg p-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image || "/placeholder.png"}
                      alt={item.name || "Product"}
                      className="w-14 h-14 object-cover rounded"
                    />

                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {item.name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        ₹{price} × {qty}
                      </p>
                    </div>
                  </div>

                  <h3 className="font-bold text-gray-900">₹{subtotal}</h3>
                </div>
              );
            })}
          </div>
        </div>

        <input
          type="text"
          value={utrNumber}
          onChange={(e) => setUtrNumber(e.target.value)}
          placeholder="Enter UTR number after payment"
          className="w-full border rounded-lg px-4 py-3 mb-4 outline-none"
        />

        <button
          onClick={handlePaymentDone}
          disabled={loading || !utrNumber.trim()}
          className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Payment Done"}
        </button>
      </div>
    </div>
  );
}
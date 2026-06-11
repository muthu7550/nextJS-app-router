"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCounterStore } from "../../../stores/useCounterStore";
import {
  ShoppingBag,
  ArrowRight,
  ChevronLeft,
  Lock,
  Trash2,
} from "lucide-react";

export default function OrderSummary() {
  const router = useRouter();

  const items = useCounterStore((state) => state.items);
  const addItem = useCounterStore((state) => state.addItem);
  const removeItem = useCounterStore((state) => state.removeItem);

  const [hydrated, setHydrated] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [loadingItemId, setLoadingItemId] = useState(null);

  const [address, setAddress] = useState({
    street: "",
    city: "",
    pincode: "",
  });

  useEffect(() => {
    setHydrated(true);
  }, []);

  const cartItems = items.filter((item) => Number(item?.itemCount) > 0);

  const grandTotal = cartItems.reduce((acc, item) => {
    const price = Number(item?.price) || 0;
    const qty = Number(item?.itemCount) || 1;
    return acc + price * qty;
  }, 0);

  const totalItems = cartItems.reduce((acc, item) => {
    return acc + (Number(item?.itemCount) || 1);
  }, 0);

  const goHome = () => {
    router.push("/admin/dashboard/products");
  };

  const handlePaymentPage = () => {
    setShowAddressModal(true);
  };

  const handleAddressSubmit = () => {
    if (
      !address.street.trim() ||
      !address.city.trim() ||
      !address.pincode.trim()
    ) {
      return;
    }

    localStorage.setItem("deliveryAddress", JSON.stringify(address));
    router.push("/admin/dashboard/payment");
  };

  const updateProductCount = async (product, newCount) => {
    try {
      if (!product?._id) return;
      if (newCount < 0) return;

      setLoadingItemId(product._id);

      const formData = new FormData();

      formData.append("name", product.name || "");
      formData.append("description", product.description || "");
      formData.append("price", product.price || 0);
      formData.append("itemCount", newCount);

      formData.append("existingImage", product.image || "");

      if (product.image instanceof File || product.image instanceof Blob) {
        formData.append("image", product.image);
      }

      const response = await fetch(`/api/${product._id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const updatedProduct = data.data;

      if (newCount <= 0) {
        removeItem(updatedProduct?._id || product._id);
      } else {
        addItem(updatedProduct);
      }
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setLoadingItemId(null);
    }
  };

  const handleIncrease = (item) => {
    const currentCount = Number(item?.itemCount) || 0;
    updateProductCount(item, currentCount + 1);
  };

  const handleDecrease = (item) => {
    const currentCount = Number(item?.itemCount) || 1;
    updateProductCount(item, currentCount - 1);
  };

  const handleQuantityChange = (item, value) => {
    const qty = Number(value);
    updateProductCount(item, qty);
  };

  const handleRemove = (item) => {
    updateProductCount(item, 0);
  };

  if (!hydrated) {
    return <CartSkeleton />;
  }

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-[#f3f4f6] px-3 py-4">
        <section className="mx-auto max-w-xl rounded-lg border bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-yellow-50">
            <ShoppingBag className="h-10 w-10 text-yellow-600" />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            Your cart is empty
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Add products to continue checkout.
          </p>

          <button
            onClick={goHome}
            className="mt-6 rounded-lg bg-[#ffd814] px-7 py-2.5 text-sm font-bold text-gray-900 hover:bg-[#f7ca00]"
          >
            Continue Shopping
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f3f4f6] px-3 py-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 flex items-center justify-between rounded-lg border bg-white px-4 py-3">
          <button
            onClick={goHome}
            className="flex items-center gap-1 text-sm font-semibold text-blue-700 hover:text-orange-600"
          >
            <ChevronLeft className="h-4 w-4" />
            Continue Shopping
          </button>

          <p className="flex items-center gap-1 text-sm font-semibold text-green-700">
            <Lock className="h-4 w-4" />
            Secure Checkout
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_330px]">
          <section className="rounded-lg border bg-white">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h1 className="text-xl font-bold text-gray-900">Shopping Cart</h1>

              <span className="text-sm text-gray-500">
                {totalItems} item{totalItems > 1 ? "s" : ""}
              </span>
            </div>

            <div className="divide-y">
              {cartItems.map((item, index) => {
                const price = Number(item?.price) || 0;
                const quantity = Number(item?.itemCount) || 1;
                const total = price * quantity;
                const isLoading = loadingItemId === item?._id;

                return (
                  <div
                    key={item?._id || index}
                    className="grid gap-3 px-4 py-3 md:grid-cols-[90px_1fr_125px]"
                  >
                    <div className="flex h-24 w-24 items-center justify-center rounded-md border bg-gray-50 p-2">
                      <img
                        src={item?.image || "/placeholder.png"}
                        alt={item?.name || "Product"}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    <div className="min-w-0">
                      <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-gray-900">
                        {item?.name || "Product Name"}
                      </h3>

                      <p className="mt-1 line-clamp-1 text-xs text-gray-500">
                        {item?.description || "No description available"}
                      </p>

                      <p className="mt-1 text-xs font-semibold text-green-700">
                        In stock
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <select
                          value={quantity}
                          disabled={isLoading}
                          onChange={(e) =>
                            handleQuantityChange(item, e.target.value)
                          }
                          className="rounded-md border bg-white px-2 py-1 text-xs font-semibold outline-none"
                        >
                          {Array.from({ length: 10 }).map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                              Qty: {i + 1}
                            </option>
                          ))}
                        </select>

                        <button
                          disabled={isLoading}
                          onClick={() => handleDecrease(item)}
                          className="rounded-md border px-2 py-1 text-xs font-bold hover:bg-gray-100 disabled:opacity-50"
                        >
                          −
                        </button>

                        <button
                          disabled={isLoading}
                          onClick={() => handleIncrease(item)}
                          className="rounded-md border px-2 py-1 text-xs font-bold hover:bg-gray-100 disabled:opacity-50"
                        >
                          +
                        </button>

                        <button
                          disabled={isLoading}
                          onClick={() => handleRemove(item)}
                          className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline disabled:opacity-50"
                        >
                          <Trash2 className="h-3 w-3" />
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="text-left md:text-right">
                      <p className="text-xs text-gray-500">Price</p>
                      <p className="text-base font-bold text-gray-900">
                        ₹{price.toFixed(2)}
                      </p>

                      <p className="mt-2 text-xs text-gray-500">Subtotal</p>
                      <p className="text-lg font-bold text-gray-900">
                        ₹{total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <aside className="h-fit rounded-lg border bg-white p-4 lg:sticky lg:top-4">
            <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>

            <div className="mt-4 space-y-3 text-sm">
              <SummaryRow
                label={`Items Total (${totalItems})`}
                value={`₹${grandTotal.toFixed(2)}`}
              />
              <SummaryRow label="Delivery" value="FREE" green />
              <SummaryRow label="Tax" value="₹0.00" />
            </div>

            <div className="my-4 border-t" />

            <div className="flex items-start justify-between gap-8">
              <span className="text-base font-bold text-gray-900">
                Order Total
              </span>

              <span className="text-right text-xl font-bold text-gray-900">
                ₹{grandTotal.toFixed(2)}
              </span>
            </div>

            <button
              onClick={handlePaymentPage}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#ffd814] px-4 py-2.5 text-sm font-bold text-gray-900 hover:bg-[#f7ca00]"
            >
              Proceed to Buy
              <ArrowRight className="h-4 w-4" />
            </button>

            <p className="mt-3 text-center text-xs text-gray-500">
              Safe and secure payment
            </p>
          </aside>
        </div>
      </div>

   {showAddressModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
    <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-lg">
      <h2 className="text-xl font-bold text-gray-900">
        Enter Delivery Address
      </h2>

      <input
        type="text"
        value={address.street}
        onChange={(e) =>
          setAddress({ ...address, street: e.target.value })
        }
        placeholder="Street address"
        className={`mt-4 w-full rounded-lg border px-3 py-2 text-sm outline-none ${
          !address.street.trim() ? "border-red-500" : "border-gray-300"
        }`}
      />

      <input
        type="text"
        value={address.city}
        onChange={(e) =>
          setAddress({ ...address, city: e.target.value })
        }
        placeholder="City"
        className={`mt-3 w-full rounded-lg border px-3 py-2 text-sm outline-none ${
          !address.city.trim() ? "border-red-500" : "border-gray-300"
        }`}
      />

      <input
        type="number"
        value={address.pincode}
        onChange={(e) =>
          setAddress({ ...address, pincode: e.target.value })
        }
        placeholder="Pincode"
        className={`mt-3 w-full rounded-lg border px-3 py-2 text-sm outline-none ${
          !address.pincode.trim() ? "border-red-500" : "border-gray-300"
        }`}
      />

      <div className="mt-4 flex justify-between gap-3">
        <button
          onClick={() => setShowAddressModal(false)}
          className="rounded-lg border px-4 py-2 text-sm font-semibold"
        >
          Cancel
        </button>

        <button
          onClick={handleAddressSubmit}
          className="rounded-lg bg-[#ffd814] px-4 py-2 text-sm font-bold text-gray-900 hover:bg-[#f7ca00] disabled:bg-gray-300 disabled:cursor-not-allowed"
          disabled={
            !address.street.trim() ||
            !address.city.trim() ||
            !address.pincode.trim()
          }
        >
          Continue to Payment
        </button>
      </div>
    </div>
  </div>
)}
    </main>
  );
}

function SummaryRow({ label, value, green }) {
  return (
    <div className="flex items-start justify-between gap-8">
      <span className="text-gray-600">{label}</span>
      <span
        className={`text-right font-semibold ${
          green ? "text-green-700" : "text-gray-900"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function CartSkeleton() {
  return (
    <main className="min-h-screen bg-[#f3f4f6] px-3 py-4">
      <div className="mx-auto max-w-6xl animate-pulse">
        <div className="mb-4 h-12 rounded-lg bg-gray-200" />
      </div>
    </main>
  );
}

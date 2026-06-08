"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CPlaceholder } from "@coreui/react";
import { useCounterStore } from "../../../../stores/useCounterStore.ts";

export default function DetailsPage() {
  const params = useParams();
  const { id } = params;

  const pathname = usePathname();

  const addItem = useCounterStore((state) => state.addItem);
  const removeItem = useCounterStore((state) => state.removeItem);

  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);

  // ---------------- FETCH PRODUCT ----------------
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const res = await fetch(`/api/${id}`, {
          cache: "no-store",
        });

        const data = await res.json();

        setProductDetails(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  // ---------------- INCREASE COUNT ----------------
  const handleCountIncrease = async (product) => {
    try {
      setBtnLoading(true);

      const newCount = (product?.itemCount || 0) + 1;

      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("price", product.price);
      formData.append("itemCount", newCount);
      formData.append("existingImage", product.image);

      const res = await fetch(`/api/${product._id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to update");

      const data = await res.json();

      addItem(data.data);
      setProductDetails(data.data); // instant UI update
    } catch (error) {
      console.error("Increase error:", error);
    } finally {
      setBtnLoading(false);
    }
  };

  // ---------------- DECREASE COUNT ----------------
  const handleCountDecrease = async (product) => {
    try {
      setBtnLoading(true);

      const newCount = Math.max((product?.itemCount || 0) - 1, 0);

      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("price", product.price);
      formData.append("itemCount", newCount);
      formData.append("existingImage", product.image);

      const res = await fetch(`/api/${product._id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to update");

      const data = await res.json();

      removeItem(data.data._id);
      setProductDetails(data.data); // instant UI update
    } catch (error) {
      console.error("Decrease error:", error);
    } finally {
      setBtnLoading(false);
    }
  };

  // ---------------- LOADING UI ----------------
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="h-[350px] bg-gray-200 animate-pulse rounded-xl" />

          <div className="flex flex-col gap-3">
            <CPlaceholder xs={8} />
            <CPlaceholder xs={12} />
            <CPlaceholder xs={6} />
            <CPlaceholder xs={4} />
          </div>
        </div>
      </div>
    );
  }

  // ---------------- MAIN UI ----------------
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* HEADER */}
        <div className="p-6 border-b flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">
            Product Details
          </h1>

          <Link
            href="/admin/dashboard/"
            className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 transition px-4 py-2 rounded-lg"
          >
            Back
          </Link>
        </div>

        {/* CONTENT */}
        <div className="grid md:grid-cols-2 gap-8 p-6">

          {/* IMAGE */}
          <div className="bg-gray-50 rounded-xl p-4 flex justify-center">
            <img
              src={productDetails?.image}
              alt={productDetails?.name}
              className="w-full max-h-[400px] object-contain rounded-lg"
            />
          </div>

          {/* INFO */}
          <div className="flex flex-col justify-center">

            <h2 className="text-4xl font-bold mb-4">
              {productDetails?.name}
            </h2>

            <p className="text-gray-600 mb-6">
              {productDetails?.description}
            </p>

            <div className="text-3xl font-semibold text-green-600 mb-6">
              ${productDetails?.price}
            </div>

            {/* CART BUTTONS */}
            {pathname !== "/admin/dashboard/products" && (
              <>
                {/* ADD FIRST TIME */}
                {productDetails?.itemCount === 0 && (
                  <button
                    className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 py-2 text-white font-bold"
                    onClick={() =>
                      handleCountIncrease(productDetails)
                    }
                    disabled={btnLoading}
                  >
                    {btnLoading ? "Loading..." : "Add to Cart"}
                  </button>
                )}

                {/* COUNTER BUTTON */}
                {productDetails?.itemCount > 0 && (
                  <div className="flex items-center w-full justify-center gap-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 py-2 text-white font-bold">

                    {/* MINUS */}
                    <button
                      onClick={() =>
                        handleCountDecrease(productDetails)
                      }
                      disabled={btnLoading}
                      className="px-3"
                    >
                      -
                    </button>

                    {/* COUNT */}
                    <span className="text-lg select-none">
                      {productDetails?.itemCount}
                    </span>

                    {/* PLUS */}
                    <button
                      onClick={() =>
                        handleCountIncrease(productDetails)
                      }
                      disabled={btnLoading}
                      className="px-3"
                    >
                      +
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
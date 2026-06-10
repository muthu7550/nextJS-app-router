"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCounterStore } from "../../stores/useCounterStore.ts";
import { usePathname } from "next/navigation";

export function ProductCard({
  product,
  fetchProducts,
  setShow,
  setEditProduct,
  seIsEdit,
  addItem,
  removeItem,
  setLoading: layoutLoading,
  user: userAccess = "Admin",
  pageNumber,
  limit,
  filteredProducts,
}) {
  const router = useRouter();
  const [tilt, setTilt] = React.useState({ x: 0, y: 0 });
  const [cartCount, setCartCount] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const items = useCounterStore((state) => state.items);
  const threshold = 12;
  const [user, setUser] = useState({});
  const imageURL =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdJKDO44DuYRj3cC-KtQ7_T1vr2pmC6HSmlA&s";

  const pathname = usePathname();


  const handleMove = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();

    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;

    setTilt({
      x: y * -threshold,
      y: x * threshold,
    });
  };

  const handleEdit = () => {
    setEditProduct(product);
    setShow(true);
    seIsEdit("edit");
  };

  const handleDelete = async () => {
    layoutLoading(true);
    try {
      await fetch(`/api/${product._id}`, {
        method: "DELETE",
      });
      await fetchProducts(
        filteredProducts.length === 1 ? pageNumber - 1 : pageNumber,
        limit,
      );
      router.replace(
        `/admin/dashboard?page=${filteredProducts.length === 1 ? pageNumber - 1 : pageNumber}&limit=${limit}`,
      );

      layoutLoading(false);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleViewDetails = () => {
    router.push(
      `/admin/dashboard/products/${product._id}?page=${pageNumber}&limit=${limit}`,
    );
  };

  const handleCountIncrease = (product) => {
    const newCount = (product.itemCount || 0) + 1;
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("price", product.price);
    formData.append("itemCount", newCount);

    // IMPORTANT
    formData.append("existingImage", product.image);

    // Append new image only if user selected one
    if (product.image instanceof File || product.image instanceof Blob) {
      formData.append("image", product.image);
    }

    fetch(`/api/${product._id}`, {
      method: "PUT",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(async (data) => {

        addItem(data.data);

        await fetchProducts(pageNumber, limit);
      })
      .catch((error) => console.error("Error updating product:", error));
  };

  const handleCountDecrease = (product) => {
    const newCount = (product.itemCount || 0) - 1;

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("price", product.price);
    formData.append("itemCount", newCount);

    // IMPORTANT
    formData.append("existingImage", product.image);

    // Append new image only if user selected one
    if (product.image instanceof File || product.image instanceof Blob) {
      formData.append("image", product.image);
    }

    fetch(`/api/${product._id}`, {
      method: "PUT",
      // IMPORTANT: Do NOT add 'Content-Type' header for FormData
      body: formData,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then(async (data) => {
        let res = removeItem(data.data._id);
        await fetchProducts(pageNumber, limit);
      })
      .catch((error) => console.error("Error updating product:", error));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      localStorage.clear();
      router.push("/auth/login");
      return;
    }

    // 3. Allow access if token is verified present
    // setUser(JSON.parse(storedUser));
    setLoading(false);
  }, [router]);

  return (
    <div
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{
        transform: `perspective(1400px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      }}
      className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-[#0f172a]/80 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition-all duration-500 hover:-translate-y-3"
    >
      {/* Glow Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-transparent to-fuchsia-500/20 opacity-0 blur-2xl transition duration-700 group-hover:opacity-100"></div>

      {/* Animated Border */}
      <div className="absolute inset-0 rounded-[32px] border border-white/10"></div>

      {/* Image Section */}
      <div className="relative overflow-hidden">
        <img
          src={product?.image ?? imageURL}
          alt={imageURL}
          className="h-72 w-full object-cover transition duration-700 group-hover:scale-110"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

        {/* Floating Price */}
        <div className="absolute left-5 top-5 rounded-2xl border border-cyan-400/40 bg-black/40 px-5 py-2 text-xl font-bold text-cyan-300 backdrop-blur-xl shadow-lg">
          ${product.price}
        </div>

        {pathname === "/admin/dashboard" && (
          <div className="absolute right-5 top-5 flex gap-3">
            <button
              onClick={handleEdit}
              className="flex h-12 w-12 items-center rounded-2 justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-lg transition-all duration-300 hover:scale-110 hover:bg-cyan-500"
            >
              ✏️
            </button>

            <button
              onClick={handleDelete}
              className="flex h-12 w-12 items-center rounded-2 justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-lg transition-all duration-300 hover:scale-110 hover:bg-red-500"
            >
              🗑️
            </button>
          </div>
        )}

        {/* Bottom Info Overlay */}
        <div className="absolute bottom-0 left-0 w-full p-5">
          <h2 className="line-clamp-1 text-4xl font-extrabold tracking-wide text-white">
            {product.name}
          </h2>

          <p className="mt-1 text-sm text-gray-300">
            Luxury Collection • Limited Edition
          </p>
        </div>
      </div>

      <div className="relative z-10 space-y-5 px-4 pt-3 pb-5">
        <p className="line-clamp-3 text-sm leading-7 text-gray-300 text-xl font-bold">
          {product.description}
        </p>

        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-lg text-white text-xs">
          <div className="text-white">
            <p className="text-xs uppercase tracking-widest text-gray-400">
              Rating
            </p>
            <h4 className="fs-6 font-bold text-yellow-400">⭐ 4.9</h4>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400">
              Stock
            </p>
            <h4 className="fs-6 font-bold text-green-400">Available</h4>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400">
              Delivery
            </p>
            <h4 className="fs-6 font-bold text-cyan-300">2 Days</h4>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleViewDetails}
            className="flex w-full rounded-2xl border justify-center border-white/10 bg-white/5 py-2 text-sm font-semibold rounded-2 text-white backdrop-blur-lg transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-500/20"
          >
            View Details
          </button>
          {pathname === "/admin/dashboard/products" && (
            <>
              {product.itemCount == 0 && (
                <button
                  className="flex w-full rounded-2xl bg-gradient-to-r justify-center from-cyan-500 to-blue-600 py-2 rounded text-sm font-bold text-white shadow-lg shadow-cyan-500/30 transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/50"
                  onClick={() => handleCountIncrease(product)}
                >
                  {!loading ? (
                    <span>Add to Cart</span>
                  ) : (
                    <div class="spinner-border" role="status">
                      <span class="sr-only">Loading...</span>
                    </div>
                  )}
                </button>
              )}

              {product.itemCount > 0 && (
                <button className="flex items-center w-full justify-center gap-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-sm font-bold text-white shadow-lg shadow-cyan-500/30 transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/50">
                  {loading ? (
                    <div class="spinner-border" role="status">
                      <span class="sr-only">Loading...</span>
                    </div>
                  ) : (
                    <>
                      <span
                        className="cursor-pointer p-1 hover:bg-white/20 rounded-full transition-colors"
                        onClick={() => handleCountDecrease(product)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-dash-lg"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fillRule="evenodd"
                            d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8"
                          />
                        </svg>
                      </span>

                      <h5 className="text-base select-none">
                        {product.itemCount}
                      </h5>

                      <span
                        className="cursor-pointer p-1 hover:bg-white/20 rounded-full transition-colors"
                        onClick={() => handleCountIncrease(product)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-plus-lg"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"
                          />
                        </svg>
                      </span>
                    </>
                  )}
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Shine Effect */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-700 group-hover:opacity-100">
        <div className="absolute -left-40 top-0 h-full w-24 rotate-12 bg-white/10 blur-2xl"></div>
      </div>
    </div>
  );
}

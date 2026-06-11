"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export function ProductCard({
  product,
  fetchProducts,
  setShow,
  setEditProduct,
  seIsEdit,
  addItem,
  removeItem,
  setLoading: layoutLoading,
  pageNumber,
  limit,
  filteredProducts = [],
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const threshold = 12;

  const imageURL =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdJKDO44DuYRj3cC-KtQ7_T1vr2pmC6HSmlA&s";

  const readCounterStorage = () => {
    if (typeof window === "undefined") return { state: { items: [] } };

    try {
      const data = JSON.parse(localStorage.getItem("counter-storage"));

      if (!data) {
        return { state: { items: [] } };
      }

      if (Array.isArray(data)) {
        return { state: { items: data } };
      }

      if (data.state && Array.isArray(data.state.items)) {
        return data;
      }

      return { state: { items: [] } };
    } catch {
      return { state: { items: [] } };
    }
  };

  const saveCounterStorage = (items) => {
    const oldStorage = readCounterStorage();

    localStorage.setItem(
      "counter-storage",
      JSON.stringify({
        ...oldStorage,
        state: {
          ...oldStorage.state,
          items,
        },
        version: oldStorage.version ?? 0,
      }),
    );
  };

  const getProductCount = () => {
    const storage = readCounterStorage();
    const item = storage.state.items.find((item) => item._id === product._id);
    return item?.itemCount || 0;
  };

  const syncCartCount = () => {
    setCartCount(getProductCount());
  };

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

      const nextPage =
        filteredProducts.length === 1 ? pageNumber - 1 : pageNumber;

      await fetchProducts(nextPage, limit);

      router.replace(`/admin/dashboard?page=${nextPage}&limit=${limit}`);
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      layoutLoading(false);
    }
  };

  const handleViewDetails = () => {
    router.push(
      `/admin/dashboard/products/${product._id}?page=${pageNumber}&limit=${limit}`,
    );
  };

  const handleCountIncrease = () => {
    const storage = readCounterStorage();
    const items = storage.state.items;

    const existingIndex = items.findIndex((item) => item._id === product._id);

    let updatedItems;

    if (existingIndex !== -1) {
      updatedItems = items.map((item) =>
        item._id === product._id
          ? {
              ...item,
              itemCount: (item.itemCount || 0) + 1,
            }
          : item,
      );
    } else {
      updatedItems = [
        ...items,
        {
          ...product,
          itemCount: 1,
        },
      ];
    }

    saveCounterStorage(updatedItems);
    setCartCount((prev) => prev + 1);

    if (addItem) {
      addItem({
        ...product,
        itemCount: existingIndex !== -1 ? cartCount + 1 : 1,
      });
    }
  };

  const handleCountDecrease = () => {
    const storage = readCounterStorage();
    const items = storage.state.items;

    const existingItem = items.find((item) => item._id === product._id);

    if (!existingItem) {
      setCartCount(0);
      return;
    }

    let updatedItems;

    if ((existingItem.itemCount || 0) <= 1) {
      updatedItems = items.filter((item) => item._id !== product._id);
      setCartCount(0);
    } else {
      updatedItems = items.map((item) =>
        item._id === product._id
          ? {
              ...item,
              itemCount: item.itemCount - 1,
            }
          : item,
      );

      setCartCount(existingItem.itemCount - 1);
    }

    saveCounterStorage(updatedItems);

    if (removeItem) {
      removeItem(product._id);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      localStorage.clear();
      router.push("/auth/login");
      return;
    }

    setLoading(false);
  }, [router]);

  useEffect(() => {
    syncCartCount();
  }, [product?._id]);

  useEffect(() => {
    const handleStorageChange = () => {
      syncCartCount();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [product?._id]);

  return (
    <div
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{
        transform: `perspective(1400px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      }}
      className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-[#0f172a]/80 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition-all duration-500 hover:-translate-y-3"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-transparent to-fuchsia-500/20 opacity-0 blur-2xl transition duration-700 group-hover:opacity-100"></div>

      <div className="absolute inset-0 rounded-[32px] border border-white/10"></div>

      <div className="relative overflow-hidden">
        <img
          src={product?.image ?? imageURL}
          alt={product?.name || "Product"}
          className="h-72 w-full object-cover transition duration-700 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

        <div className="absolute left-5 top-5 rounded-2xl border border-cyan-400/40 bg-black/40 px-5 py-2 text-xl font-bold text-cyan-300 backdrop-blur-xl shadow-lg">
          ${product.price}
        </div>

        {pathname === "/admin/dashboard" && (
          <div className="absolute right-5 top-5 flex gap-3">
            <button
              onClick={handleEdit}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-lg transition-all duration-300 hover:scale-110 hover:bg-cyan-500"
            >
              ✏️
            </button>

            <button
              onClick={handleDelete}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-lg transition-all duration-300 hover:scale-110 hover:bg-red-500"
            >
              🗑️
            </button>
          </div>
        )}

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
        <p className="line-clamp-3 text-xl font-bold leading-7 text-gray-300">
          {product.description}
        </p>

        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3 text-xs text-white backdrop-blur-lg">
          <div>
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

        <div className="flex gap-4">
          <button
            onClick={handleViewDetails}
            className="flex w-full justify-center rounded-2xl border border-white/10 bg-white/5 py-2 text-sm font-semibold text-white backdrop-blur-lg transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-500/20"
          >
            View Details
          </button>

          {pathname === "/admin/dashboard/products" && (
            <>
              {cartCount === 0 && (
                <button
                  onClick={handleCountIncrease}
                  className="flex w-full justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 py-2 text-sm font-bold text-white shadow-lg shadow-cyan-500/30 transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/50"
                >
                  Add to Cart
                </button>
              )}

              {cartCount > 0 && (
                <div className="flex w-full items-center justify-center gap-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 py-2 text-sm font-bold text-white shadow-lg shadow-cyan-500/30 transition-all duration-300">
                  <button
                    type="button"
                    onClick={handleCountDecrease}
                    className="cursor-pointer rounded-full px-3 py-1 transition-colors hover:bg-white/20"
                  >
                    -
                  </button>

                  <h5 className="select-none text-base">{cartCount}</h5>

                  <button
                    type="button"
                    onClick={handleCountIncrease}
                    className="cursor-pointer rounded-full px-3 py-1 transition-colors hover:bg-white/20"
                  >
                    +
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-700 group-hover:opacity-100">
        <div className="absolute -left-40 top-0 h-full w-24 rotate-12 bg-white/10 blur-2xl"></div>
      </div>
    </div>
  );
}
"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CreateProductModal from "../../components/createProductModal.js";
import { useCounterStore } from "../../stores/useCounterStore.ts";
import {
  CButton,
  CCard,
  CCardBody,
  CCardImage,
  CCardText,
  CCardTitle,
  CPlaceholder,
} from "@coreui/react";
import Button from "react-bootstrap/Button";
import { getDecryptedItem } from "../../auth/encript.js";
import { usePathname } from "next/navigation";
import FilterDrawer from "../../components/FilterDrawer.jsx";
import ProductPagination from "../../components/Pagination.jsx";
import { ProductCard } from "./ProductCard.jsx";

export default function Dashboard({pageNumber,limit}) {
  const user = getDecryptedItem("token") || "admin";

  console.log(user, "userr");

  const [products, setProducts] = React.useState([]);
  const [filteredProducts, setFilteredProducts] = React.useState([]);
  const [totalPage, setToalPage] = React.useState();
  const [loading, setLoading] = React.useState(true);
  const [show, setShow] = React.useState(false);
  const [filterDrawerShow, setFilterDrawerShow] = React.useState(false);

  const [isEdit, seIsEdit] = React.useState("");
  const [editProduct, setEditProduct] = React.useState(null);
  const addItem = useCounterStore((state) => state.addItem);
  const removeItem = useCounterStore((state) => state.removeItem);
  const pathname = usePathname();
  const items = useCounterStore((state) => state.items);
  const router = useRouter();
  const [page, setPage] = useState(1);


  const fetchProducts = async (pageNumber = 1, limit = 4) => {
    try {
      const response = await fetch(
        `/api/dashboard?page=${pageNumber}&limit=${limit}`,
        {
          cache: "no-store",
        },
      );

      const result = await response.json();
      setToalPage(Math.ceil(result.pagination.totalItems / 8));

      const userName = getDecryptedItem("user");

      const data = result.data.filter((item) => {
        return item.userId === userName.id;
      });

      setProducts(pathname === "/admin/dashboard" ? data : result.data);

      setFilteredProducts(pathname === "/admin/dashboard" ? data : result.data);

      // Optional: store pagination info
      // setTotalPages(result.pagination.totalPages);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      localStorage.clear();
      router.push("/auth/login");
      return;
    }
    fetchProducts(pageNumber, limit);
  }, [pageNumber, limit]);

  const handleShow = () => {
    setEditProduct(null);
    setShow(true);
    seIsEdit("create");
  };

  const handleClose = () => {
    setShow(false);
  };

  const handlecheckout = () => {
    router.push(`/admin/dashboard/ordersummary`);
  };

  function handleChange(event) {
    const searchInput = event.target.value.toLowerCase().trim();

    if (!searchInput) {
      setFilteredProducts(products);
      return;
    }

    const searchResult = products.filter((product) =>
      product.name.toLowerCase().includes(searchInput),
    );

    setFilteredProducts(searchResult);
  }

  //  throw new Error("Triggering global error boundary");

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <>
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-8 flex flex-col gap-4">
          {pathname === "/admin/dashboard" && (
            <div className="flex flex-col gap-5 rounded-[35px] border border-white/20 bg-white/60 p-4 shadow-2xl backdrop-blur-xl md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-gray-800">
                  Product Dashboard
                </h1>

                <p className="mt-2 text-gray-500">
                  Manage your products beautifully and efficiently.
                </p>
              </div>

              <Button
                variant="primary"
                onClick={handleShow}
                className="rounded-2xl border-0 bg-gradient-to-r from-blue-600 to-indigo-600 py-2 text-lg font-semibold shadow-lg"
              >
                + Add New Product
              </Button>
            </div>
          )}
          <div className="flex justify-end bg-white/70">
            {" "}
            <div className="flex items-center gap-3 p-4 rounded-3xl border border-white/30  shadow-lg backdrop-blur-md">
              {" "}
              {/* Search Input */}{" "}
              <div className="relative flex items-center rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
                {" "}
                <span className="mr-2 text-gray-400">🔍</span>{" "}
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-64 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none md:w-80"
                  onChange={(e) => handleChange(e)}
                />{" "}
              </div>{" "}
              {/* Filter Button */}{" "}
              <button
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 active:scale-[0.98]"
                onClick={() => setFilterDrawerShow(true)}
              >
                {" "}
                <span>⚙️</span> <span>Filter</span>{" "}
              </button>{" "}
            </div>{" "}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <CCard
                  key={index}
                  className="overflow-hidden rounded-[30px] border-0 shadow-xl"
                >
                  <CCardImage
                    as="svg"
                    orientation="top"
                    width="100%"
                    height="220"
                    xmlns="http://www.w3.org/2000/svg"
                    role="img"
                    aria-label="Placeholder"
                    preserveAspectRatio="xMidYMid slice"
                    focusable="false"
                  >
                    <rect width="100%" height="100%" fill="#dbeafe"></rect>
                  </CCardImage>

                  <CCardBody className="p-5">
                    <CPlaceholder as={CCardTitle} animation="glow" xs={8}>
                      <CPlaceholder xs={7} />
                    </CPlaceholder>

                    <CPlaceholder as={CCardText} animation="glow">
                      <CPlaceholder xs={10} />
                      <CPlaceholder xs={8} />
                      <CPlaceholder xs={6} />
                    </CPlaceholder>

                    <div className="mt-4 flex gap-3">
                      <CPlaceholder
                        as={CButton}
                        color="primary"
                        disabled
                        xs={5}
                      />

                      <CPlaceholder
                        as={CButton}
                        color="primary"
                        disabled
                        xs={5}
                      />
                    </div>
                  </CCardBody>
                </CCard>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  fetchProducts={fetchProducts}
                  setShow={setShow}
                  setEditProduct={setEditProduct}
                  seIsEdit={seIsEdit}
                  addItem={addItem}
                  removeItem={removeItem}
                  setLoading={setLoading}
                  user={user}
                  pageNumber={pageNumber}
                  limit={limit}
                />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-[35px] border border-dashed border-gray-300 bg-white/60 shadow-xl backdrop-blur-lg">
              <h2 className="mt-5 text-2xl font-bold text-gray-700">
                No Products Found
              </h2>

              <p className="mt-2 text-gray-500">
                Start by adding your first amazing product.
              </p>

              <button
                onClick={handleShow}
                className="mt-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-105"
              >
                Add Product
              </button>
            </div>
          )}
        </div>
        {/* <button type="button" class="text-heading bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none checkout-btn focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5">Checkout</button> */}

        {items.length > 0 && pathname === "/admin/dashboard/products" && (
          <button
            type="button"
            onClick={handlecheckout}
            class="group relative checkout-btn inline-flex items-center justify-center px-8 rounded-2 py-3.5 font-bold text-white transition-all duration-200 bg-gradient-to-r from-orange-500 to-red-600 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 hover:shadow-lg active:scale-95"
          >
            <svg
              class="w-5 h-5 mr-3 transition-transform duration-200 group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://w3.org"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              ></path>
            </svg>
            Checkout
          </button>
        )}
        <FilterDrawer
          show={filterDrawerShow}
          setFilterDrawerShow={setFilterDrawerShow}
          setFilteredProducts={setFilteredProducts}
          products={products}
        />
        <ProductPagination
          currentPage={page}
          totalPages={totalPage}
          onPageChange={setPage}
          limit={8}
          setLoading={setLoading}
        />
        <CreateProductModal
          show={show}
          handleClose={handleClose}
          fetchProducts={fetchProducts}
          editProduct={editProduct}
          setEditProduct={setEditProduct}
          isedit={isEdit}
          setLoading={setLoading}
          pageNumber={pageNumber}
          limit={limit}
        />
      </>
    </Suspense>
  );
}

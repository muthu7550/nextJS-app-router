'use client';

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CPlaceholder } from '@coreui/react';
import { useCounterStore } from '../../../../stores/useCounterStore.ts'


export default function DetailsPage() {
  const params = useParams();
  const { id } = params;

  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const addItem = useCounterStore((state) => state.addItem)
  const removeItem = useCounterStore((state) => state.removeItem)
  



  useEffect(() => {
    fetch(`http://localhost:3000/api/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setProductDetails(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching product details:', error);
        setLoading(false);
      });
  }, [id]);

  const handleCountIncrease = (product) => {
  const newCount = (product.itemCount || 0) + 1;
  
  const formData = new FormData();
  formData.append('name', product.name);
  formData.append('description', product.description);
  formData.append('price', product.price);
  formData.append('itemCount', newCount);

  // IMPORTANT
  formData.append('existingImage', product.image);

  // Append new image only if user selected one
  if (product.image instanceof File || product.image instanceof Blob) {
    formData.append('image', product.image);
  }

  fetch(`http://localhost:3000/api/${product._id}`, {
    method: 'PUT',
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then( async (data) => {
      console.log('Success:', data.data);

      addItem(data.data);

      await fetchProducts(product._id);
    })
    .catch((error) =>
      console.error('Error updating product:', error)
    );
};

    const handleCountDecrease = (product) => {
       const newCount = (product.itemCount || 0) - 1;
       
        const formData = new FormData();
        formData.append('name', product.name);
        formData.append('description', product.description);
        formData.append('price', product.price);
        formData.append('itemCount', newCount);


    // IMPORTANT
  formData.append('existingImage', product.image);

  // Append new image only if user selected one
  if (product.image instanceof File || product.image instanceof Blob) {
    formData.append('image', product.image);
  }



  fetch(`http://localhost:3000/api/${product._id}`, {
    method: 'PUT',
    // IMPORTANT: Do NOT add 'Content-Type' header for FormData
    body: formData 
  })
    .then((response) => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(async (data) => {
      console.log(data.data._id,"data.data._id")
      let res = removeItem(data.data._id)
      console.log(res)
      await fetchProducts(product._id); 
    })
    .catch((error) => console.error('Error updating product:', error));
    
    }

    const fetchProducts = async (id) => {
      console.log(id,"ijd")
    try {
      const response = await fetch(`http://localhost:3000/api/${id}`, {
        cache: "no-store",
      });

      const data = await response.json();
      console.log(data,'data')
      setProductDetails(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {!loading ? (
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
          
          {/* Header */}
          <div className="p-6 border-b flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800">
              Product Details
            </h1>

            <Link
              href="/admin/dashboard/"
              className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 transition px-4 py-2 rounded-lg text-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="currentColor"
                className="bi bi-arrow-left"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
                />
              </svg>

              Back
            </Link>
          </div>

          {/* Product Section */}
          <div className="grid md:grid-cols-2 gap-8 p-6">
            
            {/* Product Image */}
            <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-center">
              <img
                src={productDetails?.image}
                alt={productDetails?.name}
                className="w-full max-h-[400px] object-contain rounded-lg"
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {productDetails?.name}
              </h2>

              <p className="text-gray-600 leading-relaxed mb-6">
                {productDetails?.description}
              </p>

              <div className="text-3xl font-semibold text-green-600 mb-6">
                ${productDetails?.price}
              </div>

               { productDetails.itemCount == 0 && <button className="flex w-full rounded-2xl bg-gradient-to-r justify-center from-cyan-500 to-blue-600 py-2 rounded text-sm font-bold text-white shadow-lg shadow-cyan-500/30 transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/50" onClick={()=>handleCountIncrease(productDetails)} >
        {  !loading ? <span>Add to Cart</span> :

              <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span> 
      </div>}
      </button>
}


     {(productDetails.itemCount >0  ) && <button className="flex items-center w-full justify-center gap-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-sm font-bold text-white shadow-lg shadow-cyan-500/30 transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/50">
       { loading ?
             <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div> :
       <>
        <span className="cursor-pointer p-1 hover:bg-white/20 rounded-full transition-colors" onClick={()=>handleCountDecrease(productDetails)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-dash-lg" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8" />
          </svg>
        </span>

        <h5 className="text-base select-none">{productDetails.itemCount}</h5>

        <span className="cursor-pointer p-1 hover:bg-white/20 rounded-full transition-colors" onClick={()=> handleCountIncrease(productDetails)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
          </svg>
        </span>
        </>
}
      </button> 
      }
            </div>
          </div>
        </div>
      ) : (
        /* Loading Skeleton */
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6">
          <div className="grid md:grid-cols-2 gap-8">
            
            <div className="w-full h-[350px] bg-gray-200 rounded-xl animate-pulse" />

            <div className="flex flex-col gap-4">
              <CPlaceholder xs={8} />
              <CPlaceholder xs={12} />
              <CPlaceholder xs={10} />
              <CPlaceholder xs={4} />

              <div className="w-40 h-12 bg-gray-200 rounded-lg animate-pulse mt-4" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export const dynamic = 'force-dynamic';
'use client'

import { useState } from 'react'
import {
  CreditCard,
  ShieldCheck,
  Truck,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react'
import { useCounterStore } from '../../../stores/useCounterStore'

export default function PaymentPage() {
  const items = useCounterStore((state) => state.items)

  const [paymentMethod, setPaymentMethod] = useState('card')

  const grandTotal = items.reduce((acc, item) => {
    const price = parseFloat(item.price) || 0
    return acc + price * (item.itemCount || 1)
  }, 0)

  const totalItems = items.reduce(
    (acc, item) => acc + (item.itemCount || 1),
    0
  )

  function handleClick(){

  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-10">
      <div className="mx-auto max-w-7xl px-4">
        {/* HEADER */}
        <div className="mb-8 flex items-center justify-between">
          <button className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-medium text-gray-700 shadow-md transition hover:shadow-lg" onClick={handleClick}>
            <ArrowLeft className="h-5 w-5" />
            Back
          </button>

          <div className="flex items-center gap-2 rounded-2xl bg-green-100 px-5 py-3 text-green-700">
            <ShieldCheck className="h-5 w-5" />
            <span className="font-semibold">Secure Checkout</span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* LEFT SIDE */}
          <div className="space-y-8 lg:col-span-2">
            {/* PAYMENT CARD */}
            <div className="rounded-3xl bg-white p-8 shadow-2xl">
              <div className="mb-8">
                <h1 className="text-4xl font-black text-gray-900">
                  Payment Details
                </h1>

                <p className="mt-2 text-gray-500">
                  Complete your purchase securely
                </p>
              </div>

              {/* PAYMENT METHODS */}
              <div className="mb-8 grid gap-4 md:grid-cols-3">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`rounded-2xl border-2 p-5 transition ${
                    paymentMethod === 'card'
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200'
                  }`}
                >
                  <CreditCard className="mx-auto h-8 w-8 text-indigo-600" />

                  <p className="mt-3 font-semibold text-gray-900">
                    Card
                  </p>
                </button>

                <button
                  onClick={() => setPaymentMethod('upi')}
                  className={`rounded-2xl border-2 p-5 transition ${
                    paymentMethod === 'upi'
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-600">
                    U
                  </div>

                  <p className="mt-3 font-semibold text-gray-900">
                    UPI
                  </p>
                </button>

                <button
                  onClick={() => setPaymentMethod('cod')}
                  className={`rounded-2xl border-2 p-5 transition ${
                    paymentMethod === 'cod'
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200'
                  }`}
                >
                  <Truck className="mx-auto h-8 w-8 text-indigo-600" />

                  <p className="mt-3 font-semibold text-gray-900">
                    COD
                  </p>
                </button>
              </div>

              {/* FORM */}
              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Cardholder Name
                  </label>

                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full rounded-2xl border border-gray-200 px-5 py-4 outline-none transition focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Card Number
                  </label>

                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full rounded-2xl border border-gray-200 px-5 py-4 outline-none transition focus:border-indigo-500"
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Expiry Date
                    </label>

                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full rounded-2xl border border-gray-200 px-5 py-4 outline-none transition focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      CVV
                    </label>

                    <input
                      type="password"
                      placeholder="***"
                      className="w-full rounded-2xl border border-gray-200 px-5 py-4 outline-none transition focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Billing Address
                  </label>

                  <textarea
                    rows={4}
                    placeholder="Enter your address..."
                    className="w-full rounded-2xl border border-gray-200 px-5 py-4 outline-none transition focus:border-indigo-500"
                  />
                </div>

                <button className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-4 text-lg font-bold text-white shadow-lg transition hover:scale-[1.01]">
                  <CheckCircle2 className="h-6 w-6" />
                  Pay ₹{grandTotal.toFixed(2)}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div>
            <div className="sticky top-8 rounded-3xl bg-white p-8 shadow-2xl">
              <h2 className="text-2xl font-black text-gray-900">
                Order Summary
              </h2>

              {/* ITEMS */}
              <div className="mt-6 space-y-5">
                {items.map((item, index) => {
                  const price = parseFloat(item.price) || 0
                  const quantity = item.itemCount || 1

                  return (
                    <div
                      key={index}
                      className="flex items-center gap-4"
                    >
                      <div className="h-20 w-20 overflow-hidden rounded-2xl bg-gray-100">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="line-clamp-1 font-bold text-gray-900">
                          {item.title}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          Qty: {quantity}
                        </p>
                      </div>

                      <p className="font-bold text-indigo-600">
                        ₹{(price * quantity).toFixed(2)}
                      </p>
                    </div>
                  )
                })}
              </div>

              {/* TOTAL */}
              <div className="mt-8 border-t pt-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-gray-500">
                    Total Items
                  </span>

                  <span className="font-semibold text-gray-900">
                    {totalItems}
                  </span>
                </div>

                <div className="mb-4 flex items-center justify-between">
                  <span className="text-gray-500">
                    Shipping
                  </span>

                  <span className="font-semibold text-green-600">
                    Free
                  </span>
                </div>

                <div className="flex items-center justify-between border-t pt-5">
                  <span className="text-xl font-bold text-gray-900">
                    Grand Total
                  </span>

                  <span className="text-3xl font-black text-indigo-600">
                    ₹{grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* SECURITY INFO */}
              <div className="mt-8 rounded-2xl bg-green-50 p-5">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-1 h-6 w-6 text-green-600" />

                  <div>
                    <h3 className="font-bold text-green-700">
                      100% Secure
                    </h3>

                    <p className="mt-1 text-sm text-green-600">
                      Your payments are encrypted and protected.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
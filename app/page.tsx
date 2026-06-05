"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">
      
      {/* Background glow */}
      <div className="absolute w-[300px] h-[300px] bg-blue-500 rounded-full blur-[120px] opacity-30 top-10 left-10 animate-pulse" />
      <div className="absolute w-[300px] h-[300px] bg-purple-500 rounded-full blur-[120px] opacity-30 bottom-10 right-10 animate-pulse" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-lg text-center p-10 rounded-3xl 
        bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl
        transition-all duration-300 hover:scale-[1.02] hover:shadow-blue-500/20">

        {/* Title */}
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-white via-blue-300 to-purple-400 bg-clip-text text-transparent">
          NexCart
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-lg text-slate-300 font-medium">
          Modern E-Commerce Management Platform
        </p>

        {/* Description */}
        <p className="mt-4 text-sm text-slate-400 leading-relaxed">
          Manage Products, Inventory, Orders, and Customers with a powerful
          Next.js dashboard built for performance, scalability, and modern UX.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex gap-4 justify-center flex-wrap">
          
          <Link href="/auth/login">
            <button className="px-6 py-3 rounded-xl font-semibold text-white 
              bg-blue-600 hover:bg-blue-500 transition-all duration-300
              hover:scale-105 active:scale-95 shadow-lg">
              Login
            </button>
          </Link>

          <Link href="/auth/register">
            <button className="px-6 py-3 rounded-xl font-semibold text-white 
              border border-white/30 hover:bg-white/10 transition-all duration-300
              hover:scale-105 active:scale-95">
              Register
            </button>
          </Link>
        </div>

        {/* Footer text */}
        <p className="mt-6 text-xs text-slate-500">
          Click Login or Register to continue
        </p>
      </div>
    </div>
  );
}
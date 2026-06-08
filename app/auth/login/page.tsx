"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, FormEvent, useEffect } from "react";
import { setEncryptedItem, getDecryptedItem } from "../encript";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Used both for initial auth check and login submit
  const [isLoading, setIsLoading] = useState(true);

  // Check if already logged in
  useEffect(() => {
    const token = getDecryptedItem("token");

    if (token) {
      router.replace("/admin/dashboard");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      // const response = await fetch("/api/login", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     email,
      //     password,
      //   }),
      // });

      // const data = await response.json();

      // if (!response.ok) {
      //   throw new Error(data.error || "Login failed");
      // }

      // setEncryptedItem("token", data.token);
      // setEncryptedItem("user", data.user);

      // Remove login page from history
      router.replace("/admin/dashboard");

      // No setIsLoading(false) here
      return;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }

      setIsLoading(false);
    }
  }

  // Prevent login form flash
  if (isLoading) {
    return (
      <div className="w-xl mt-10 mx-auto text-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-xl mt-10 mx-auto">
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={handleLogin}
      >
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 text-sm rounded text-center font-medium">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email Addressss
          </label>

          <input
            className="shadow appearance-none border rounded w-full py-2 px-3"
            id="email"
            type="email"
            required
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>

          <input
            className="shadow appearance-none border rounded w-full py-2 px-3"
            id="password"
            type="password"
            required
            placeholder="******************"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            type="submit"
          >
            Sign In
          </button>

          <Link
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            href="/forgot-password"
          >
            Forgot Password?
          </Link>
        </div>
      </form>

      <p className="text-center text-gray-500 text-xs">
        &copy;2026 Acme Corp. All rights reserved.
      </p>
    </div>
  );
}
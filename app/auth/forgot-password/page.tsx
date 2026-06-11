"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Step = "email" | "otp" | "reset";

export default function ForgotPassword() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("email");

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function apiJson(url: string, body: any) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const text = await response.text();

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      console.log("API returned HTML/error:", text);
      throw new Error(`API route not found or crashed: ${url}`);
    }

    if (!response.ok) {
      throw new Error(data.error || "Request failed");
    }

    return data;
  }

  async function sendOtp(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      await apiJson("/api/forgot-password/send-otp", { email });

      setMessage("OTP sent to your email");
      setStep("otp");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  async function verifyOtp(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      await apiJson("/api/forgot-password/verify-otp", {
        email,
        otp,
      });

      setMessage("OTP verified successfully");
      setStep("reset");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  async function resetPassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      await apiJson("/api/forgot-password/reset-otp", {
        email,
        otp,
        password,
      });

      setMessage("Password reset successfully");

      setTimeout(() => {
        router.replace("/auth/login");
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-xl mt-10 mx-auto">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h1 className="text-xl font-bold mb-4 text-center">
          Forgot Password
        </h1>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 text-sm rounded text-center font-medium">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 p-2 bg-green-100 text-green-700 text-sm rounded text-center font-medium">
            {message}
          </div>
        )}

        {step === "email" && (
          <form onSubmit={sendOtp}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Registered Email
              </label>

              <input
                className="shadow appearance-none border rounded w-full py-2 px-3"
                type="email"
                required
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full disabled:opacity-50"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={verifyOtp}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Enter OTP
              </label>

              <input
                className="shadow appearance-none border rounded w-full py-2 px-3"
                type="text"
                required
                maxLength={6}
                placeholder="Enter 6 digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full disabled:opacity-50"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}

        {step === "reset" && (
          <form onSubmit={resetPassword}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                New Password
              </label>

              <input
                className="shadow appearance-none border rounded w-full py-2 px-3"
                type="password"
                required
                minLength={6}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full disabled:opacity-50"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
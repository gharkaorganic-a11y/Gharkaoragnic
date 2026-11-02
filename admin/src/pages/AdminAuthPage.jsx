import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockKeyhole, Mail } from "lucide-react";
import { useAdminAuth } from "../context/AdminAuthContext";

export default function AdminAuthPage() {
  const navigate = useNavigate();
  const { login, loading: authLoading } = useAdminAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await login(form.email.trim(), form.password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err?.message || "Unable to sign in. Please try again.");
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F1F3F6] px-4 py-10 font-sans text-[#202124]">
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-100/70 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-sky-100/70 blur-3xl" />
      <section className="relative w-full max-w-md rounded-2xl border border-gray-200 bg-white p-7 shadow-xl shadow-blue-900/5 sm:p-9">
        <div className="mb-8 flex flex-col items-center text-center">
          <img
            src="https://gharkaorganic.com/logo/gharka-logo.png"
            alt="Ghar Ka Organic"
            className="mb-4 h-16 w-auto max-w-[240px] object-contain"
          />
          <h1 className="text-2xl font-semibold tracking-tight text-[#202124]">
            Ghar Ka Organic
          </h1>
          <p className="mt-1 text-sm text-[#667067]">Admin sign in</p>
        </div>

        {error && (
          <p
            role="alert"
            className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              Email
            </span>
            <span className="relative block">
              <Mail
                size={17}
                aria-hidden="true"
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="email"
                name="email"
                autoComplete="username"
                value={form.email}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                placeholder="admin@example.com"
                className="h-12 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-[#2874F0] focus:ring-2 focus:ring-blue-100"
                required
              />
            </span>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              Password
            </span>
            <span className="relative block">
              <LockKeyhole
                size={17}
                aria-hidden="true"
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                value={form.password}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    password: event.target.value,
                  }))
                }
                placeholder="Enter your password"
                className="h-12 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-[#2874F0] focus:ring-2 focus:ring-blue-100"
                required
              />
            </span>
          </label>

          <button
            type="submit"
            disabled={authLoading}
            className="mt-2 flex h-12 w-full items-center justify-center rounded-lg bg-[#2874F0] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1c5fba] disabled:cursor-not-allowed disabled:opacity-60">
            {authLoading ? "Signing in..." : "Admin Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs leading-5 text-[#748076]">
          Store management is available to authorized administrators only.
        </p>
      </section>
    </main>
  );
}

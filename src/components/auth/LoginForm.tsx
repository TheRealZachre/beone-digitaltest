"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

const inputClassName =
  "mt-1.5 w-full rounded-lg border border-brand-ink/10 bg-white px-4 py-2.5 text-sm text-brand-ink outline-none focus:border-brand-indigo focus:ring-2 focus:ring-brand-indigo/20";

export function LoginForm({ googleEnabled }: { googleEnabled: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const registered = searchParams.get("registered") === "1";
  const reset = searchParams.get("reset") === "1";

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      login,
      password,
      redirect: false,
      callbackUrl,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid username, email, or password.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {registered && (
        <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Account created. Sign in with your email and password.
        </p>
      )}

      {reset && (
        <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Password updated. Sign in with your new password.
        </p>
      )}

      {googleEnabled && (
        <>
          <GoogleSignInButton callbackUrl={callbackUrl} disabled={loading} />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-brand-ink/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-brand-paper px-2 text-brand-muted">or</span>
            </div>
          </div>
        </>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm font-medium text-brand-ink">
          Email or username
          <input
            type="text"
            autoComplete="username"
            value={login}
            onChange={(event) => setLogin(event.target.value)}
            className={inputClassName}
            required
          />
        </label>

        <label className="block text-sm font-medium text-brand-ink">
          Password
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={inputClassName}
            required
          />
        </label>

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-brand-indigo hover:text-brand-indigo-bright"
          >
            Forgot password?
          </Link>
        </div>

        {error && <p className="text-sm text-rose-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-brand-indigo px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-indigo-bright disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="text-center text-sm text-brand-muted">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-brand-indigo hover:text-brand-indigo-bright"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}

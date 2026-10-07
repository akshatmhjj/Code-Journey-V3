"use client";

import { useActionState } from "react";
import { Lock } from "lucide-react";
import { login } from "./actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, null);
  return (
    <main className="grid min-h-[100dvh] place-items-center px-4">
      <form action={action} className="grid w-full max-w-[380px] gap-5 rounded-[var(--radius-lg)] border-2 border-ink p-6 shadow-[6px_6px_0_var(--ink)]">
        <div>
          <Lock size={26} />
          <h1 className="mt-4 text-3xl font-bold tracking-[-0.02em]">Admin</h1>
          <p className="mt-1 text-muted">Code Journey dashboard</p>
        </div>
        <label className="grid gap-1.5 text-sm">
          <span className="font-semibold">Password</span>
          <input
            name="password"
            type="password"
            required
            autoFocus
            autoComplete="current-password"
            className="h-12 rounded-[var(--radius-md)] border-2 border-ink bg-canvas px-4 text-[16px] outline-none focus:shadow-[3px_3px_0_var(--ink)]"
          />
        </label>
        {state?.error && (
          <p role="alert" className="text-[15px] font-semibold">
            {state.error}
          </p>
        )}
        <button type="submit" disabled={pending} className="btn btn-accent w-full disabled:opacity-50">
          {pending ? "Checking…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}

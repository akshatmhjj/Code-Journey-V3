"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Mode = "signin" | "signup" | "reset" | "update";

const COPY: Record<Mode, { title: string; button: string }> = {
  signin: { title: "Welcome back", button: "Sign in" },
  signup: { title: "Create your account", button: "Create account" },
  reset: { title: "Reset your password", button: "Send reset link" },
  update: { title: "Choose a new password", button: "Save password" },
};

function Field({ id, label, ...rest }: { id: string; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="font-display font-semibold">
        {label}
      </label>
      <input id={id} name={id} required className="h-12 rounded-[var(--radius-md)] border-2 border-line-strong bg-canvas px-3.5 text-[16px] outline-none focus:border-ink" {...rest} />
    </div>
  );
}

export function AuthForm() {
  const params = useSearchParams();
  const router = useRouter();
  const initial = (params.get("mode") as Mode) ?? "signin";
  const [mode, setMode] = useState<Mode>(COPY[initial] ? initial : "signin");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email") ?? "").trim();
    const password = String(f.get("password") ?? "");
    setBusy(true);
    setError("");
    setNotice("");
    const sb = supabase();
    try {
      if (mode === "signin") {
        const { error } = await sb.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/me");
      } else if (mode === "signup") {
        const { data, error } = await sb.auth.signUp({
          email,
          password,
          options: { data: { full_name: String(f.get("name") ?? "").trim() }, emailRedirectTo: `${location.origin}/me` },
        });
        if (error) throw error;
        if (data.session) router.push("/me");
        else setNotice(`Check ${email} for a link to confirm your account.`);
      } else if (mode === "reset") {
        const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/login?mode=update` });
        if (error) throw error;
        setNotice(`If ${email} has an account, a reset link is on its way.`);
      } else {
        const { error } = await sb.auth.updateUser({ password });
        if (error) throw error;
        router.push("/me");
      }
    } catch (err) {
      setError((err as Error).message || "Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="w-full max-w-md justify-self-center rounded-[var(--radius-lg)] border-2 border-ink p-6 shadow-[6px_6px_0_var(--ink)] md:p-8">
      {(mode === "signin" || mode === "signup") && (
        <div className="mb-6 grid grid-cols-2 rounded-full border-2 border-ink p-1" role="tablist">
          {(["signin", "signup"] as const).map((m) => (
            <button
              key={m}
              role="tab"
              aria-selected={mode === m}
              onClick={() => {
                setMode(m);
                setError("");
                setNotice("");
              }}
              className={`h-10 rounded-full font-display font-semibold ${mode === m ? "bg-ink text-canvas" : ""}`}
            >
              {m === "signin" ? "Sign in" : "Sign up"}
            </button>
          ))}
        </div>
      )}
      <h2 className="text-2xl font-bold">{COPY[mode].title}</h2>
      <form onSubmit={onSubmit} className="mt-5 grid gap-4">
        {mode === "signup" && <Field id="name" label="Name" autoComplete="name" />}
        {mode !== "update" && <Field id="email" label="Email" type="email" autoComplete="email" />}
        {mode !== "reset" && (
          <Field
            id="password"
            label={mode === "update" ? "New password" : "Password"}
            type="password"
            minLength={8}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
          />
        )}
        {mode === "signup" && <p className="-mt-2 text-sm text-muted">At least 8 characters.</p>}
        {error && (
          <p role="alert" className="rounded-[var(--radius-md)] border-2 border-accent px-3 py-2 text-[15px]">
            {error}
          </p>
        )}
        {notice && (
          <p role="status" className="rounded-[var(--radius-md)] bg-surface px-3 py-2 text-[15px]">
            {notice}
          </p>
        )}
        <button type="submit" disabled={busy} className="btn btn-accent mt-1 w-full disabled:opacity-50">
          {busy ? "One moment…" : COPY[mode].button}
        </button>
      </form>
      <div className="mt-5 flex flex-wrap justify-between gap-2 text-[15px]">
        {mode === "signin" && (
          <button onClick={() => setMode("reset")} className="link">
            Forgot your password?
          </button>
        )}
        {mode === "reset" && (
          <button onClick={() => setMode("signin")} className="link">
            Back to sign in
          </button>
        )}
        <Link href="/privacy" className="text-muted hover:underline">
          Privacy
        </Link>
      </div>
    </div>
  );
}

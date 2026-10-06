"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Mode = "signin" | "signup" | "reset" | "update" | "callback";
type Provider = "google" | "github";

const COPY: Record<Mode, { title: string; sub: string; button: string }> = {
  signin: { title: "Welcome back", sub: "Pick up your route where you left it.", button: "Sign in" },
  signup: { title: "Create your account", sub: "Free, and it takes under a minute.", button: "Create account" },
  reset: { title: "Reset your password", sub: "We'll email you a link to choose a new one.", button: "Send reset link" },
  update: { title: "Choose a new password", sub: "At least 8 characters.", button: "Save password" },
  callback: { title: "Signing you in…", sub: "One moment while we finish up.", button: "" },
};

const PROVIDERS: { id: Provider; label: string; icon: React.ReactNode }[] = [
  {
    id: "google",
    label: "Google",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.2-2.1 3.5-5.1 3.5-8.7Z" />
        <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24Z" />
        <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6h-4a12 12 0 0 0 0 10.8l4-3.1Z" />
        <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1c.9-2.9 3.6-4.9 6.7-4.9Z" />
      </svg>
    ),
  },
  {
    id: "github",
    label: "GitHub",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="currentColor">
        <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6 0-3.2 0 0 1-.3 3.4 1.2a11.5 11.5 0 0 1 6 0C17.3 4.9 18.3 5.2 18.3 5.2c.6 1.6.2 2.8.1 3.2.8.8 1.3 1.9 1.3 3.1 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1.1.9 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3" />
      </svg>
    ),
  },
];

// Supabase auth error codes → messages that say what to do next.
const AUTH_ERRORS: Record<string, string> = {
  invalid_credentials: "That email and password don't match. Check them, or use “Forgot your password?” below.",
  user_already_exists: "An account with this email already exists. Sign in instead, or reset your password.",
  email_exists: "An account with this email already exists. Sign in instead, or reset your password.",
  email_not_confirmed: "Confirm your email first - the link is in your inbox (check spam too).",
  weak_password: "That password is too easy to guess. Use at least 8 characters with a mix of letters and numbers.",
  over_email_send_rate_limit: "Too many emails sent. Wait a few minutes and try again.",
  over_request_rate_limit: "Too many attempts. Wait a minute and try again.",
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
  // For mode=update: has the reset link given us a session yet?
  const [recovery, setRecovery] = useState<"checking" | "ready" | "dead">("checking");
  // Social sign-in buttons appear only for providers switched on in Supabase.
  const [providers, setProviders] = useState<Provider[]>([]);
  const [callbackError, setCallbackError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/settings`, { headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! } })
      .then((r) => (r.ok ? r.json() : null))
      .then((s: { external?: Record<string, boolean> } | null) => {
        if (!cancelled && s?.external) setProviders(PROVIDERS.map((p) => p.id).filter((id) => s.external?.[id]));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Back from Google or GitHub: finish the session, then go to My Path.
  useEffect(() => {
    if (mode !== "callback") return;
    const sb = supabase();
    const hash = new URLSearchParams(location.hash.slice(1));
    const search = new URLSearchParams(location.search);
    const problem = hash.get("error_description") ?? search.get("error_description");
    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      router.replace("/me");
    };
    const { data: sub } = sb.auth.onAuthStateChange((_e, session) => session && go());
    (async () => {
      // Provider said no (cancelled, or the provider isn't set up).
      if (problem) return setCallbackError(problem.replace(/\+/g, " "));
      const code = search.get("code");
      if (code) {
        const { error } = await sb.auth.exchangeCodeForSession(code);
        if (error) return setCallbackError(error.message);
        return go();
      }
      const { data } = await sb.auth.getSession();
      if (data.session) go();
      else setTimeout(() => !done && setCallbackError("We couldn't finish signing you in. Please try again."), 4000);
    })();
    return () => sub.subscription.unsubscribe();
  }, [mode, router]);

  async function social(provider: Provider) {
    setError("");
    setBusy(true);
    const { error } = await supabase().auth.signInWithOAuth({ provider, options: { redirectTo: `${location.origin}/login?mode=callback` } });
    if (error) {
      setBusy(false);
      setError(error.message);
    }
  }

  useEffect(() => {
    if (mode !== "update") return;
    const sb = supabase();
    const hash = new URLSearchParams(location.hash.slice(1));
    const search = new URLSearchParams(location.search);
    const dead = () => setRecovery("dead");
    const ready = () => setRecovery("ready");

    const { data: sub } = sb.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) ready();
    });

    (async () => {
      // Supabase sends one of three shapes depending on project settings.
      if (hash.get("error") || search.get("error")) return dead();
      const code = search.get("code");
      const tokenHash = search.get("token_hash");
      if (code) {
        const { error } = await sb.auth.exchangeCodeForSession(code);
        return error ? dead() : ready();
      }
      if (tokenHash) {
        const { error } = await sb.auth.verifyOtp({ token_hash: tokenHash, type: "recovery" });
        return error ? dead() : ready();
      }
      // Implicit flow: supabase-js reads #access_token itself; getSession waits for that.
      const { data } = await sb.auth.getSession();
      if (data.session) ready();
      else setTimeout(() => setRecovery((r) => (r === "checking" ? "dead" : r)), 1500);
    })();

    return () => sub.subscription.unsubscribe();
  }, [mode]);

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
      const code = (err as { code?: string }).code ?? "";
      setError(AUTH_ERRORS[code] ?? ((err as Error).message || "Something went wrong. Try again."));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="w-full max-w-[420px]">
      {(mode === "signin" || mode === "signup") && (
        <div className="mb-10 grid grid-cols-2 rounded-full border-2 border-ink p-1" role="tablist">
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
      <h1 className="text-[clamp(2rem,4vw,2.75rem)] leading-[1.02] font-bold tracking-[-0.03em]">{COPY[mode].title}</h1>
      <p className="mt-2 text-muted">{COPY[mode].sub}</p>
      {mode === "callback" ? (
        <div className="mt-8 grid gap-4" role="status">
          {callbackError ? (
            <>
              <p>{callbackError}</p>
              <button onClick={() => { setMode("signin"); setCallbackError(""); router.replace("/login"); }} className="btn btn-accent w-full">
                Back to sign in
              </button>
            </>
          ) : (
            <div className="h-2 overflow-hidden rounded-full bg-surface">
              <div className="h-full w-1/3 animate-pulse rounded-full bg-accent" />
            </div>
          )}
        </div>
      ) : mode === "update" && recovery !== "ready" ? (
        <div className="mt-8 grid gap-4" role="status">
          {recovery === "checking" ? (
            <p className="text-muted">Checking your reset link…</p>
          ) : (
            <>
              <p>This reset link has expired, was already used, or didn&apos;t open on the right page. Links work once, for about an hour.</p>
              <button onClick={() => { setMode("reset"); setError(""); }} className="btn btn-accent w-full">
                Send a new reset link
              </button>
            </>
          )}
        </div>
      ) : (
      <>
      {(mode === "signin" || mode === "signup") && providers.length > 0 && (
        <div className="mt-8 grid gap-3">
          {PROVIDERS.filter((p) => providers.includes(p.id)).map((p) => (
            <button key={p.id} type="button" onClick={() => social(p.id)} disabled={busy} className="btn btn-line w-full disabled:opacity-50">
              {p.icon} Continue with {p.label}
            </button>
          ))}
          <p className="mt-2 flex items-center gap-3 font-mono text-[11.5px] tracking-wider text-muted uppercase before:h-px before:flex-1 before:bg-line after:h-px after:flex-1 after:bg-line">
            or with email
          </p>
        </div>
      )}
      <form onSubmit={onSubmit} className={`${providers.length > 0 && (mode === "signin" || mode === "signup") ? "mt-3" : "mt-8"} grid gap-5`}>
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
      </>
      )}
      <div className="mt-6 flex flex-wrap justify-between gap-2 text-[15px]">
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

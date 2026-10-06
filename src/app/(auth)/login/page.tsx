import type { Metadata } from "next";
import { Suspense } from "react";
import { Mark } from "@/components/brand/Logo";
import { AuthForm } from "./AuthForm";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in or create a free Code Journey account to save your route and ask CJ AI.",
  robots: { index: false },
};

export default function Login() {
  return (
    <div className="wrap grid gap-12 py-12 md:grid-cols-2 md:items-center md:py-20">
      <div className="hidden md:block">
        <Mark size={72} />
        <h1 className="mt-8 max-w-[12ch] text-[clamp(2.5rem,5vw,4rem)] leading-[0.98] font-bold tracking-[-0.035em]">Save your place on the map.</h1>
        <p className="mt-5 max-w-[42ch] text-lg text-muted">
          Reading is always free and open. An account lets you ask CJ AI and, soon, track your route skill by skill.
        </p>
      </div>
      <Suspense>
        <AuthForm />
      </Suspense>
    </div>
  );
}

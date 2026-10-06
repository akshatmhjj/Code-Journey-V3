import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "./AuthForm";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in or create a free Code Journey account to save your route and ask CJ AI.",
  robots: { index: false },
};

export default function Login() {
  return (
    <Suspense>
      <AuthForm />
    </Suspense>
  );
}

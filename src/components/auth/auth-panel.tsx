"use client";

import { useState } from "react";
import { Mail, Phone, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type Mode = "email" | "phone";

export function AuthPanel() {
  const { t } = useLanguage();
  const [mode, setMode] = useState<Mode>("email");
  const [message, setMessage] = useState(t("developmentNotice"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const supabase = getSupabaseBrowserClient();
  const configured = Boolean(supabase);

  const signInWithEmail = async () => {
    if (!supabase) {
      setMessage(t("developmentNotice"));
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setMessage(error ? error.message : "Signed in. Saved items can sync now.");
  };

  const signInWithPhone = async () => {
    if (!supabase || !process.env.NEXT_PUBLIC_ENABLE_PHONE_OTP) {
      setMessage(
        "Phone OTP is implemented but disabled until SMS credentials are configured.",
      );
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({ phone });
    setMessage(error ? error.message : "OTP sent. Check your phone.");
  };

  const signInWithGoogle = async () => {
    if (!supabase) {
      setMessage(t("developmentNotice"));
      return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/account`,
      },
    });

    if (error) setMessage(error.message);
  };

  return (
    <section className="rounded-[1.5rem] border border-border bg-white p-5 shadow-soft md:p-6">
      <div className="flex items-start gap-4">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-mint text-teal-dark">
          <ShieldCheck className="h-6 w-6" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-2xl font-black text-ink">{t("signIn")}</h2>
          <p className="mt-2 text-sm leading-6 text-slate">
            {t("accountBenefit")}
          </p>
        </div>
      </div>

      {!configured && (
        <div className="mt-5 rounded-2xl border border-saffron/40 bg-saffron/15 p-4 text-sm font-semibold leading-6 text-ink">
          {t("developmentNotice")}
        </div>
      )}

      <div className="mt-5 flex rounded-full border border-border bg-canvas p-1">
        <button
          type="button"
          onClick={() => setMode("email")}
          className={`flex-1 rounded-full px-4 py-2 text-sm font-black ${
            mode === "email" ? "bg-ink text-white" : "text-slate"
          }`}
        >
          Email
        </button>
        <button
          type="button"
          onClick={() => setMode("phone")}
          className={`flex-1 rounded-full px-4 py-2 text-sm font-black ${
            mode === "phone" ? "bg-ink text-white" : "text-slate"
          }`}
        >
          Phone OTP
        </button>
      </div>

      {mode === "email" ? (
        <div className="mt-5 grid gap-3">
          <label className="grid gap-2 text-sm font-bold text-slate">
            {t("email")}
            <span className="flex items-center gap-3 rounded-2xl border border-border bg-canvas px-4 py-3">
              <Mail className="h-4 w-4 text-teal" aria-hidden="true" />
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                className="w-full bg-transparent text-ink outline-none"
              />
            </span>
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate">
            {t("password")}
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              className="rounded-2xl border border-border bg-canvas px-4 py-3 text-ink outline-none"
            />
          </label>
          <button
            type="button"
            onClick={() => void signInWithEmail()}
            className="rounded-2xl bg-ink px-5 py-3 text-sm font-black text-white"
          >
            Sign in with email
          </button>
        </div>
      ) : (
        <div className="mt-5 grid gap-3">
          <label className="grid gap-2 text-sm font-bold text-slate">
            {t("phone")}
            <span className="flex items-center gap-3 rounded-2xl border border-border bg-canvas px-4 py-3">
              <Phone className="h-4 w-4 text-teal" aria-hidden="true" />
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                type="tel"
                className="w-full bg-transparent text-ink outline-none"
              />
            </span>
          </label>
          <button
            type="button"
            onClick={() => void signInWithPhone()}
            className="rounded-2xl bg-ink px-5 py-3 text-sm font-black text-white"
          >
            Send OTP
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => void signInWithGoogle()}
        className="mt-3 w-full rounded-2xl border border-border bg-white px-5 py-3 text-sm font-black text-ink shadow-soft"
      >
        {t("continueGoogle")}
      </button>

      <p className="mt-4 min-h-6 text-sm font-semibold leading-6 text-slate">
        {message}
      </p>
    </section>
  );
}

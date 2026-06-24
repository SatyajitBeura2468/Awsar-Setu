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
    <section className="settings-section">
      <div className="flex items-start gap-4">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-mint text-teal">
          <ShieldCheck className="h-6 w-6" aria-hidden="true" />
        </span>
        <div>
          <h2>{t("signIn")}</h2>
          <p className="mt-2 text-sm leading-6 text-slate">
            {t("accountBenefit")}
          </p>
        </div>
      </div>

      {!configured && (
        <div className="quiet-info-row">
          {t("developmentNotice")}
        </div>
      )}

      <div className="segmented-control mt-5">
        <button
          type="button"
          onClick={() => setMode("email")}
          className={mode === "email" ? "is-active" : ""}
        >
          Email
        </button>
        <button
          type="button"
          onClick={() => setMode("phone")}
          className={mode === "phone" ? "is-active" : ""}
        >
          Phone OTP
        </button>
      </div>

      {mode === "email" ? (
        <div className="mt-5 grid gap-3">
          <label className="settings-field">
            {t("email")}
            <span className="flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3">
              <Mail className="h-4 w-4 text-teal" aria-hidden="true" />
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                className="w-full bg-transparent text-ink outline-none"
              />
            </span>
          </label>
          <label className="settings-field">
            {t("password")}
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              className="rounded-xl border border-border bg-white px-4 py-3 text-ink outline-none focus:border-teal"
            />
          </label>
          <button
            type="button"
            onClick={() => void signInWithEmail()}
            className="button-primary"
          >
            Sign in with email
          </button>
        </div>
      ) : (
        <div className="mt-5 grid gap-3">
          <label className="settings-field">
            {t("phone")}
            <span className="flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3">
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
            className="button-primary"
          >
            Send OTP
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => void signInWithGoogle()}
        className="button-secondary mt-3 w-full"
      >
        {t("continueGoogle")}
      </button>

      <p className="mt-4 min-h-6 text-sm font-semibold leading-6 text-slate">
        {message}
      </p>
    </section>
  );
}

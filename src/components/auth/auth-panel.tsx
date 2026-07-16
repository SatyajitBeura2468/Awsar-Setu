"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  LogOut,
  Mail,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup" | "phone" | "recovery";

export function AuthPanel() {
  const { t } = useLanguage();
  const [mode, setMode] = useState<Mode>("signin");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const supabase = getSupabaseBrowserClient();
  const configured = Boolean(supabase);
  const phoneEnabled = process.env.NEXT_PUBLIC_ENABLE_PHONE_OTP === "true";

  useEffect(() => {
    if (!supabase) return;
    void supabase.auth.getSession().then(({ data }) => {
      setUserEmail(data.session?.user.email ?? data.session?.user.phone ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user.email ?? session?.user.phone ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  const run = async (action: () => Promise<string>) => {
    setBusy(true);
    setMessage("");
    try {
      setMessage(await action());
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  if (!configured) {
    return (
      <section className="account-sync-unavailable">
        <span><ShieldCheck aria-hidden="true" /></span>
        <div>
          <h2>Sync across devices</h2>
          <p>
            Sign-in providers are not configured on this deployment. Your saves,
            notes and profile signals still work privately on this device.
          </p>
          <strong>Guest mode is active</strong>
        </div>
      </section>
    );
  }

  if (userEmail) {
    return (
      <section className="account-session">
        <span><CheckCircle2 aria-hidden="true" /></span>
        <div>
          <small>Signed in</small>
          <h2>{userEmail}</h2>
          <p>Your local saves and profile signals can sync across devices.</p>
        </div>
        <button
          type="button"
          className="button-secondary"
          onClick={() => void run(async () => {
            const { error } = await supabase!.auth.signOut();
            if (error) throw error;
            return "Signed out.";
          })}
        >
          <LogOut aria-hidden="true" />Sign out
        </button>
      </section>
    );
  }

  const submitEmail = () => run(async () => {
    if (!email || (mode !== "recovery" && password.length < 6)) {
      return "Enter a valid email and a password of at least 6 characters.";
    }
    if (mode === "recovery") {
      const { error } = await supabase!.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/account`,
      });
      return error ? error.message : "Password reset instructions sent.";
    }
    if (mode === "signup") {
      const { error } = await supabase!.auth.signUp({ email, password });
      return error ? error.message : "Account created. Check your email if confirmation is enabled.";
    }
    const { error } = await supabase!.auth.signInWithPassword({ email, password });
    return error ? error.message : "Signed in. Your local data can sync now.";
  });

  const submitPhone = () => run(async () => {
    if (!phoneEnabled) return "Phone OTP is disabled until an SMS provider is configured.";
    if (!otpSent) {
      const { error } = await supabase!.auth.signInWithOtp({ phone });
      if (!error) setOtpSent(true);
      return error ? error.message : "OTP sent. Enter the code to continue.";
    }
    const { error } = await supabase!.auth.verifyOtp({ phone, token: otp, type: "sms" });
    return error ? error.message : "Phone verified and signed in.";
  });

  return (
    <section className="auth-workspace">
      <div className="auth-heading">
        <span><ShieldCheck aria-hidden="true" /></span>
        <div>
          <h2>Sync across devices</h2>
          <p>{t("accountBenefit")}</p>
        </div>
      </div>

      <div className="auth-mode-row" aria-label="Authentication method">
        <button type="button" onClick={() => setMode("signin")} className={mode === "signin" ? "is-active" : ""}>Sign in</button>
        <button type="button" onClick={() => setMode("signup")} className={mode === "signup" ? "is-active" : ""}>Create account</button>
        {phoneEnabled && <button type="button" onClick={() => setMode("phone")} className={mode === "phone" ? "is-active" : ""}>Phone OTP</button>}
      </div>

      {mode === "phone" ? (
        <div className="auth-fields">
          <label>Phone number<span><Phone aria-hidden="true" /><input value={phone} onChange={(event) => setPhone(event.target.value)} type="tel" placeholder="+91…" /></span></label>
          {otpSent && <label>Verification code<input value={otp} onChange={(event) => setOtp(event.target.value)} inputMode="numeric" autoComplete="one-time-code" /></label>}
          <button type="button" onClick={() => void submitPhone()} disabled={busy} className="button-primary">{otpSent ? "Verify and sign in" : "Send OTP"}<ArrowRight aria-hidden="true" /></button>
        </div>
      ) : (
        <div className="auth-fields">
          <label>Email<span><Mail aria-hidden="true" /><input value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" /></span></label>
          {mode !== "recovery" && <label>Password<input value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} /></label>}
          <button type="button" onClick={() => void submitEmail()} disabled={busy} className="button-primary">
            {mode === "signup" ? "Create account" : mode === "recovery" ? "Send reset link" : "Sign in with email"}<ArrowRight aria-hidden="true" />
          </button>
          <button type="button" className="auth-text-action" onClick={() => setMode(mode === "recovery" ? "signin" : "recovery")}>
            {mode === "recovery" ? "Back to sign in" : "Forgot password?"}
          </button>
        </div>
      )}

      <div className="auth-divider"><span>or</span></div>
      <button
        type="button"
        disabled={busy}
        onClick={() => void run(async () => {
          const { error } = await supabase!.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: `${window.location.origin}/account` },
          });
          return error ? error.message : "Opening Google sign in…";
        })}
        className="button-secondary full"
      >
        Continue with Google
      </button>
      {message && <p role="status" className="auth-message">{message}</p>}
    </section>
  );
}

"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ExternalLink, Info, ShieldCheck, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import type { ContentStatus, Opportunity } from "@/lib/types";

export function MotionProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function ReducedMotionProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function RouteTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.16, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export function AtlasBackground() {
  return <div className="site-glow" aria-hidden="true" />;
}

export function InteractiveSurface({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

export function MagneticAction({
  children,
  className = "",
  type = "button",
  onClick,
}: {
  children: ReactNode;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
}) {
  return (
    <button type={type} onClick={onClick} className={className}>
      {children}
    </button>
  );
}

export function RevealSequence({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: reduceMotion ? 0 : 0.2 }}
    >
      {children}
    </motion.div>
  );
}

export const contentStatusCopy: Record<
  ContentStatus,
  { label: string; tone: string; description: string }
> = {
  "verified-active": {
    label: "Verified active",
    tone: "trust-status-verified",
    description:
      "A notice-level record reviewed against an official source and still marked active.",
  },
  "official-directory": {
    label: "Official directory",
    tone: "trust-status-directory",
    description:
      "A trusted official pathway. Specific eligibility, deadline and opening details must be checked on the source.",
  },
  archived: {
    label: "Archived",
    tone: "trust-status-archived",
    description: "Kept for reference. It should not be treated as open.",
  },
  unavailable: {
    label: "Unavailable",
    tone: "trust-status-unavailable",
    description:
      "Not currently available for citizen action through AwsarSetu.",
  },
  "development-sample": {
    label: "Internal sample",
    tone: "trust-status-sample",
    description:
      "A seed record for development only. It is not shown as an active opportunity.",
  },
};

export function TrustStatus({
  status,
  compact = false,
}: {
  status: ContentStatus;
  compact?: boolean;
}) {
  const copy = contentStatusCopy[status];
  return (
    <span
      className={`trust-status ${copy.tone} ${compact ? "trust-status-compact" : ""}`}
      title={copy.description}
    >
      <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
      {copy.label}
    </span>
  );
}

export function ProfilePulse({
  strength,
  label,
}: {
  strength: number;
  label: string;
}) {
  return (
    <div className="profile-pulse" aria-label={`Profile strength ${strength}%`}>
      <div
        className="profile-pulse-ring"
        style={{ "--profile-strength": `${strength}%` } as CSSProperties}
      >
        <span>{strength}%</span>
      </div>
      <p>{label}</p>
    </div>
  );
}

export function OpportunitySignal({
  label,
  active = false,
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <span className={`opportunity-signal ${active ? "is-active" : ""}`}>
      {label}
    </span>
  );
}

export function SourceExitSheet({
  opportunity,
  className = "",
  children,
}: {
  opportunity: Opportunity;
  className?: string;
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const status = contentStatusCopy[opportunity.contentStatus];

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {children ?? opportunity.officialActionLabel}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="source-sheet-backdrop"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`source-sheet-${opportunity.id}`}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setOpen(false);
            }}
          >
            <motion.div
              className="source-sheet"
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
              transition={{ duration: reduceMotion ? 0 : 0.18, ease: "easeOut" }}
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="source-sheet-close"
                aria-label="Close source preflight"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
              <div className="source-sheet-icon">
                <ShieldCheck className="h-6 w-6" aria-hidden="true" />
              </div>
              <h2 id={`source-sheet-${opportunity.id}`}>
                You are leaving AwsarSetu
              </h2>
              <p>
                Continue only if the official source matches the opportunity
                you intend to check. AwsarSetu never charges for applications
                and does not guarantee eligibility.
              </p>
              <dl>
                <div>
                  <dt>Source domain</dt>
                  <dd>{opportunity.sourceDomain}</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>{status.label}</dd>
                </div>
                <div>
                  <dt>Last checked</dt>
                  <dd>{opportunity.lastChecked}</dd>
                </div>
              </dl>
              <div className="source-sheet-note">
                <Info className="h-4 w-4" aria-hidden="true" />
                {status.description}
              </div>
              <div className="source-sheet-actions">
                <a
                  href={opportunity.officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="source-sheet-primary"
                >
                  Continue to official source
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
                <button type="button" onClick={() => setOpen(false)}>
                  Stay on AwsarSetu
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function InlineTrustLink() {
  return (
    <Link href="/privacy" className="text-link">
      Trust and privacy
    </Link>
  );
}

"use client";

import Link from "next/link";
import { ArrowRight, SearchCheck } from "lucide-react";

export function EmptyState({
  title,
  description,
  actionHref = "/explore",
  actionLabel = "Broaden your search",
}: {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="empty-state">
      <span>
        <SearchCheck className="h-6 w-6" aria-hidden="true" />
      </span>
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
        <Link href={actionHref}>
          {actionLabel}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

import type { ReactNode } from "react";

export function SectionHeading({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <div className="mb-3 h-1.5 w-16 rounded-full bg-gradient-to-r from-coral via-saffron to-teal" />
        <h2 className="text-3xl font-black tracking-tight text-ink md:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-slate md:text-base">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

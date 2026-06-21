import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-2xl rounded-[2rem] border border-border bg-white p-8 text-center shadow-soft">
      <p className="text-sm font-black uppercase tracking-[0.16em] text-teal">
        Page not found
      </p>
      <h1 className="mt-3 text-3xl font-black text-ink">
        This opportunity path is not available.
      </h1>
      <p className="mt-4 text-base leading-7 text-slate">
        Try Explore or Vacancies to find current records.
      </p>
      <Link
        href="/explore"
        className="mt-6 inline-flex rounded-2xl bg-ink px-5 py-3 text-sm font-black text-white"
      >
        Explore opportunities
      </Link>
    </section>
  );
}

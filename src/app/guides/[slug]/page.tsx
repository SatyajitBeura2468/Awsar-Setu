import { notFound } from "next/navigation";
import { getGuideBySlug, guides } from "@/lib/opportunities";

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  return {
    title: guide ? `${guide.title} | AwsarSetu Guides` : "Guide | AwsarSetu",
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  return (
    <article className="mx-auto max-w-3xl rounded-[2rem] border border-border bg-white p-6 shadow-soft md:p-10">
      <p className="text-sm font-black uppercase tracking-[0.16em] text-teal">
        Helpful guide
      </p>
      <h1 className="mt-3 text-3xl font-black tracking-tight text-ink md:text-5xl">
        {guide.title}
      </h1>
      <p className="mt-4 text-lg leading-8 text-slate">{guide.summary}</p>
      <div className="mt-8 space-y-4">
        {guide.body.map((paragraph) => (
          <p key={paragraph} className="text-base leading-8 text-slate">
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  );
}

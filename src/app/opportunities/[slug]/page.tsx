import { notFound } from "next/navigation";
import { OpportunityDetail } from "@/components/opportunities/opportunity-detail";
import { getOpportunityBySlug, opportunities } from "@/lib/opportunities";

export function generateStaticParams() {
  return opportunities.map((opportunity) => ({ slug: opportunity.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const opportunity = getOpportunityBySlug(slug);
  return {
    title: opportunity
      ? `${opportunity.title} | AwsarSetu`
      : "Opportunity | AwsarSetu",
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const opportunity = getOpportunityBySlug(slug);

  if (!opportunity) notFound();

  return <OpportunityDetail opportunity={opportunity} />;
}

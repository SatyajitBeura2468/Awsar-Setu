import { readFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";

const file = process.argv[2] ?? "content/samples/opportunities.sample.json";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error(
    "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in a protected environment before importing.",
  );
  process.exit(1);
}

const raw = await readFile(file, "utf8");
const records = JSON.parse(raw);

if (!Array.isArray(records)) {
  console.error("Import file must contain an array of opportunity records.");
  process.exit(1);
}

if (records.some((record) => record.contentStatus === "development-sample")) {
  console.error(
    "Refusing to import development-sample records. Review official sources and mark records official-directory or verified-active first.",
  );
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: {
    persistSession: false,
  },
});

function legacyVerificationStatus(contentStatus) {
  if (contentStatus === "verified-active") return "officially-reviewed";
  if (contentStatus === "official-directory") return "source-linked";
  return "development-sample";
}

const rows = records.map((record) => ({
  slug: record.slug,
  title: record.title,
  category: record.category,
  description: record.description,
  visual_cover: record.visualCover,
  official_organisation: record.organisation,
  official_url: record.officialUrl,
  official_action_label: record.officialActionLabel,
  scope_kind: record.scope.kind,
  applicable_states: record.scope.kind === "state" ? record.scope.states : [],
  deadline: record.deadline,
  benefit_type: record.benefitType,
  eligibility_summary: record.eligibilitySummary,
  eligibility_tags: record.eligibilityTags,
  education_requirements: record.educationRequirements,
  age_min: record.ageBounds?.min,
  age_max: record.ageBounds?.max,
  gender_relevance: record.genderRelevance ?? [],
  income_relevance: record.incomeRelevance ?? [],
  current_role_relevance: record.currentRoleRelevance ?? [],
  documents: record.documents,
  what_it_offers: record.whatItOffers,
  who_can_apply: record.whoCanApply,
  important_conditions: record.importantConditions,
  how_to_apply: record.howToApply,
  last_checked: record.lastChecked,
  verification_status: legacyVerificationStatus(record.contentStatus),
  content_status: record.contentStatus,
  source_domain: record.sourceDomain,
  expired: record.expired,
}));

const { error } = await supabase
  .from("opportunities")
  .upsert(rows, { onConflict: "slug" });

if (error) {
  console.error(error.message);
  process.exit(1);
}

console.log(`Imported ${rows.length} reviewed opportunity record(s).`);

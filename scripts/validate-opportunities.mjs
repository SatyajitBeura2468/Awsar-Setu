import { readFile } from "node:fs/promises";
import { z } from "zod";

const categories = [
  "education-scholarships",
  "government-jobs-vacancies",
  "jobs-internships-apprenticeships",
  "skills-training",
  "schemes-financial-support",
  "agriculture-rural-livelihood",
  "health-welfare-social-support",
];

const schema = z.array(
  z.object({
    title: z.string().min(8),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    category: z.enum(categories),
    description: z.string().min(40),
    officialUrl: z.string().url(),
    verificationStatus: z.enum([
      "officially-reviewed",
      "source-linked",
      "development-sample",
    ]),
    sourceDomain: z.string().min(4),
  }).passthrough(),
);

const file = process.argv[2] ?? "content/samples/opportunities.sample.json";
const raw = await readFile(file, "utf8");
const parsed = schema.safeParse(JSON.parse(raw));

if (!parsed.success) {
  console.error(parsed.error.format());
  process.exit(1);
}

const unsafe = parsed.data.filter((item) => {
  const host = new URL(item.officialUrl).hostname.toLowerCase();
  return !(
    host.endsWith(".gov.in") ||
    host.endsWith(".nic.in") ||
    host.endsWith(".ac.in") ||
    host === "scholarships.gov.in" ||
    host === "apprenticeshipindia.gov.in" ||
    host === "skillindiadigital.gov.in" ||
    host === "services.india.gov.in"
  );
});

if (unsafe.length) {
  console.error("Unsafe official URL domains:", unsafe.map((item) => item.officialUrl));
  process.exit(1);
}

console.log(`Validated ${parsed.data.length} opportunity record(s).`);

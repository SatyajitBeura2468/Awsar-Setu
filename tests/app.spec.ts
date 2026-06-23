import { expect, test } from "@playwright/test";

test("guest can browse, open profile sheet, save locally and view tracker", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: /Find opportunities made for your next step/i,
    }),
  ).toBeVisible();
  await expect(page.getByText("Not personalised yet", { exact: true })).toBeVisible();
  await expect(page.getByText(/No verified deadlines are shown yet/i)).toBeVisible();

  await page.goto("/explore");
  await page.getByRole("button", { name: /For You/i }).click();
  await expect(page.getByRole("heading", { name: /Add a few signals/i })).toBeVisible();
  await page.getByRole("button", { name: /Use these signals/i }).click();

  await page.getByPlaceholder(/Search scholarships/i).fill("Odisha");
  await expect(
    page.getByRole("link", { name: /Odisha Public Service/i }).first(),
  ).toBeVisible();

  await page.getByRole("button", { name: /^Save$/i }).first().click();
  await page.goto("/saved");
  await expect(page.getByText(/Private notes/i)).toBeVisible();
});

test("state selector changes discovery context without hard-coded profile copy", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Change state/i }).click();
  await page.getByPlaceholder(/Search Odisha/i).fill("Kerala");
  await page.getByRole("button", { name: "Kerala" }).click();
  await expect(
    page.locator("header").getByRole("button", { name: /Kerala/i }).last(),
  ).toBeVisible();
  await expect(page.getByText(/Odisha \/ Age 19/i)).toHaveCount(0);
});

test("explore URL filters control search, sorting and lens chips", async ({
  page,
}) => {
  await page.goto(
    "/explore?q=Odisha&category=government-jobs-vacancies&state=Odisha&ageBand=18-24&benefit=job&sort=best",
  );

  await expect(page.getByPlaceholder(/Search scholarships/i)).toHaveValue(
    "Odisha",
  );
  await expect(page.getByLabel("Category")).toHaveValue(
    "government-jobs-vacancies",
  );
  await expect(page.getByLabel("State")).toHaveValue("Odisha");
  await expect(page.getByLabel("Age band")).toHaveValue("18-24");
  await expect(page.getByLabel("Benefit type")).toHaveValue("job");
  await expect(page.getByLabel("Sort opportunities")).toHaveValue("best");
  await expect(page.getByRole("link", { name: /Odisha Public/i })).toBeVisible();

  await page.getByLabel("Current role").selectOption("student");
  await expect(page).toHaveURL(/role=student/);
  await page.getByRole("button", { name: /Reset/i }).click();
  await expect(page).not.toHaveURL(/q=Odisha/);
});

test("vacancy and detail pages use source preflight before external links", async ({
  page,
}) => {
  await page.goto("/vacancies");
  await expect(page.getByText("All Vacancies")).toBeVisible();
  await expect(page.getByText(/Official directory/i).first()).toBeVisible();

  await page.goto("/opportunities/odisha-public-service-commission-recruitment-notices");
  await expect(page.getByRole("heading", { name: /Odisha Public/i })).toBeVisible();
  await page.getByRole("button", { name: /View Official Notice/i }).click();
  await expect(page.getByRole("heading", { name: /You are leaving AwsarSetu/i })).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Continue to official source/i }),
  ).toHaveAttribute("target", "_blank");
});

test("account shows truthful notification configuration state", async ({ page }) => {
  await page.goto("/account");
  await expect(
    page.getByRole("heading", { name: "Opportunity Compass" }),
  ).toBeVisible();
  await expect(
    page.getByText(/Notifications are not configured yet/i),
  ).toBeVisible();
});

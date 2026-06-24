import { expect, test } from "@playwright/test";

test("guest can browse, set profile signals, save locally and view tracker", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: /Find opportunities made for your next step/i,
    }),
  ).toBeVisible();
  await expect(page.getByText("Start where you are")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Trusted official pathways" }),
  ).toBeVisible();

  await page.goto("/explore");
  await page.getByRole("button", { name: /For You/i }).click();
  await expect(
    page.getByRole("heading", { name: /Set up profile preferences/i }),
  ).toBeVisible();

  await page.getByLabel("State").selectOption("Odisha");
  await page.getByLabel("Age band").selectOption("18-24");
  await page.getByLabel("Education level").selectOption("graduate");
  await page.getByLabel("Current role").selectOption("job-seeker");
  await page
    .getByRole("button", { name: /Government Jobs and Vacancies/i })
    .click();
  await page.getByRole("button", { name: /Use these signals/i }).click();

  await expect(page).toHaveURL(/lens=for-you/);
  await expect(page.getByText(/likely and possible matches/i)).toBeVisible();

  await page.getByPlaceholder(/Search scholarships/i).fill("Odisha");
  await expect(
    page.getByRole("link", { name: /Odisha Public Service/i }).first(),
  ).toBeVisible();

  await page.getByRole("button", { name: /^Save$/i }).first().click();
  await page.goto("/saved");
  await expect(page.getByText(/Notes and reminder/i)).toBeVisible();
});

test("state selector changes discovery context without hard-coded profile copy", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("header").getByRole("button", { name: /India/i }).click();
  await page.getByPlaceholder(/Search Odisha/i).fill("Kerala");
  await page.getByRole("button", { name: "Kerala" }).click();
  await expect(
    page.locator("header").getByRole("button", { name: /Kerala/i }),
  ).toBeVisible();
  await expect(page.getByText(/Odisha \/ Age 19/i)).toHaveCount(0);
});

test("explore URL filters control search, sorting and filter sheet", async ({
  page,
}) => {
  await page.goto(
    "/explore?q=Odisha&category=government-jobs-vacancies&state=Odisha&ageBand=18-24&benefit=job&sort=best",
  );

  await expect(page.getByPlaceholder(/Search scholarships/i)).toHaveValue(
    "Odisha",
  );
  await expect(page.getByLabel("Sort opportunities")).toHaveValue("best");
  await expect(page.getByRole("link", { name: /Odisha Public/i })).toBeVisible();

  await page.getByRole("button", { name: /Filters/i }).click();
  await expect(page.getByLabel("Category")).toHaveValue(
    "government-jobs-vacancies",
  );
  await expect(page.getByLabel("Location")).toHaveValue("Odisha");
  await expect(page.getByLabel("Age band")).toHaveValue("18-24");
  await expect(page.getByLabel("Benefit type")).toHaveValue("job");
  await expect(page.getByLabel("Status")).not.toContainText(
    "development-sample",
  );

  await page.getByLabel("Role").selectOption("job-seeker");
  await expect(page).toHaveURL(/role=job-seeker/);
  await page
    .getByLabel("Filters", { exact: true })
    .getByRole("button", { name: "Reset" })
    .click();
  await expect(page).not.toHaveURL(/q=Odisha/);
});

test("vacancy and detail pages use source preflight before external links", async ({
  page,
}) => {
  await page.goto("/vacancies");
  await expect(page.getByText("All vacancies")).toBeVisible();
  await expect(page.getByText(/Official directory/i).first()).toBeVisible();

  await page.goto(
    "/opportunities/odisha-public-service-commission-recruitment-notices",
  );
  await expect(
    page.getByRole("heading", { name: /Odisha Public/i }),
  ).toBeVisible();
  await page.getByRole("button", { name: /View Official Notice/i }).first().click();
  await expect(
    page.getByRole("heading", { name: /You are leaving AwsarSetu/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Continue to official source/i }),
  ).toHaveAttribute("target", "_blank");
});

test("account shows truthful notification configuration state", async ({ page }) => {
  await page.goto("/account");
  await expect(page.getByRole("heading", { name: "Account" })).toBeVisible();
  await expect(page.getByText("Profile preferences")).toBeVisible();
  await expect(
    page.getByText(/Notifications are not configured yet/i),
  ).toBeVisible();
});

test("keyboard escape closes major overlays", async ({ page }) => {
  await page.goto("/");
  await page.locator("header").getByRole("button", { name: /India/i }).click();
  await expect(
    page.getByRole("heading", { name: /Choose your state/i }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("heading", { name: /Choose your state/i }),
  ).toHaveCount(0);

  await page.goto("/explore");
  await page.getByRole("button", { name: /Filters/i }).click();
  await expect(page.getByRole("heading", { name: "Filters" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("heading", { name: "Filters" })).toHaveCount(0);

  await page.goto(
    "/opportunities/odisha-public-service-commission-recruitment-notices",
  );
  await page.getByRole("button", { name: /View Official Notice/i }).first().click();
  await expect(
    page.getByRole("heading", { name: /You are leaving AwsarSetu/i }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("heading", { name: /You are leaving AwsarSetu/i }),
  ).toHaveCount(0);
});

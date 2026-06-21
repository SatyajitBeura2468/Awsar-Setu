import { expect, test } from "@playwright/test";

test("guest can browse, switch language, save locally and open details", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: /Find opportunities made for your next step/i,
    }),
  ).toBeVisible();

  await page.getByRole("button", { name: "हिंदी" }).click();
  await expect(page.getByText("अपने अगले कदम के लिए बने अवसर")).toBeVisible();
  await page.getByRole("button", { name: "EN", exact: true }).click();

  await page.goto("/explore");
  await expect(page.getByRole("heading", { name: /Explore/i })).toBeVisible();
  await page.getByPlaceholder(/Search scholarships/i).fill("Odisha");
  await expect(page.getByText(/Odisha Public Service Commission/i)).toBeVisible();

  await page.getByRole("button", { name: /Save/i }).first().click();
  await page.goto("/saved");
  await expect(page.getByText(/Private notes/i)).toBeVisible();
});

test("vacancy and detail pages show official-source actions", async ({ page }) => {
  await page.goto("/vacancies");
  await expect(page.getByText("All Vacancies")).toBeVisible();
  await expect(page.getByText(/Recruiting authority/i).first()).toBeVisible();

  await page.goto("/opportunities/odisha-public-service-commission-recruitment-notices");
  await expect(page.getByRole("heading", { name: /Odisha Public/i })).toBeVisible();
  await expect(
    page.getByRole("link", { name: /View Official Notice/i }),
  ).toHaveAttribute("target", "_blank");
  await expect(page.getByText(/Opens the official source/i)).toBeVisible();
});

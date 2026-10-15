import { expect, test } from "@playwright/test";

// smoke test: checks that application runs
test("visitor can see the user creation form", async ({ page }) => {
  // Arrange and act: open the homepage in a fresh browser context.
  await page.goto("/");

  // Assert: verify the user-visible result.
  await expect(
    page.getByRole("button", { name: "Create User" }),
  ).toBeVisible();
});

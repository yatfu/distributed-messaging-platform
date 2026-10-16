import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

async function createUser(page: Page, name: string) {
  await page.goto("/");
  await page.getByRole("textbox").fill(name);
  await page.getByRole("button", { name: "Create User" }).click();
  await expect(
    page.getByRole("button", { name: "Create Room" }),
  ).toBeVisible();
}

async function createRoom(page: Page, name: string) {
  await page.getByRole("textbox").fill(name);
  await page.getByRole("button", { name: "Create Room" }).click();
  await expect(page).toHaveURL(/\/chatrooms\/[0-9a-f-]+$/);
  await expect(page.getByRole("heading", { name })).toBeVisible();
}

test.describe("user creation errors", () => {
  test("rejects an empty display name", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Create User" }).click();

    await expect(page.getByRole("alert")).toHaveText(
      "Could not create user. Please try again.",
    );
    await expect(
      page.getByRole("button", { name: "Create User" }),
    ).toBeVisible();
  });

  test("rejects a display name longer than 20 characters", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("textbox").fill("A".repeat(21));
    await page.getByRole("button", { name: "Create User" }).click();

    await expect(page.getByRole("alert")).toHaveText(
      "Could not create user. Please try again.",
    );
  });
});

test.describe("room errors", () => {
  test("rejects an empty room name", async ({ page }) => {
    await createUser(page, `User ${Date.now()}`);
    await page.getByRole("button", { name: "Create Room" }).click();

    await expect(page.getByRole("alert")).toHaveText(
      "Could not create room. Please try again.",
    );
  });

  test("rejects a room name longer than 50 characters", async ({ page }) => {
    await createUser(page, `User ${Date.now()}`);
    await page.getByRole("textbox").fill("R".repeat(51));
    await page.getByRole("button", { name: "Create Room" }).click();

    await expect(page.getByRole("alert")).toHaveText(
      "Could not create room. Please try again.",
    );
  });

  test("shows an error for an invalid room URL", async ({ page }) => {
    await page.goto("/chatrooms/not-a-valid-uuid");

    await expect(
      page.getByText("Could not load room or messages"),
    ).toBeVisible();
  });

  test("shows an error for a missing room", async ({ page }) => {
    await page.goto("/chatrooms/550e8400-e29b-41d4-a716-446655440000");

    await expect(
      page.getByText("Could not load room or messages"),
    ).toBeVisible();
  });
});

test.describe("message errors and authorization", () => {
  test("prevents submitting an empty message", async ({ page }) => {
    const uniqueValue = Date.now();
    await createUser(page, `User ${uniqueValue}`);
    await createRoom(page, `Test Room ${uniqueValue}`);

    const messageInput = page.getByPlaceholder("Type your message...");
    await page.getByRole("button", { name: "Send" }).click();

    const valueIsMissing = await messageInput.evaluate(
      (element) => (element as HTMLInputElement).validity.valueMissing,
    );
    expect(valueIsMissing).toBe(true);
    await expect(page.getByText("No messages yet.")).toBeVisible();
  });

  test("hides message deletion from a different user", async ({
    browser,
    page,
  }) => {
    const uniqueValue = Date.now();
    const messageContent = `Owner message ${uniqueValue}`;

    await createUser(page, `Owner ${uniqueValue}`);
    await createRoom(page, `Shared Room ${uniqueValue}`);
    await page.getByPlaceholder("Type your message...").fill(messageContent);
    await page.getByRole("button", { name: "Send" }).click();
    await expect(
      page.getByText(`content: ${messageContent}`, { exact: true }),
    ).toBeVisible();

    const roomUrl = page.url();
    const secondUserContext = await browser.newContext();
    const secondUserPage = await secondUserContext.newPage();

    try {
      await createUser(secondUserPage, `Guest ${uniqueValue}`);
      await secondUserPage.goto(roomUrl);

      await expect(
        secondUserPage.getByText(`content: ${messageContent}`, { exact: true }),
      ).toBeVisible();
      await expect(
        secondUserPage.getByRole("button", { name: "Delete" }),
      ).toHaveCount(0);
    } finally {
      await secondUserContext.close();
    }
  });
});

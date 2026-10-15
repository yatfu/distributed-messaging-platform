import { expect, test } from "@playwright/test";

test("messages synchronize between users", async ({ browser }) => {
  const contextA = await browser.newContext();
  const contextB = await browser.newContext();
  try {
    // because context is manually opened, it has to be manually closed. try/finally is used to handle manual closing
    const pageA = await contextA.newPage();
    const pageB = await contextB.newPage();

    //both users connect to homepage
    await pageA.goto("/");
    await pageB.goto("/");

    //users create accounts
    await pageA.getByRole("textbox").fill("User A");
    await pageA.getByRole("button", { name: "Create User" }).click();

    await pageB.getByRole("textbox").fill("User B");
    await pageB.getByRole("button", { name: "Create User" }).click();

    //users can see room creation ui
    await expect(
      pageA.getByRole("button", { name: "Create Room" })
    ).toBeVisible();
    await expect(
      pageB.getByRole("button", { name: "Create Room" })
    ).toBeVisible();

    //User A creates a room
    await pageA.getByRole("textbox").fill("Test Room A");
    await pageA.getByRole("button", { name: "Create Room" }).click();

    //User A is navigated to URL containing generated UUID
    await expect(pageA).toHaveURL(/\/chatrooms\/[0-9a-f-]+$/); // UUID expression

    //confirm room is loaded
    await expect(
      pageA.getByRole("heading", { name: "Test Room A" })
    ).toBeVisible(); // same name as line 21

    //User B opens the room created by room A
    const roomUrl = pageA.url();

    await pageB.goto(roomUrl);
    await expect(
      pageB.getByRole("heading", { name: "Test Room A" })
    ).toBeVisible();

    //User A creates a message
    const messageContent = `${Date.now()}`;

    await pageA.getByPlaceholder("Type your message...").fill(messageContent);
    await pageA.getByRole("button", { name: "Send" }).click();

    //confirm User B gets the message without reloading
    const messageOnB = pageB.getByText(messageContent);
    await expect(messageOnB).toBeVisible();

    //confirm deletion works without refreshing
    await pageA.getByRole("button", { name: "Delete" }).click();

    await expect(messageOnB).not.toBeVisible();
    await expect(pageB.getByText("No messages yet.")).toBeVisible();
    
  } finally {
    await contextA.close();
    await contextB.close();
  }
});

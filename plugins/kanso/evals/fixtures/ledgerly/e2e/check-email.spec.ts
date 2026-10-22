import { expect, test } from "@playwright/test";

test("send again waits for the gate", async ({ page }) => {
  await page.goto("/sign-in");
  await page.getByLabel("Email").fill("mara.okafor@example.com");
  await page.getByRole("button", { name: "Send link" }).click();
  await expect(page.getByText("Check your email")).toBeVisible();
  await expect(page.getByRole("button", { name: "Send again" })).toBeEnabled({ timeout: 35_000 });
});

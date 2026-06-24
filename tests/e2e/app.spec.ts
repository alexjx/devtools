import { expect, test } from "@playwright/test";

test.describe("app shell", () => {
  test("loads, opens the command palette, and opens a tool", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1, name: /regex101/i })).toBeVisible();

    await page.getByRole("button", { name: /search tools/i }).click();

    await expect(page.getByRole("dialog", { name: /command palette/i })).toBeVisible();

    await page.getByRole("button", { name: /base64/i }).first().click();

    await expect(page.getByRole("heading", { level: 1, name: /base64/i })).toBeVisible();
  });

  test("converts pasted China log time to UTC", async ({ page }) => {
    await page.goto("/#/timestamp");

    await page.getByLabel(/pasted time/i).fill("2026-06-24 12:00:00");
    await page.getByLabel(/source for plain log time/i).selectOption("china");
    await page.getByLabel(/output format/i).selectOption("log");

    await expect(page.getByLabel(/parsed time/i)).toContainText("China time");
    await expect(page.getByLabel(/converted time zones/i)).toContainText("2026-06-24 04:00:00 UTC+00:00");
  });

  test("adds and removes output time zones", async ({ page }) => {
    await page.goto("/#/timestamp");

    await page.getByLabel(/add output timezone/i).fill("Asia/Tokyo");
    await page.getByRole("button", { name: /^add$/i }).click();

    await expect(page.getByLabel(/output time zones/i)).toContainText("Asia/Tokyo");
    await expect(page.getByLabel(/converted time zones/i)).toContainText("Asia/Tokyo");

    await page.getByRole("button", { name: /remove Asia\/Tokyo/i }).click();

    await expect(page.getByLabel(/output time zones/i)).not.toContainText("Asia/Tokyo");
  });

  test("extracts a timestamp from a pasted log line", async ({ page }) => {
    await page.goto("/#/timestamp");

    await page.getByLabel(/pasted time/i).fill("INFO 2026/06/24 12:00:00,123 request done");
    await page.getByLabel(/source for plain log time/i).selectOption("china");
    await page.getByLabel(/output format/i).selectOption("log");

    await expect(page.getByLabel(/parsed time/i)).toContainText("2026-06-24 12:00:00.123");
    await expect(page.getByLabel(/converted time zones/i)).toContainText("2026-06-24 04:00:00 UTC+00:00");
  });

  test("persists time settings but not pasted input", async ({ page }) => {
    await page.goto("/#/timestamp");

    await page.evaluate(() => localStorage.clear());
    await page.reload();

    await page.getByLabel(/pasted time/i).fill("secret log 2026-06-24 01:53:37,918");
    await page.getByLabel(/source for plain log time/i).selectOption("utc");
    await page.getByLabel(/output format/i).selectOption("iso");
    await page.getByLabel(/add output timezone/i).fill("Europe/London");
    await page.getByRole("button", { name: /^add$/i }).click();

    await expect(page.getByLabel(/output time zones/i)).toContainText("Europe/London");

    await page.reload();

    await expect(page.getByLabel(/source for plain log time/i)).toHaveValue("utc");
    await expect(page.getByLabel(/output format/i)).toHaveValue("iso");
    await expect(page.getByLabel(/output time zones/i)).toContainText("Europe/London");
    await expect(page.getByLabel(/pasted time/i)).toHaveValue("2026-06-24 12:00:00");
  });

  test("does not repeat Unix values in per-timezone copy output", async ({ page }) => {
    await page.goto("/#/timestamp");

    await page.evaluate(() => localStorage.clear());
    await page.reload();

    await page.getByLabel(/output format/i).selectOption("all");

    await expect(page.getByLabel(/parsed time/i)).toContainText("1782273600");
    await expect(page.getByLabel(/parsed time/i)).toContainText("1782273600000");
    await expect(page.getByLabel(/converted time zones/i)).toContainText("UTC");
    await expect(page.getByLabel(/converted time zones/i)).toContainText("China");
    await expect(page.getByLabel(/converted time zones/i)).not.toContainText("Unix seconds");
    await expect(page.getByLabel(/converted time zones/i)).not.toContainText("Unix milliseconds");
  });

  test("shows top-right copy buttons for parsed and timezone values", async ({ page }) => {
    await page.goto("/#/timestamp");

    await page.evaluate(() => localStorage.clear());
    await page.reload();

    const parsed = page.getByLabel(/parsed time/i);
    await expect(parsed.getByRole("button", { name: /copy unix seconds/i })).toBeVisible();
    await expect(parsed.getByRole("button", { name: /copy unix milliseconds/i })).toBeVisible();
    await expect(page.getByLabel(/converted time zones/i).getByRole("button", { name: /copy UTC/i })).toBeVisible();
  });

  test("generates and downloads a local QR code", async ({ page }) => {
    await page.goto("/#/qr");

    await expect(page.getByRole("heading", { level: 1, name: /qr code/i })).toBeVisible();
    await expect(page.getByLabel(/url/i)).toHaveValue("");
    await expect(page.getByText(/enter content to generate a qr code/i)).toBeVisible();

    await page.getByRole("button", { name: /sample url/i }).click();
    await expect(page.getByLabel(/url/i)).toHaveValue("https://example.com");
    await page.getByRole("button", { name: /clear/i }).click();

    await page.getByRole("button", { name: /^sms$/i }).click();
    await page.getByLabel(/phone number/i).fill("+1 (415) 555-0100");
    await page.getByLabel(/message/i).fill("Ship it");

    await expect(page.getByLabel(/qr preview/i).getByAltText(/generated qr code/i)).toBeVisible();
    await expect(page.getByText("sms:+14155550100?body=Ship+it")).toBeVisible();

    const download = page.waitForEvent("download");
    await page.getByRole("button", { name: /^svg$/i }).click();
    const file = await download;

    expect(file.suggestedFilename()).toBe("qr-code.svg");
  });
});

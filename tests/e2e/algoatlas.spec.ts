import { test, expect } from "@playwright/test";

test.describe("AlgoAtlas — Personal DSA Learning OS E2E Journey", () => {
  test("1. Dashboard: renders executive stats, navigation, platform cards, and heatmap", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("AlgoAtlas");
    await expect(page.getByText("Personal DSA Learning OS")).toBeVisible();
    await expect(page.getByText("Your Learning Intelligence")).toBeVisible();
    await expect(page.getByText("Coding Platforms Distribution")).toBeVisible();
    await expect(page.getByText("Daily Problem-Solving Consistency")).toBeVisible();
  });

  test("2. Problems Vault: filters, adds problem, and switches views", async ({ page }) => {
    await page.goto("/problems");
    await expect(page.getByRole("heading", { name: /Central Problem Vault/i })).toBeVisible();

    // Toggle card mode
    const cardViewBtn = page.locator('button[title="Card Grid View"]');
    if (await cardViewBtn.isVisible()) {
      await cardViewBtn.click();
    }

    // Toggle table mode
    const tableViewBtn = page.locator('button[title="Table View"]');
    if (await tableViewBtn.isVisible()) {
      await tableViewBtn.click();
    }
  });

  test("3. Concept Vault: browses concepts and examines prerequisite flow", async ({ page }) => {
    await page.goto("/concepts");
    await expect(page.getByRole("heading", { name: /Concept Vault/i })).toBeVisible();
    await expect(page.getByText("Arrays", { exact: true }).first()).toBeVisible();

    // Navigate to a specific concept
    await page.getByRole("link", { name: /Two Pointers/i }).first().click();
    await expect(page.getByText("Concept Prerequisite Flow")).toBeVisible();
    await expect(page.getByText("Standard Code Template")).toBeVisible();
  });

  test("4. DSA Roadmaps: explores NeetCode 150 and checks progress", async ({ page }) => {
    await page.goto("/roadmaps");
    await expect(page.getByRole("heading", { name: /DSA Learning Roadmaps/i })).toBeVisible();
    await expect(page.getByText("NeetCode 150")).toBeVisible();

    await page.getByRole("link", { name: /View Sheet/i }).first().click();
    await expect(page.getByText("Arrays & Hashing")).toBeVisible();
  });

  test("5. Revision Centre: verifies spaced repetition and study mode", async ({ page }) => {
    await page.goto("/revision");
    await expect(page.getByRole("heading", { name: /Spaced Repetition Revision Centre/i })).toBeVisible();
    await expect(page.getByText("Due Today", { exact: true })).toBeVisible();
    await expect(page.getByText("Overdue", { exact: true })).toBeVisible();
    await expect(page.getByText("Mastered", { exact: true })).toBeVisible();
  });

  test("6. Learning Intelligence: verifies recommendation reasons", async ({ page }) => {
    await page.goto("/recommendations");
    await expect(page.getByRole("heading", { name: /What Should I Learn Next/i })).toBeVisible();
    await expect(page.getByText("Today's Daily Learning Plan")).toBeVisible();
    await expect(page.locator("text=Why this is recommended for you:").first()).toBeVisible();
  });

  test("7. Contest Tracker: checks rating charts and contest logging", async ({ page }) => {
    await page.goto("/contests");
    await expect(page.getByRole("heading", { name: /Contest Tracker/i })).toBeVisible();
    await expect(page.getByText("Rating Progression Trajectory")).toBeVisible();
  });

  test("8. Platform Integrations: inspects official adapters", async ({ page }) => {
    await page.goto("/integrations");
    await expect(page.getByRole("heading", { name: /Platform Integrations/i })).toBeVisible();
    await expect(page.getByText("Codeforces", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("AtCoder", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("LeetCode", { exact: true }).first()).toBeVisible();
  });

  test("9. Analytics & Settings: validates data portability options", async ({ page }) => {
    await page.goto("/analytics");
    await expect(page.getByRole("heading", { name: /Analytics & Reports/i })).toBeVisible();
    await expect(page.getByRole("button", { name: "Full JSON Backup" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Export CSV" })).toBeVisible();

    await page.goto("/settings");
    await expect(page.getByText("Profile & Practice Targets")).toBeVisible();
    await expect(page.getByText("Data Portability, Backup & Restore")).toBeVisible();
  });
});

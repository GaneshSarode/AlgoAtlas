import { test } from "@playwright/test";
import path from "path";
import fs from "fs";

const outputDir = path.resolve(
  "C:/Users/Ganesh Ashok Sarode/.gemini/antigravity/brain/45b5e3cd-308c-4097-b089-067f1874e1c8/screenshots/concepts"
);

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

test.describe("Capture 3 Dashboard Design Concepts", () => {
  test("capture Concept A - The Linear Cockpit", async ({ page }) => {
    await page.goto("/dashboard-preview/concept-a", { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    const filePath = path.join(outputDir, "concept_a_linear_cockpit.png");
    await page.screenshot({ path: filePath, fullPage: false });
  });

  test("capture Concept B - The Competitive Arena", async ({ page }) => {
    await page.goto("/dashboard-preview/concept-b", { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    const filePath = path.join(outputDir, "concept_b_competitive_arena.png");
    await page.screenshot({ path: filePath, fullPage: false });
  });

  test("capture Concept C - The Algorithm Researcher", async ({ page }) => {
    await page.goto("/dashboard-preview/concept-c", { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    const filePath = path.join(outputDir, "concept_c_algorithm_researcher.png");
    await page.screenshot({ path: filePath, fullPage: false });
  });
});

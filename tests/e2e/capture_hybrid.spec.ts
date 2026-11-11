import { test } from "@playwright/test";
import path from "path";
import fs from "fs";

const outputDir = path.resolve(
  "C:/Users/Ganesh Ashok Sarode/.gemini/antigravity/brain/45b5e3cd-308c-4097-b089-067f1874e1c8/screenshots"
);

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

test.describe("Capture Hybrid Dashboard at 1440px", () => {
  test("capture hybrid dashboard at 1440px resolution (Dark & Light)", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/dashboard-preview/hybrid", { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    const filePath = path.join(outputDir, "hybrid_dashboard_1440.png");
    await page.screenshot({ path: filePath, fullPage: false });
    
    const fullPagePath = path.join(outputDir, "hybrid_dashboard_1440_fullpage.png");
    await page.screenshot({ path: fullPagePath, fullPage: true });

    // Toggle to Light Theme
    await page.evaluate(() => {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      localStorage.setItem("algoatlas-theme", "light");
    });
    await page.waitForTimeout(400);
    const lightPath = path.join(outputDir, "hybrid_dashboard_1440_light.png");
    await page.screenshot({ path: lightPath, fullPage: true });
  });
});

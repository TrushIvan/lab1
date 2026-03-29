import { test, expect } from "@playwright/test";

test("користувач може додати нову задачу", async ({ page }) => {
  await page.goto("/");

  await page.getByTestId("task-input").fill("Підготувати звіт");
  await page.getByTestId("add-btn").click();

  await expect(page.getByText("Підготувати звіт")).toBeVisible();
  await expect(page.locator("#total-count")).toHaveText("1");
  await expect(page.locator("#completed-count")).toHaveText("0");
  await expect(page.locator("#progress-count")).toHaveText("0%");
});

test("користувач може відмітити задачу як виконану", async ({ page }) => {
  await page.goto("/");

  await page.getByTestId("task-input").fill("Здати лабу");
  await page.getByTestId("add-btn").click();

  await page.getByRole("button", { name: "Виконати" }).click();

  await expect(page.locator("#completed-count")).toHaveText("1");
  await expect(page.locator("#progress-count")).toHaveText("100%");
});
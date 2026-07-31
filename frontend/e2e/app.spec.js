import { test, expect } from "@playwright/test";

const ADMIN_EMAIL = "admin@hospital.com";
const ADMIN_PASSWORD = "admin123";

test.describe("Hospital Management System", () => {
  test("Landing page loads with features", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Manage Your Hospital");
    const features = page.locator("h3");
    await expect(features.first()).toBeVisible();
    await expect(page.getByRole("button", { name: "Start Free", exact: true }).first()).toBeVisible();
    await expect(page.getByRole("banner").getByRole("button", { name: "Sign In" })).toBeVisible();
  });

  test("Login form works", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator('[data-slot="card-title"]')).toHaveText("Sign in to HMS");
    await page.fill("input[type=email]", ADMIN_EMAIL);
    await page.fill("input[type=password]", ADMIN_PASSWORD);
    await page.click("button[type=submit]");
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("Register page has form", async ({ page }) => {
    await page.goto("/register");
    await expect(page.locator('[data-slot="card-title"]')).toHaveText("Create Hospital Account");
    await expect(page.locator("#hospitalName")).toBeVisible();
    await expect(page.locator("#name")).toBeVisible();
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();
    await expect(page.locator("#phone")).toBeVisible();
  });

  test.describe("Authenticated flows", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/login");
      await page.fill("input[type=email]", ADMIN_EMAIL);
      await page.fill("input[type=password]", ADMIN_PASSWORD);
      await page.click("button[type=submit]");
      await expect(page).toHaveURL(/\/dashboard/);
    });

    test("Dashboard shows stats cards", async ({ page }) => {
      await expect(page.locator("h2")).toContainText("Hospital");
      const cards = page.locator('[data-slot="card"]');
      await expect(cards).toHaveCount(4);
      await expect(cards.first().locator("p")).toHaveText("Patients");
    });

    test("Patients page shows list", async ({ page }) => {
      await page.click("text=Patients");
      await expect(page.locator('[data-slot="card-title"]')).toHaveText("Patients");
      const rows = page.locator("table tbody tr");
      await expect(rows.first()).toBeVisible();
    });

    test("Add a new patient", async ({ page }) => {
      await page.click("text=Add Patient");
      await expect(page.locator('[data-slot="card-title"]')).toHaveText("Add Patient");
      await page.fill('input[placeholder="Full name"]', "Test Patient E2E");
      await page.fill('input[placeholder="Age"]', "30");
      await page.selectOption("select", "Male");
      await page.click("button[type=submit]");
      await expect(page.locator("text=Patient added successfully")).toBeVisible();
    });

    test("Doctors page shows list", async ({ page }) => {
      await page.click("text=Doctors");
      await expect(page.locator('[data-slot="card-title"]')).toHaveText("Doctors");
      const rows = page.locator("table tbody tr");
      await expect(rows.first()).toBeVisible();
      const badge = page.locator('[data-slot="badge"]').first();
      await expect(badge).toBeVisible();
    });

    test("Book an appointment", async ({ page }) => {
      await page.click("text=Book Appointment");
      await expect(page.locator('[data-slot="card-title"]')).toHaveText("Book Appointment");
      await page.waitForTimeout(1000);
      const patientSelect = page.locator("select").nth(0);
      const doctorSelect = page.locator("select").nth(1);
      await patientSelect.waitFor({ state: "visible" });
      await doctorSelect.waitFor({ state: "visible" });
      const patientOptions = await patientSelect.locator("option").all();
      if (patientOptions.length > 1) await patientSelect.selectOption({ index: 1 });
      const doctorOptions = await doctorSelect.locator("option").all();
      if (doctorOptions.length > 1) await doctorSelect.selectOption({ index: 1 });
      await page.fill("input[type=date]", "2026-09-01");
      await page.click("button[type=submit]");
      await expect(page.locator("p")).toContainText("successfully", { timeout: 8000 });
    });

    test("Appointments page shows list", async ({ page }) => {
      await page.click("text=Appointments");
      await expect(page.locator('[data-slot="card-title"]')).toHaveText("Appointments");
    });

    test("Admin page shows user management", async ({ page }) => {
      await page.click("text=Admin");
      await expect(page.locator('[data-slot="card-title"]')).toHaveText("Manage Users");
      const rows = page.locator("table tbody tr");
      await expect(rows.first()).toBeVisible();
    });

    test("Logout works", async ({ page }) => {
      await page.click("text=Logout");
      await expect(page.locator("h1")).toContainText("Manage Your Hospital");
    });
  });
});
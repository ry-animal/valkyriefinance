import { test, expect } from '@playwright/test';

test.describe('Zustand Stores', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/stores');
  });

  test('should display store state examples', async ({ page }) => {
    // Should show all four store examples
    await expect(page.locator('text=Auth Store Example')).toBeVisible();
    await expect(page.locator('text=UI Store Example')).toBeVisible();
    await expect(page.locator('text=Portfolio Store Example')).toBeVisible();
    await expect(page.locator('text=Web3 Store Example')).toBeVisible();

    // Check for key elements using more specific selectors
    await expect(page.locator('text=Not Authenticated')).toBeVisible();
    await expect(page.locator('text=Active Modal:')).toBeVisible();
    await expect(page.locator('text=Selected Portfolio:')).toBeVisible();
    await expect(page.locator('text=Connection Status:')).toBeVisible();
  });

  test('should handle auth store actions', async ({ page }) => {
    // Test login functionality
    await page.click('button:has-text("Mock Login")');
    await expect(page.locator('text=demo@example.com')).toBeVisible();
    await expect(page.locator('text=Authenticated')).toBeVisible();

    // Test logout functionality
    await page.click('button:has-text("Logout")');
    await expect(page.locator('text=Not Authenticated')).toBeVisible();
  });

  test('should handle UI store actions', async ({ page }) => {
    // Test notification system
    await page.click('button:has-text("Add Notification")');
    await expect(page.locator('text=Success!')).toBeVisible();

    // Test modal functionality
    await page.click('button:has-text("Open Modal")');
    await expect(page.locator('text=create-portfolio')).toBeVisible();

    await page.click('button:has-text("Close Modal")');
    // Check specifically for the modal None badge, not the portfolio one
    await expect(page.locator('text=Active Modal:').locator('..').locator('text=None')).toBeVisible();
  });

  test('should handle portfolio store actions', async ({ page }) => {
    // Test portfolio creation by filling input and clicking button
    await page.fill('input[placeholder="Portfolio name"]', 'Test Portfolio');
    await page.click('button:has-text("Add Portfolio")');
    await expect(page.locator('button:has-text("Test Portfolio")')).toBeVisible();

    // Test portfolio selection
    await page.click('button:has-text("Test Portfolio")');
    // Should update the selected portfolio display in the badge
    await expect(page.locator('text=Test Portfolio').nth(1)).toBeVisible();
  });

  test('should handle Web3 store actions', async ({ page }) => {
    // Test wallet connection simulation
    await page.click('button:has-text("Mock Connect")');
    await expect(page.locator('text=Connected')).toBeVisible();
    await expect(page.locator('text=0x1234567890123456789012345678901234567890')).toBeVisible();

    await page.click('button:has-text("Disconnect")');
    await expect(page.locator('text=Disconnected')).toBeVisible();
  });

  test('should show auto-removing notifications', async ({ page }) => {
    // Add a notification
    await page.click('button:has-text("Add Notification")');
    await expect(page.locator('text=Success!')).toBeVisible();

    // Should auto-remove after 5 seconds (we'll wait a bit longer to be safe)
    await page.waitForTimeout(6000);
    await expect(page.locator('text=Success!')).toHaveCount(0);
  });
}); 
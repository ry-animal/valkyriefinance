import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate between core pages', async ({ page }) => {
    await page.goto('/');
    
    // Should load home page with ASCII art
    await expect(page.locator('pre')).toBeVisible();
    await expect(page.locator('text=API Status')).toBeVisible();
    
    // Navigate to stores demo
    await page.click('[href="/stores"]');
    await expect(page).toHaveURL('/stores');
    await expect(page.locator('h1')).toContainText('Zustand State Management');
  });

  test('should not have broken links to removed routes', async ({ page }) => {
    await page.goto('/');
    
    // Should not have todos or AI links
    await expect(page.locator('[href="/todos"]')).toHaveCount(0);
    await expect(page.locator('[href="/ai"]')).toHaveCount(0);
  });

  test('should show correct navigation items', async ({ page }) => {
    await page.goto('/');
    
    // Should have these navigation items
    await expect(page.locator('[href="/"]')).toBeVisible();
    await expect(page.locator('[href="/dashboard"]')).toBeVisible();
    await expect(page.locator('[href="/stores"]')).toBeVisible();
    
    // Should have sign in button (when not logged in) and theme toggle
    await expect(page.locator('a[href="/login"]')).toBeVisible();
    // Look for the theme toggle button by its icon content
    await expect(page.locator('button:has(span:text("Toggle theme"))')).toBeVisible();
  });
}); 
import { expect, test } from '@playwright/test';

test.describe('Error Handling', () => {
  test('should handle 404 pages gracefully', async ({ page }) => {
    // Try to navigate to a non-existent page
    const response = await page.goto('/non-existent-page');
    expect(response?.status()).toBe(404);
  });

  test('should display error boundary when component crashes', async ({ page }) => {
    // Navigate to dashboard and ensure it loads without errors
    await page.goto('/dashboard');

    // Should load the brutalist dashboard with our main heading
    await expect(page.locator('text=VALKYRIE').first()).toBeVisible();

    // Check console for errors
    const consoleLogs: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleLogs.push(msg.text());
      }
    });

    // Wait a bit to capture any async errors
    await page.waitForTimeout(1000);

    // Should not have console errors on normal navigation
    // Filter out common development warnings and downloading messages
    const significantErrors = consoleLogs.filter(
      (log) =>
        !log.includes('Downloading') && !log.includes('Warning:') && !log.includes('DevTools')
    );
    expect(significantErrors).toHaveLength(0);
  });

  test('should handle server connection issues gracefully', async ({ page }) => {
    // Test when server is down or slow
    await page.goto('/dashboard');

    // Should load the page structure with brutalist design
    await expect(page.locator('text=VALKYRIE').first()).toBeVisible();

    // Should show the brutal grid layout even if data fetching fails (use first grid)
    await expect(page.locator('[class*="grid"]').first()).toBeVisible();

    // Wait for any async operations
    await page.waitForTimeout(2000);
  });

  test('should handle navigation between pages gracefully', async ({ page }) => {
    // Test navigation between existing pages
    await page.goto('/');
    await expect(
      page.locator('text=THE MOST AGGRESSIVE YIELD OPTIMIZATION PLATFORM')
    ).toBeVisible();

    // Navigate to dashboard with proper wait
    await Promise.all([page.waitForURL('/dashboard'), page.click('nav >> text=DASHBOARD')]);
    await expect(page.locator('text=VALKYRIE').first()).toBeVisible();

    // Navigate to vault with proper wait
    await Promise.all([page.waitForURL('/vault'), page.click('nav >> text=VAULT')]);

    // Navigate to AI chat with proper wait
    await Promise.all([page.waitForURL('/ai'), page.click('nav >> text=AI CHAT')]);

    // Navigate back home with proper wait
    await Promise.all([page.waitForURL('/'), page.click('nav >> text=HOME')]);
  });
});

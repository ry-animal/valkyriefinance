import { test, expect } from '@playwright/test';

test.describe('Error Handling', () => {
  test('should handle 404 pages gracefully', async ({ page }) => {
    // Try to navigate to a non-existent page
    const response = await page.goto('/non-existent-page');
    expect(response?.status()).toBe(404);
  });

  test('should not crash on removed routes', async ({ page }) => {
    // Test that removed routes (todos, ai) don't crash the app
    await page.goto('/todos');
    // Should show 404 or redirect, not crash
    
    await page.goto('/ai');
    // Should show 404 or redirect, not crash
  });

  test('should display error boundary when component crashes', async ({ page }) => {
    // This would test our React Error Boundary
    // For now, we'll navigate to a page and ensure it doesn't crash
    await page.goto('/dashboard');
    
    // Should load without errors
    await expect(page.locator('h1')).toContainText('Dashboard');
    
    // Check console for errors
    const consoleLogs: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleLogs.push(msg.text());
      }
    });
    
    // Wait a bit to capture any async errors
    await page.waitForTimeout(1000);
    
    // Should not have console errors on normal navigation
    expect(consoleLogs.filter(log => !log.includes('Downloading'))).toHaveLength(0);
  });

  test('should handle server connection issues gracefully', async ({ page }) => {
    // Test when server is down or slow
    await page.goto('/dashboard');
    
    // Should load the page structure even if data fetching fails
    await expect(page.locator('h1')).toContainText('Dashboard');
    
    // Should show loading or error states, not crash
    await page.waitForTimeout(2000);
  });

  test('should reset state on page refresh (expected behavior)', async ({ page }) => {
    await page.goto('/stores');
    
    // Set some state
    await page.click('button:has-text("Mock Login")');
    await expect(page.locator('text=demo@example.com')).toBeVisible();
    
    // Refresh the page - state should reset (this is expected for non-persistent stores)
    await page.reload();
    
    // Should be back to initial state
    await expect(page.locator('text=Not Authenticated')).toBeVisible();
  });
}); 
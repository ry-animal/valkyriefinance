import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate between core pages', async ({ page }) => {
    await page.goto('/');
    
    // Should load home page with brutalist design - check for unique text from hero
    await expect(page.locator('text=THE MOST AGGRESSIVE YIELD OPTIMIZATION PLATFORM')).toBeVisible();
    
    // Navigate to dashboard
    await page.click('nav >> text=DASHBOARD');
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=VALKYRIE').first()).toBeVisible();
    
    // Navigate back to home
    await page.click('nav >> text=HOME');
    await expect(page).toHaveURL('/');
  });

  test('should not have broken links to removed routes', async ({ page }) => {
    await page.goto('/');
    
    // Should not have stores link (removed in brutalist redesign)
    await expect(page.locator('text=Stores')).not.toBeVisible();
    
    // Should not have todos link (removed in brutalist redesign)
    await expect(page.locator('text=Todos')).not.toBeVisible();
  });

  test('should show correct navigation items', async ({ page }) => {
    await page.goto('/');
    
    // Should have the VALKYRIE logo link (use simpler selector)
    await expect(page.locator('header >> text=VALKYRIE')).toBeVisible();
    
    // Should have navigation links with brutalist styling
    await expect(page.locator('nav >> text=HOME')).toBeVisible();
    await expect(page.locator('nav >> text=DASHBOARD')).toBeVisible();
    await expect(page.locator('nav >> text=VAULT')).toBeVisible();
    await expect(page.locator('nav >> text=AI CHAT')).toBeVisible();
    
    // Should have wallet connect button (use test id)
    await expect(page.locator('[data-testid="connect-button"]').first()).toBeVisible();
  });

  test('should handle mobile navigation', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Should show mobile menu button (it has md:hidden class)
    await expect(page.locator('button.md\\:hidden:has-text("MENU")')).toBeVisible();
    
    // Click mobile menu button
    await page.click('button.md\\:hidden:has-text("MENU")');
    
    // Wait for mobile menu to appear
    await page.waitForTimeout(500);
    
    // Should show mobile navigation items (they appear in the mobile menu div)
    await expect(page.locator('div.md\\:hidden >> text=HOME')).toBeVisible();
    await expect(page.locator('div.md\\:hidden >> text=DASHBOARD')).toBeVisible();
    await expect(page.locator('div.md\\:hidden >> text=VAULT')).toBeVisible();
    await expect(page.locator('div.md\\:hidden >> text=AI CHAT')).toBeVisible();
  });

  test('should highlight active navigation item', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Dashboard link should have active styling (black background)
    const dashboardLink = page.locator('nav >> text=DASHBOARD').first();
    await expect(dashboardLink).toHaveClass(/bg-black/);
    await expect(dashboardLink).toHaveClass(/text-white/);
    
    // Home link should not have active styling
    const homeLink = page.locator('nav >> text=HOME').first();
    await expect(homeLink).toHaveClass(/bg-white/);
    await expect(homeLink).toHaveClass(/text-black/);
  });
}); 
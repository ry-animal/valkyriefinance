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
    
    // Should have the VALKYRIE logo link (use more specific selector to avoid duplicates)
    await expect(page.locator('nav .font-brutal:has-text("VALKYRIE")').first()).toBeVisible();
    
    // Should have navigation links with brutalist styling
    await expect(page.locator('nav >> text=HOME')).toBeVisible();
    await expect(page.locator('nav >> text=DASHBOARD')).toBeVisible();
    await expect(page.locator('nav >> text=VAULT')).toBeVisible();
    await expect(page.locator('nav >> text=AI CHAT')).toBeVisible();
    
    // Should have wallet connect button
    await expect(page.locator('text=CONNECT')).toBeVisible();
    
    // Should have theme toggle (look for the toggle button)
    await expect(page.locator('button[type="button"]:has([data-lucide])')).toBeVisible();
  });

  test('should handle mobile navigation', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Should show mobile menu button
    await expect(page.locator('button:has-text("MENU")')).toBeVisible();
    
    // Click mobile menu button
    await page.click('button:has-text("MENU")');
    
    // Should show mobile navigation items (check for mobile-specific nav)
    await expect(page.locator('.md\\:hidden >> text=HOME')).toBeVisible();
    await expect(page.locator('.md\\:hidden >> text=DASHBOARD')).toBeVisible();
    await expect(page.locator('.md\\:hidden >> text=VAULT')).toBeVisible();
    await expect(page.locator('.md\\:hidden >> text=AI CHAT')).toBeVisible();
    
    // Should have wallet connect in mobile menu
    await expect(page.locator('text=CONNECT')).toBeVisible();
  });

  test('should highlight active navigation item', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Dashboard link should have active styling (black background)
    const dashboardLink = page.locator('text=DASHBOARD').first();
    await expect(dashboardLink).toHaveClass(/bg-black/);
    await expect(dashboardLink).toHaveClass(/text-white/);
    
    // Home link should not have active styling
    const homeLink = page.locator('text=HOME').first();
    await expect(homeLink).toHaveClass(/bg-white/);
    await expect(homeLink).toHaveClass(/text-black/);
  });
}); 
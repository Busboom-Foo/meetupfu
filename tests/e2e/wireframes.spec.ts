import { test, expect } from '@playwright/test';

const wireframePages = [
  { path: '/', label: 'Wireframe Index' },
  { path: '/class-page', label: 'Class Page' },
  { path: '/a2-registration', label: 'A2 Event Registration' },
  { path: '/b1-intake', label: 'B1 Intake Form' },
  { path: '/b2-donation', label: 'B2 Donation' },
  { path: '/b3-verification', label: 'B3 Verification' },
  { path: '/b4-dashboard', label: 'B4 Dashboard' },
  { path: '/b5-detail', label: 'B5 Detail' },
  { path: '/b6-voting', label: 'B6 Voting' },
];

for (const { path, label } of wireframePages) {
  test(`${label} (${path}) renders without errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto(path, { waitUntil: 'networkidle' });

    // No React error boundary or crash screen
    const errorBoundary = page.locator('text="Something went wrong"');
    await expect(errorBoundary).toHaveCount(0);

    // No uncaught errors logged to console
    const realErrors = errors.filter(
      (e) => !e.includes('favicon') && !e.includes('404')
    );
    expect(realErrors).toEqual([]);
  });
}

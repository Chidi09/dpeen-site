import { expect, test } from '@playwright/test';

const pages = [
  { path: '/privacy/', heading: 'Privacy policy' },
  { path: '/cookies/', heading: 'Cookie policy' },
  { path: '/terms/', heading: 'Terms of use' },
];

for (const { path, heading } of pages) {
  test(`${heading} page renders with metadata and no overflow`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (
        message.type() === 'error' &&
        message.text().includes('Content Security Policy')
      )
        errors.push(message.text());
    });
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading);
    await expect(page).toHaveTitle(`${heading} | DPEEN`);
    await expect(page.locator('link[rel=canonical]')).toHaveAttribute(
      'href',
      `https://www.dpeenetwork.com${path}`,
    );
    await expect(page.getByText('Last updated')).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    expect(errors).toEqual([]);
  });
}

test('footer links reach each policy and header links return to home sections', async ({
  page,
}) => {
  await page.addInitScript(() => localStorage.setItem('dpeen-notice', '1'));
  await page.goto('/');
  const legal = page.getByRole('navigation', { name: 'Legal' });
  await legal.getByRole('link', { name: 'Privacy policy' }).click();
  await expect(page).toHaveURL(/\/privacy\/$/);
  await page
    .getByRole('navigation', { name: 'Legal' })
    .getByRole('link', { name: 'Cookie policy' })
    .click();
  await expect(page).toHaveURL(/\/cookies\/$/);
  await page
    .getByRole('navigation', { name: 'Legal' })
    .getByRole('link', { name: 'Terms of use' })
    .click();
  await expect(page).toHaveURL(/\/terms\/$/);
  await page.getByRole('link', { name: 'Back to home' }).click();
  await expect(page).toHaveURL(/\/$/);
});

test('cookie notice appears once, links to the policy and stays dismissed', async ({
  page,
}) => {
  await page.goto('/');
  const notice = page.getByRole('region', { name: 'Your privacy' });
  await expect(notice).toBeVisible();
  await expect(
    notice.getByRole('link', { name: 'Cookie policy' }),
  ).toHaveAttribute('href', '/cookies/');
  await notice.getByRole('button', { name: 'Got it' }).click();
  await expect(notice).toBeHidden();
  await page.reload();
  await page.waitForTimeout(1500);
  await expect(notice).toBeHidden();
});

test('the site sets no cookies', async ({ page, context }) => {
  await page.goto('/');
  await page.waitForLoadState('load');
  expect(await context.cookies()).toEqual([]);
});

test('Google Search Console verification file is served', async ({ page }) => {
  const response = await page.request.get('/google2355fcf972b730e8.html');
  expect(response.ok()).toBeTruthy();
  expect(await response.text()).toContain(
    'google-site-verification: google2355fcf972b730e8.html',
  );
});

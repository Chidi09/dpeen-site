import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('dpeen-notice', '1'));
});
import { enquirySchema } from '../src/lib/enquiry';

test('content and metadata render without runtime errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (
      message.type() === 'error' &&
      message.text().includes('Content Security Policy')
    )
      errors.push(message.text());
  });
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'SAY NO TO DRUGS' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Dr. Charles Alaribe' }),
  ).toBeVisible();
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute(
    'href',
    'https://www.dpeenetwork.com/',
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    'https://www.dpeenetwork.com/open-graph/home.png',
  );
  const image = await page.request.get('/open-graph/home.png');
  expect(image.ok()).toBeTruthy();
  expect(image.headers()['content-type']).toContain('image/png');
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  expect(errors).toEqual([]);
});

test('donations show bank details, trap focus and close with Escape', async ({
  page,
}) => {
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'Donate now' });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Support the cause' });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('1031463749');
  await expect(
    dialog.getByRole('img', { name: 'UBA', exact: true }),
  ).toBeVisible();
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press('Tab');
    expect(
      await dialog.evaluate((el) => el.contains(document.activeElement)),
    ).toBeTruthy();
  }
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test('enquiries submit sanitized text and preserve details after delivery failure', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Join the network' }).click();
  const dialog = page.getByRole('dialog', { name: 'Get involved' });
  await expect(dialog.getByLabel('I want to…')).toHaveValue(
    'Volunteer (Rehabilitation)',
  );
  await dialog.getByLabel('Full name').fill('Test Visitor');
  await dialog.getByLabel('Email address').fill('visitor@example.com');
  await dialog
    .getByLabel('Message (optional)')
    .fill('<script>alert(1)</script><b>I want to volunteer</b>');
  await page.route('**/api/contact', (route) =>
    route.fulfill({ status: 503, json: { error: 'Unavailable' } }),
  );
  await dialog.getByRole('button', { name: 'Send message' }).click();
  await expect(dialog.getByRole('status')).toContainText('could not be sent');
  await expect(dialog.getByLabel('Full name')).toHaveValue('Test Visitor');
  await page.unroute('**/api/contact');
  await page.route('**/api/contact', (route) => {
    expect(route.request().postDataJSON().message).toBe('I want to volunteer');
    return route.fulfill({ status: 200, json: { sent: true } });
  });
  await dialog.getByRole('button', { name: 'Send message' }).click();
  await expect(dialog.getByRole('status')).toContainText('has been sent');
  await expect(dialog.getByLabel('Full name')).toHaveValue('');
});

test('trustee biographies preview and expand; contact is reachable', async ({
  page,
}) => {
  await page.goto('/');
  const card = page.locator('article').filter({
    has: page.getByRole('heading', { name: 'Dr. Charles Alaribe' }),
  });
  await expect(card.locator('.trustee-bio-preview')).toBeVisible();
  await card.getByText('Read more', { exact: true }).click();
  await expect(card.locator('details')).toHaveAttribute('open', '');
  await expect(card.locator('.trustee-bio-preview')).toBeHidden();
  await card.getByText('Read less', { exact: true }).click();
  await expect(card.locator('.trustee-bio-preview')).toBeVisible();
  await expect(
    page.locator('#contact').getByLabel('Email address'),
  ).toBeVisible();
  await expect(page.locator('#contact a')).toHaveAttribute(
    'href',
    'mailto:info@dpeenetwork.com',
  );
});

test('navigation works at mobile and desktop sizes', async ({
  page,
}, testInfo) => {
  await page.goto('/');
  if (testInfo.project.name === 'mobile') {
    const toggle = page.getByRole('button', { name: 'Menu', exact: true });
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await page
      .getByRole('navigation')
      .getByRole('link', { name: 'Leadership' })
      .click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(page.url()).toContain('#leadership');
  } else {
    await expect(
      page.getByRole('button', { name: 'Menu', exact: true }),
    ).toBeHidden();
  }
  await page.getByRole('link', { name: 'Learn more' }).click();
  expect(page.url()).toContain('#mission');
});

test('schema rejects invalid email and unsupported interests', () => {
  expect(
    enquirySchema.safeParse({
      fullName: 'Test Visitor',
      email: 'invalid',
      interest: 'Request Help',
      message: '',
    }).success,
  ).toBe(false);
  expect(
    enquirySchema.safeParse({
      fullName: 'Test Visitor',
      email: 'test@example.com',
      interest: 'Unknown',
      message: '',
    }).success,
  ).toBe(false);
});

test('local page and portraits remain available offline', async ({
  page,
  context,
}) => {
  await page.goto('/');
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await page.waitForFunction(() => !!navigator.serviceWorker.controller);
  await context.setOffline(true);
  await page.reload();
  await expect(
    page.getByRole('heading', { name: 'Leadership & trustees' }),
  ).toBeVisible();
  const portrait = page.getByRole('img', { name: 'Dr. Charles Alaribe' });
  await portrait.scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      portrait.evaluate(
        (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
      ),
    )
    .toBeTruthy();
});

test('structured data and crawl files consistently identify the public site', async ({
  page,
}) => {
  await page.goto('/');
  const raw = await page
    .locator('script[type="application/ld+json"]')
    .textContent();
  const data = JSON.parse(raw!);
  expect(data['@context']).toBe('https://schema.org');
  expect(data['@graph']).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        '@type': 'NGO',
        alternateName: 'DPEEN',
        url: 'https://www.dpeenetwork.com/',
      }),
      expect.objectContaining({
        '@type': 'WebSite',
        name: 'DPEEN',
        url: 'https://www.dpeenetwork.com/',
      }),
      expect.objectContaining({
        '@type': 'WebPage',
        url: 'https://www.dpeenetwork.com/',
      }),
    ]),
  );
  const robots = await page.request.get('/robots.txt');
  expect(robots.ok()).toBeTruthy();
  expect(await robots.text()).toContain(
    'Sitemap: https://www.dpeenetwork.com/sitemap-index.xml',
  );
  const index = await page.request.get('/sitemap-index.xml');
  expect(index.ok()).toBeTruthy();
  expect(await index.text()).toContain(
    'https://www.dpeenetwork.com/sitemap-0.xml',
  );
  const sitemap = await page.request.get('/sitemap-0.xml');
  expect(await sitemap.text()).toContain(
    '<loc>https://www.dpeenetwork.com/</loc>',
  );
  expect(await sitemap.text()).not.toContain('open-graph');
  const robotsMeta = await page
    .locator('meta[name=robots]')
    .getAttribute('content');
  expect(robotsMeta).not.toContain('noindex');
});

test('copy confirms inline and preserves keyboard focus', async ({ page }) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: async (text: string) => {
          (window as unknown as { copiedAccount: string }).copiedAccount = text;
        },
      },
    }),
  );
  await page.goto('/');
  await page.getByRole('button', { name: 'Donate now' }).click();
  const copy = page.getByRole('button', { name: 'Copy account number' });
  await copy.click();
  await expect(copy).toContainText('Copied');
  await expect(copy).toBeFocused();
  expect(
    await page.evaluate(
      () => (window as unknown as { copiedAccount: string }).copiedAccount,
    ),
  ).toBe('1031463749');
  await expect(page.locator('#copy-status')).toContainText('copied');
  await expect(copy).toContainText('Copy', { timeout: 5000 });
});

test('reduced motion keeps content visible without animations', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('html')).not.toHaveClass(/motion-ready/);
  await expect(page.locator('.campaign-title')).toHaveCSS(
    'animation-name',
    'none',
  );
  await expect(page.locator('.trustee-card').first()).toHaveCSS('opacity', '1');
});

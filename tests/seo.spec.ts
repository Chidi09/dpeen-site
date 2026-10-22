import { expect, test, type Page } from '@playwright/test';

const ORIGIN = 'https://www.dpeenetwork.com';
// Parsed JSON-LD is untyped by nature, so tests read it loosely.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Node = Record<string, any>;

async function readGraph(page: Page): Promise<Node[]> {
  const raw = await page
    .locator('script[type="application/ld+json"]')
    .textContent();
  return JSON.parse(raw!)['@graph'];
}

// Objects that hold only an @id point at another node in the graph.
function references(value: unknown, found: string[] = []): string[] {
  if (Array.isArray(value)) value.forEach((v) => references(v, found));
  else if (value && typeof value === 'object') {
    const keys = Object.keys(value);
    if (keys.length === 1 && keys[0] === '@id')
      found.push((value as Node)['@id']);
    else Object.values(value).forEach((v) => references(v, found));
  }
  return found;
}

function strings(value: unknown, found: string[] = []): string[] {
  if (typeof value === 'string') found.push(value);
  else if (Array.isArray(value)) value.forEach((v) => strings(v, found));
  else if (value && typeof value === 'object')
    Object.values(value).forEach((v) => strings(v, found));
  return found;
}

test('home head tags are complete and sized for search results', async ({
  page,
}) => {
  await page.goto('/');
  const title = await page.title();
  expect(title.length).toBeLessThanOrEqual(60);
  expect(title).toContain('Drug Prevention');
  const description = await page
    .locator('meta[name=description]')
    .getAttribute('content');
  expect(description!.length).toBeGreaterThanOrEqual(110);
  expect(description!.length).toBeLessThanOrEqual(160);
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute(
    'href',
    `${ORIGIN}/`,
  );
  await expect(page.locator('meta[name=googlebot]')).toHaveAttribute(
    'content',
    /max-image-preview:large/,
  );
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
    'content',
    'en_GB',
  );
  await expect(page.locator('meta[property="og:image:alt"]')).toHaveCount(1);
  await expect(page.locator('meta[property="og:image:type"]')).toHaveAttribute(
    'content',
    'image/png',
  );
  await expect(page.locator('meta[name="twitter:image:alt"]')).toHaveCount(1);
  await expect(
    page.locator('link[rel=alternate][hreflang=x-default]'),
  ).toHaveAttribute('href', `${ORIGIN}/`);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('h1')).toHaveCount(1);
});

test('home JSON-LD is one connected graph that matches the visible page', async ({
  page,
}) => {
  await page.goto('/');
  const graph = await readGraph(page);
  const ids = graph.map((n) => n['@id']).filter(Boolean);
  expect(new Set(ids).size).toBe(ids.length);

  const types = graph.map((n) => n['@type']);
  for (const type of ['NGO', 'WebSite', 'WebPage', 'OfferCatalog'])
    expect(types).toContain(type);
  expect(types.filter((t) => t === 'ImageObject')).toHaveLength(2);
  expect(types.filter((t) => t === 'Person')).toHaveLength(5);

  // Every reference resolves to a node, and nothing was left undefined.
  const known = new Set(ids);
  for (const ref of references(graph)) expect(known.has(ref)).toBe(true);
  expect(JSON.stringify(graph)).not.toContain('undefined');

  const org = graph.find((n) => n['@type'] === 'NGO')!;
  expect(org.name).toBe('Drug Prevention Education and Empowerment Network');
  expect(org.alternateName).toBe('DPEEN');
  expect(org.contactPoint.email).toBe('info@dpeenetwork.com');
  expect(org.member).toHaveLength(5);
  expect(org.hasOfferCatalog).toEqual({ '@id': `${ORIGIN}/#programmes` });

  const catalog = graph.find((n) => n['@type'] === 'OfferCatalog')!;
  expect(catalog.itemListElement).toHaveLength(4);
  const empowerment = catalog.itemListElement.find(
    (s: Node) => s.name === 'Empowerment',
  );
  expect(empowerment.hasOfferCatalog.itemListElement).toHaveLength(4);

  // Absolute URLs only, all on the public origin.
  for (const value of strings(graph).filter((v) => /^https?:/.test(v)))
    expect(value.startsWith(ORIGIN)).toBe(true);

  // Structured data must describe content people can actually see.
  const body = (await page.locator('body').innerText()).replace(/\s+/g, ' ');
  const services = [
    ...catalog.itemListElement,
    ...empowerment.hasOfferCatalog.itemListElement,
  ];
  for (const service of services) {
    expect(body).toContain(service.name);
    expect(body).toContain(service.description);
  }
  for (const person of graph.filter((n) => n['@type'] === 'Person'))
    expect(body).toContain(person.name);
});

test('legal pages publish breadcrumbs and no home-only entities', async ({
  page,
}) => {
  await page.goto('/privacy/');
  const graph = await readGraph(page);
  const types = graph.map((n) => n['@type']);
  expect(types).toContain('BreadcrumbList');
  expect(types).not.toContain('Person');
  expect(types).not.toContain('OfferCatalog');
  const crumbs = graph.find((n) => n['@type'] === 'BreadcrumbList')!;
  expect(crumbs.itemListElement.map((i: Node) => i.name)).toEqual([
    'Home',
    'Privacy policy',
  ]);
  const webpage = graph.find((n) => n['@type'] === 'WebPage')!;
  expect(webpage.dateModified).toBe('2026-10-22');
  expect(webpage.breadcrumb).toEqual({ '@id': crumbs['@id'] });
  const known = new Set(graph.map((n) => n['@id']).filter(Boolean));
  for (const ref of references(graph)) expect(known.has(ref)).toBe(true);
});

test('unknown pages return a noindexed 404 without structured data', async ({
  page,
}) => {
  const response = await page.goto('/this-page-does-not-exist/');
  expect(response?.status()).toBe(404);
  await expect(page.locator('meta[name=robots]')).toHaveAttribute(
    'content',
    /noindex/,
  );
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(
    0,
  );
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'isn’t here',
  );
});

test('sitemap carries dates and robots.txt keeps the API out of search', async ({
  page,
}) => {
  const robots = await (await page.request.get('/robots.txt')).text();
  expect(robots).toContain('Disallow: /api/');
  expect(robots).toContain(`Sitemap: ${ORIGIN}/sitemap-index.xml`);
  const sitemap = await (await page.request.get('/sitemap-0.xml')).text();
  const urls = sitemap.match(/<url>/g) ?? [];
  const dates = sitemap.match(/<lastmod>\d{4}-\d{2}-\d{2}T/g) ?? [];
  expect(urls.length).toBe(4);
  expect(dates.length).toBe(urls.length);
  expect(sitemap).not.toContain('404');
});

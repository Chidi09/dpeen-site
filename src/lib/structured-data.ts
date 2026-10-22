import type { Graph } from 'schema-dts';

export function createStructuredData(site: URL, page: URL): Graph {
  const organizationId = new URL('/#organization', site).href;
  const websiteId = new URL('/#website', site).href;
  const description =
    'Transforming lives and communities through drug prevention, rehabilitation, recovery and empowerment.';
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': organizationId,
        name: 'Drug Prevention Education and Empowerment Network',
        alternateName: 'DPEEN',
        url: site.href,
        logo: new URL('/android-chrome-512x512.png', site).href,
        description,
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: site.href,
        name: 'DPEEN',
        alternateName: 'Drug Prevention Education and Empowerment Network',
        publisher: { '@id': organizationId },
        inLanguage: 'en',
      },
      {
        '@type': 'WebPage',
        '@id': `${page.href}#webpage`,
        url: page.href,
        name: 'DPEEN | Say NO to Drugs',
        description,
        isPartOf: { '@id': websiteId },
        about: { '@id': organizationId },
        inLanguage: 'en',
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: new URL('/open-graph/home.png', site).href,
          width: '1200',
          height: '630',
        },
      },
    ],
  };
}

export function serializeStructuredData(data: Graph): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

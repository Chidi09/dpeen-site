import type { Graph } from 'schema-dts';
import { SITE } from '../data/site';
import { stages, opportunities, scholarship } from '../data/programs';
import { trustees } from '../data/trustees';

export interface Crumb {
  name: string;
  path: string;
}

export interface PageInfo {
  kind: 'home' | 'legal';
  title: string;
  description: string;
  /** ISO date the page content last changed. */
  modified: string;
  /** Trail below Home. Leave empty on the home page. */
  breadcrumbs?: Crumb[];
}

const slug = (text: string): string =>
  text
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const HONORIFIC = /^(Dr\.|Hon\.|Pastor|Mazi)\s+/;

export function createStructuredData(
  site: URL,
  page: URL,
  info: PageInfo,
): Graph {
  const abs = (path: string): string => new URL(path, site).href;
  const id = {
    org: abs('/#organization'),
    site: abs('/#website'),
    logo: abs('/#logo'),
    image: abs('/#primaryimage'),
    catalog: abs('/#programmes'),
    page: `${page.href}#webpage`,
  };
  const country = {
    '@type': 'Country' as const,
    name: SITE.areaServed.name,
    identifier: SITE.areaServed.code,
  };

  const logo = {
    '@type': 'ImageObject' as const,
    '@id': id.logo,
    url: abs(SITE.logo.path),
    contentUrl: abs(SITE.logo.path),
    width: String(SITE.logo.width),
    height: String(SITE.logo.height),
    caption: `${SITE.name} logo`,
  };
  const primaryImage = {
    '@type': 'ImageObject' as const,
    '@id': id.image,
    url: abs(SITE.ogImage.path),
    contentUrl: abs(SITE.ogImage.path),
    width: String(SITE.ogImage.width),
    height: String(SITE.ogImage.height),
    caption: SITE.ogImage.alt,
  };

  const service = (
    name: string,
    serviceType: string,
    description: string,
    extra: Record<string, unknown> = {},
  ) => ({
    '@type': 'Service' as const,
    '@id': abs(`/#service-${slug(name)}`),
    name,
    serviceType,
    description,
    provider: { '@id': id.org },
    areaServed: country,
    ...extra,
  });

  const skillsCatalog = {
    '@type': 'OfferCatalog' as const,
    name: 'Skills training and scholarships',
    itemListElement: [
      ...opportunities.map((o) =>
        service(o.title, 'Vocational skills training', o.description),
      ),
      service(
        scholarship.title,
        'Scholarship placements',
        scholarship.description,
      ),
    ],
  };

  const programmes = {
    '@type': 'OfferCatalog' as const,
    '@id': id.catalog,
    name: `${SITE.name} four-stage programme`,
    description: 'A systematic approach to restoration.',
    itemListElement: stages.map((stage) =>
      service(
        stage.title,
        stage.serviceType,
        stage.desc,
        stage.title === 'Empowerment' ? { hasOfferCatalog: skillsCatalog } : {},
      ),
    ),
  };

  const people = trustees.map((t) => {
    const honorific = HONORIFIC.exec(t.name)?.[1];
    const name = t.name.replace(HONORIFIC, '');
    return {
      '@type': 'Person' as const,
      '@id': abs(`/#person-${slug(name)}`),
      name,
      ...(honorific ? { honorificPrefix: honorific } : {}),
      ...(t.role ? { jobTitle: t.role } : {}),
      ...(t.bio ? { description: t.bio } : {}),
      ...(t.image ? { image: abs(t.image) } : {}),
      worksFor: { '@id': id.org },
    };
  });

  const organization = {
    '@type': 'NGO' as const,
    '@id': id.org,
    name: SITE.legalName,
    legalName: SITE.legalName,
    alternateName: SITE.name,
    url: site.href,
    slogan: SITE.slogan,
    description: SITE.description,
    email: SITE.email,
    logo: { '@id': id.logo },
    image: [{ '@id': id.logo }, { '@id': id.image }],
    areaServed: country,
    knowsAbout: [...SITE.knowsAbout],
    contactPoint: {
      '@type': 'ContactPoint' as const,
      contactType: 'general enquiries',
      email: SITE.email,
      availableLanguage: 'English',
      areaServed: SITE.areaServed.code,
    },
    ...(SITE.sameAs.length ? { sameAs: [...SITE.sameAs] } : {}),
    ...(info.kind === 'home'
      ? {
          hasOfferCatalog: { '@id': id.catalog },
          member: people.map((p) => ({ '@id': p['@id'] })),
        }
      : {}),
  };

  const website = {
    '@type': 'WebSite' as const,
    '@id': id.site,
    url: site.href,
    name: SITE.name,
    alternateName: SITE.legalName,
    description: SITE.description,
    inLanguage: SITE.language,
    isAccessibleForFree: true,
    publisher: { '@id': id.org },
    copyrightHolder: { '@id': id.org },
  };

  const crumbs: Crumb[] = [
    { name: 'Home', path: '/' },
    ...(info.breadcrumbs ?? []),
  ];
  const breadcrumb = {
    '@type': 'BreadcrumbList' as const,
    '@id': `${page.href}#breadcrumb`,
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem' as const,
      position: index + 1,
      name: crumb.name,
      item: abs(crumb.path),
    })),
  };

  const webpage = {
    '@type': 'WebPage' as const,
    '@id': id.page,
    url: page.href,
    name: info.title,
    description: info.description,
    inLanguage: SITE.language,
    isPartOf: { '@id': id.site },
    about: { '@id': id.org },
    dateModified: info.modified,
    primaryImageOfPage: { '@id': id.image },
    image: { '@id': id.image },
    ...(info.kind === 'home'
      ? { mainEntity: { '@id': id.org } }
      : { breadcrumb: { '@id': breadcrumb['@id'] } }),
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [
      organization,
      logo,
      primaryImage,
      website,
      webpage,
      ...(info.kind === 'home' ? [programmes, ...people] : [breadcrumb]),
    ],
  };
}

export function serializeStructuredData(data: Graph): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

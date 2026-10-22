// Facts about the organisation, shared by head tags, JSON-LD and the sitemap.
// Add real profile URLs to `sameAs` (Facebook, Instagram, LinkedIn, X,
// YouTube...) and they are published in the structured data automatically.
export const SITE = {
  name: 'DPEEN',
  legalName: 'Drug Prevention Education and Empowerment Network',
  slogan: 'Say NO to Drugs',
  title: 'DPEEN | Drug Prevention, Recovery & Empowerment Network',
  description:
    'DPEEN helps young people and communities through drug prevention education, rehabilitation support, recreation and skills training. Say NO to drugs.',
  email: 'info@dpeenetwork.com',
  language: 'en',
  locale: 'en_GB',
  areaServed: { name: 'Nigeria', code: 'NG' },
  logo: { path: '/android-chrome-512x512.png', width: 512, height: 512 },
  ogImage: {
    path: '/open-graph/home.png',
    width: 1200,
    height: 630,
    alt: 'DPEEN — Say NO to Drugs',
  },
  sameAs: [] as string[],
  knowsAbout: [
    'Drug prevention education',
    'Addiction rehabilitation and recovery support',
    'Youth recreation and sport',
    'Vocational skills training',
    'Scholarships and continuing education',
  ],
} as const;

// Shown on each legal page and used as its sitemap and JSON-LD modified date.
export const LEGAL_UPDATED = '2026-10-22';

export function formatLegalDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

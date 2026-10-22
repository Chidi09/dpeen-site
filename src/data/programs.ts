// Programme and skills-training copy, shared by the page sections and the
// JSON-LD so the visible text and the structured data cannot drift apart.
export interface Stage {
  title: string;
  symbol: string;
  desc: string;
  cue: string;
  serviceType: string;
}
export const stages: Stage[] = [
  {
    title: 'Education',
    symbol: '01',
    desc: 'Educating children and young people on the dangers of drugs.',
    cue: 'Knowledge is the first step.',
    serviceType: 'Drug prevention education',
  },
  {
    title: 'Rehabilitation',
    symbol: '02',
    desc: 'Identifying addiction and connecting people with professionals.',
    cue: 'Support for a new beginning.',
    serviceType: 'Addiction support and referral',
  },
  {
    title: 'Recreation',
    symbol: '03',
    desc: 'Sporting facilities to create positive distractions.',
    cue: 'Space to connect and grow.',
    serviceType: 'Sport and recreation facilities',
  },
  {
    title: 'Empowerment',
    symbol: '04',
    desc: 'Skills training and scholarships for the future.',
    cue: 'Opportunity beyond recovery.',
    serviceType: 'Skills training and scholarships',
  },
];

export interface Opportunity {
  title: string;
  image: string;
  alt: string;
  description: string;
}
export const opportunities: Opportunity[] = [
  {
    title: 'ICT & tech hubs',
    image: 'photo-1531482615713-2afd69097998',
    alt: 'People learning digital skills together',
    description:
      'Establishment of training hubs in every zone. We equip youths with modern digital skills to ensure steady and reliable income.',
  },
  {
    title: 'Crafts & furniture',
    image: 'photo-1503602642458-232111445657',
    alt: 'A crafted wooden chair',
    description: 'Practical skills for immediate employment.',
  },
  {
    title: 'Soap making & cooking',
    image: 'photo-1556911220-bff31c812dba',
    alt: 'A kitchen for practical cooking skills',
    description: 'Vocational training for self-reliance.',
  },
];

export const scholarship = {
  title: 'Scholarship placements',
  description: 'For those qualified and eager to continue schooling.',
};

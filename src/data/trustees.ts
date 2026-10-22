export interface Trustee {
  name: string;
  role?: string;
  image?: string;
  imagePosition?: string;
  bio?: string;
  bioPreview?: string;
}
export const trustees: Trustee[] = [
  {
    name: 'Gibson Ngoka',
    role: 'President',
    image: '/images/trustees/gibson-ngoka.jpg',
    imagePosition: 'center 35%',
    bioPreview:
      'A journalist, public relations expert and trained human resources professional with a niche in hospitality management.',
    bio: 'Gibson Ngoka is a journalist, a public relations expert and a trained human resources professional who ventured into hospitality management and has carved a niche for himself in that field. He is also an astute salesman. He is an alumnus of College of Journalism Ikeja and Houdegbe North American University in Benin Republic.',
  },
  {
    name: 'Dr. Charles Alaribe',
    role: 'Secretary',
    image: '/images/trustees/charles-alaribe.jpg',
    imagePosition: 'center 40%',
    bioPreview:
      'An educator and environmental researcher working across sustainability, inclusive learning and youth empowerment.',
    bio: 'Dr. Charles Alaribe is an accomplished educator and environmental educator. He holds a Master’s degree in Education and a PhD in Environmental Studies, specializing in Environmental Education and Indigenous Sustainability. His research and teaching span diverse educational settings, including special education. His work brings together sustainability, Indigenous knowledge systems and inclusive teaching to advance equitable learning. He also has extensive experience in nonprofit youth empowerment initiatives.',
  },
  {
    name: 'Hon. Uzoma H. Uzoma',

    image: '/images/trustees/uzoma-h-uzoma.jpg',
    imagePosition: 'center 35%',
    bioPreview:
      'A results-driven project management leader who bridges strategic vision and operational excellence.',
    bio: 'A results-driven project management leader dedicated to bridging the gap between strategic vision and operational excellence. By building high-performing teams and implementing rigorous planning frameworks, every initiative is set up to deliver measurable business outcomes and stay aligned with core objectives.',
  },
  {
    name: 'Pastor Joseph Okonkwo Onwochei',

    image: '/images/trustees/joseph-onwochei.jpeg',
    bioPreview:
      'A pastor and retired electrical engineer dedicated to serving people affected by drug abuse and addiction.',
    bio: 'Joseph Okonkwo Onwochei is a prophetic pastor at Mountain of Fire and Miracles Ministries in Lagos, Nigeria. Born to Samuel and Bernice Onwochei in the Delta North farm settlement of Idumuje Ugboko, he has a passion for loving and serving people. A graduate of electrical engineering from the Federal Polytechnic Bauchi, he served in several places until his retirement in May 2021. He now dedicates his time, alongside his team, to bringing relief to people affected by drug abuse and addiction.',
  },
  {
    name: 'Mazi Vitalis Chinaedu Acholonu',
    image: '/images/trustees/vitalis-acholonu.jpg',
    imagePosition: 'center 35%',
    bioPreview:
      'A businessman, husband and father, and trained educational psychologist committed to young people and vulnerable communities.',
    bio: 'Mazi Vitalis Chinaedu Acholonu is a businessman, a husband and a father with a passion for bettering the lives of young people and the future generation, as well as the vulnerable members of society. With little effort from leadership and government to attend to the growing numbers facing these groups, the question he faces daily is how to help communities, schools and families address everyday social pressures and stress. He believes there are many offshoots to these problems, such as drug and substance abuse, suicide and teenage pregnancy, and that the best way to tackle them is to confront them before they appear. As a trained Educational Psychologist, he is motivated to equip young people with healthy coping mechanisms, and aspires to help design programs, strategies and protective environments around high-risk individuals and communities.',
  },
];

import { OGImageRoute } from 'astro-og-canvas';
export const { getStaticPaths, GET } = await OGImageRoute({
  pages: {
    home: {
      title: 'DPEEN | SAY NO TO DRUGS',
      description: 'Drug Prevention Education and Empowerment Network',
    },
  },
  getImageOptions: (_path, page) => ({
    title: page.title,
    description: page.description,
    bgGradient: [[15, 23, 42]],
    border: { color: [220, 38, 38], width: 20, side: 'inline-start' },
    padding: 70,
    font: {
      title: { families: ['Bebas Neue'], size: 92, weight: 'Normal' },
      description: {
        families: ['Playfair Display'],
        size: 36,
        weight: 'Normal',
      },
    },
    fonts: [
      './public/fonts/BebasNeue.ttf',
      './public/fonts/PlayfairDisplay-Regular.ttf',
    ],
  }),
});

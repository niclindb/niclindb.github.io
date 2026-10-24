// Text shown when a bubble is opened, and on the plain HTML fallback page.
// Order matches the bubble layout in components/bubbles/bubbleGroup.jsx.
const github = { href: 'https://github.com/niclindb', text: 'More on GitHub' };

export const sections = [
  {
    label: 'About Me',
    kicker: 'Web Developer Intern · Shumaker Tech Group',
    title: 'About Me',
    // Getz’s facts are from public/Resume.pdf; the Shumaker role is newer than the resume.
    summary:
      'I build new websites and keep existing ones running as a web developer intern at Shumaker Tech Group. Before that, from March 2022, I wrote the custom Shopify tools that staff at Getz’s Clothiers in Marquette, Michigan, use to sell, price and move stock.',
    highlights: [
      'Point-of-sale features: automatic discounts, held inventory, product cost look-up and charge-account orders',
      'An inventory app for moving stock between store locations with barcode scanning',
      'Product pricing and barcode label printing',
    ],
  },
  {
    label: 'React Project',
    kicker: 'React Project · Getz’s Clothiers',
    title: 'Custom Shopify Extensions',
    // Facts are from public/Resume.pdf; the code is the public niclindb/Getzs-apps repo.
    summary:
      'Getz’s Clothiers needed features that Shopify’s point of sale doesn’t have out of the box, so I built them as React extensions for the store’s staff.',
    stack: ['React', 'JavaScript', 'Shopify POS', 'Shopify GraphQL', 'Liquid'],
    highlights: [
      'An inventory app for moving stock between store locations: staff scan barcodes, see changes in real time, and their progress is saved as they go',
      'Point-of-sale features: automatic discounts, held inventory, real-time product cost look-up and charge-account orders',
      'Product pricing with barcode label printing',
    ],
    link: { href: 'https://github.com/niclindb/Getzs-apps', text: 'See the code on GitHub' },
  },
  {
    label: 'C++ Project',
    kicker: 'C++ Project',
    title: 'Parallel Merge Sort',
    stack: ['C++'],
    // Shows the interactive visualizer from components/MergeSortDemo
    demo: 'parallel-merge-sort',
    highlights: [
      'Efficiently sorts large datasets using parallel processing',
      'Demonstrates proficiency in C++ and parallel computing concepts',
    ],
    link: github,
  },
  {
    label: 'Skills',
    title: 'Skills',
    groups: [
      { name: 'Backend', items: ['Node.js', 'Python', 'SQL'] },
      { name: 'Frontend', items: ['React', 'TypeScript', 'HTML'] },
      { name: 'Other languages', items: ['Java', 'C++'] },
      { name: 'Tools & platforms', items: ['Git', 'Docker', 'AWS'] },
    ],
  },
  {
    label: 'Education',
    title: 'Education',
    degrees: [
      {
        school: 'Michigan State University',
        degree: 'Master’s degree in Computer Science',
        note: 'In progress, 2026',
      },
      {
        school: 'Northern Michigan University',
        degree: 'Bachelor’s degree in Computer Science, Minor in Mathematics',
      },
    ],
  },
];

// Text shown when a bubble is opened, and on the plain HTML fallback page.
// Order matches the bubble layout in components/bubbles/bubbleGroup.jsx.
const github = { href: 'https://github.com/niclindb', text: 'More on GitHub' };

export const sections = [
  {
    label: 'About Me',
    title: 'About Me',
    // Getz’s facts are from public/Resume.pdf; the Shumaker role is newer than the resume
    // and its wording is from Nick. Client sites aren't named.
    jobs: [
      {
        company: 'Shumaker Tech Group',
        role: 'Web Developer Intern',
        stack: ['WordPress', 'Figma'],
        highlights: [
          'Build new WordPress sites from Figma designs, mostly for municipalities and townships',
          'Keep live client sites current with page changes and announcements',
        ],
      },
      {
        company: 'Getz’s Clothiers · Marquette, Michigan',
        role: 'Software Developer · from March 2022',
        stack: ['Shopify', 'React', 'Liquid'],
        highlights: [
          'Point-of-sale features: automatic discounts, held inventory, product cost look-up and charge-account orders',
          'An inventory app for moving stock between inventory locations with barcode scanning',
          'Product pricing and barcode label printing',
        ],
      },
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
      'An inventory app for moving stock between inventory locations: staff scan barcodes, see changes in real time, and their progress is saved as they go',
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
      { name: 'Tools & platforms', items: ['Git', 'Docker'] },
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
        // Honors and coursework are from public/Resume.pdf
        honors: ['Dean’s List', 'Michigan Achievement Scholarship'],
        coursework: [
          'Parallel and Distributed Processing',
          'Operating Systems',
          'Data Structures',
          'Network Programming',
          'Server-Side Programming',
          'Linear Algebra',
          'Probability and Statistics',
        ],
      },
    ],
  },
];

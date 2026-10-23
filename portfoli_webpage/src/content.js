// Text shown when a bubble is opened, and on the plain HTML fallback page.
// Order matches the bubble layout in components/bubbles/bubbleGroup.jsx.
const github = { href: 'https://github.com/niclindb', text: 'More on GitHub' };

export const sections = [
  {
    label: 'About Me',
    title: 'About Me',
    summary:
      'I’m a passionate developer with experience in Java, C++, Python, and JavaScript. I enjoy solving problems through clean, efficient code and building applications that are both creative and practical. I’m always exploring new tools and technologies to expand my skillset and bring fresh ideas to life.',
  },
  {
    label: 'React Project',
    kicker: 'React Project',
    title: 'Custom Shopify Extensions',
    stack: ['React', 'JavaScript', 'Shopify GraphQL'],
    highlights: [
      'Product price look-up',
      'Inventory management',
      'Charge orders',
      'Barcode printing',
    ],
    link: github,
  },
  {
    label: 'C++ Project',
    kicker: 'C++ Project',
    title: 'Parallel Merge Sort',
    stack: ['C++'],
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
    school: 'Northern Michigan University',
    summary: 'Bachelor’s degree in Computer Science, Minor in Mathematics',
  },
];

// Text shown when a bubble is opened, and on the plain HTML fallback page.
// Order matches the bubble layout in components/bubbles/bubbleGroup.jsx.

export const sections = [
  {
    label: 'About Me',
    title: 'About Me',
    // Roles and dates are from public/Resume.pdf; the Figma and municipality
    // details are from Nick. Client sites aren't named.
    jobs: [
      {
        company: 'Shumaker Technology Group',
        role: 'Web Development Intern · September 2026 to present',
        stack: ['WordPress', 'Figma'],
        highlights: [
          'Build new responsive, WCAG-accessible WordPress sites from Figma designs, mostly for municipalities and townships',
          'Maintain live client sites, from page changes and announcements to support tickets',
        ],
      },
      {
        company: 'Michigan State University · Biosystems & Agricultural Engineering',
        role: 'Student Research Assistant · June to August 2026',
        stack: ['ROS 2', 'TensorRT'],
        highlights: [
          'Integrated a 3D opponent detection model into ROS 2 for autonomous racing',
          'Optimized it with TensorRT to run inference in under 6 ms',
          'Checked detection and position accuracy against ground-truth benchmarks so it could be trusted in real-time racing',
        ],
      },
      {
        company: 'Getz’s Clothiers · Marquette, Michigan',
        role: 'Software Developer · March 2022 to May 2026',
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
    label: 'TypeScript Project',
    kicker: 'TypeScript Project',
    title: 'Top Ledger',
    // From public/Resume.pdf. No public link yet.
    summary:
      'A full-stack sports betting tracker. Users place simulated bets and follow their profit and loss in real time.',
    stack: ['React', 'TypeScript', 'Supabase', 'PostgreSQL'],
    highlights: [
      'Live odds and game updates pulled from external sports data APIs',
      'Sign-in handled by Supabase authentication',
      'Users and their wagers stored as related tables in PostgreSQL',
    ],
  },
  {
    label: 'C++ Project',
    kicker: 'C++ Project',
    title: 'Parallel Merge Sort',
    stack: ['C++'],
    // Shows the interactive visualizer from components/MergeSortDemo
    demo: 'parallel-merge-sort',
    summary:
      'Merge sort split across threads: each thread sorts its own slice of the array, then neighbouring slices are merged in pairs until one sorted array is left.',
    highlights: [
      'With p threads, sorting the slices is fully parallel, so each thread does about 1/p of the O(n log n) work',
      'Each merge round halves the number of busy threads, and the last merge of the two halves runs on one thread, which is what limits the speedup',
      'The visualizer above counts every comparison as a step, so the speedup it shows is measured against one thread sorting the same array',
    ],
  },
  {
    label: 'Python Project',
    kicker: 'Python Project',
    title: 'Bracelet Studio',
    stack: ['Python', 'Flask'],
    // From Nick (2026-11-04). The source site's name is still to confirm, so
    // it's left out. Flask and the live link are from Nick (2026-11-06).
    summary:
      'A web app for trying out colors on a bracelet pattern. It takes a design from a bracelet-making website and shows a preview of how it looks in different colors.',
    highlights: [
      'Generate a random set of colors for the whole pattern',
      'Swap out just one color and keep the rest',
      'Change the order the colors appear in',
      'See every change in the preview straight away',
    ],
    link: { href: 'https://bracelet-color-studio-lindberg-dev-projects.vercel.app', text: 'Try the live site' },
  },
  {
    label: 'Skills',
    title: 'Skills',
    // Each skill names where it was used. Getz’s, Top Ledger and the research
    // job are from public/Resume.pdf (the AVL tree from the earlier resume);
    // Figma, Node.js, Docker, Python and Java are from Nick; the rest is this
    // site's own code.
    groups: [
      {
        name: 'Web',
        items: [
          { name: 'React', where: 'Shopify extensions at Getz’s Clothiers, and this site' },
          { name: 'TypeScript', where: 'Top Ledger, a full-stack betting tracker' },
          { name: 'JavaScript', where: 'Getz’s Shopify tools, and this site' },
          { name: 'HTML & CSS', where: 'The layout and glass styling of this site' },
          { name: 'WordPress', where: 'Building and updating client sites at Shumaker Technology Group' },
          { name: 'Figma', where: 'Turning designs into WordPress sites at Shumaker' },
          { name: 'Three.js', where: 'The 3D bubbles on this site, with React Three Fiber' },
        ],
      },
      {
        name: 'Data',
        items: [
          { name: 'SQL & PostgreSQL', where: 'Users and wagers as related tables in Top Ledger' },
          { name: 'Supabase', where: 'Authentication and database for Top Ledger' },
          { name: 'REST APIs', where: 'Live odds and game data in Top Ledger' },
        ],
      },
      {
        name: 'Shopify',
        items: [
          { name: 'Shopify POS', where: 'Automatic discounts, held inventory and charge-account orders at Getz’s' },
          { name: 'GraphQL', where: 'Getz’s custom Shopify extensions' },
          { name: 'Liquid', where: 'Custom point-of-sale features at Getz’s' },
          { name: 'Node.js', where: 'Getz’s custom Shopify app' },
        ],
      },
      {
        name: 'Systems & algorithms',
        items: [
          { name: 'C++', where: 'The parallel merge sort here, and an AVL tree database' },
          { name: 'Parallel programming', where: 'The merge sort, and NMU’s Parallel and Distributed Processing course' },
          { name: 'Data structures', where: 'A self-balancing AVL tree for storing and searching records' },
          { name: 'ROS 2', where: 'A real-time 3D opponent detector for autonomous racing at MSU, sped up with TensorRT' },
        ],
      },
      {
        name: 'Tools',
        items: [
          { name: 'Docker', where: 'Getz’s custom Shopify app' },
          { name: 'Git & GitHub', where: 'Version control for this site and my other projects' },
          { name: 'Vite & Vitest', where: 'Building and testing this site, with tests run on every pull request' },
        ],
      },
      {
        name: 'Other languages',
        items: [
          { name: 'Python', where: 'Most of my personal projects, including Bracelet Studio' },
          { name: 'Java', where: 'University class projects' },
        ],
      },
    ],
  },
  {
    label: 'Education',
    title: 'Education',
    degrees: [
      {
        school: 'Michigan State University',
        degree: 'Master of Science in Computer Science',
        note: 'Expected May 2028',
      },
      {
        school: 'Northern Michigan University',
        degree: 'Bachelor of Science in Computer Science, Minor in Mathematics',
        note: 'Graduated 2026 · GPA 3.70',
        // Honors and coursework are from public/Resume.pdf
        honors: ['Dean’s List', 'Michigan Achievement Scholarship'],
        coursework: [
          'Artificial Intelligence',
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

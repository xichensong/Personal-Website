export const profile = {
  name: "Xichen Song",
  tagline: "Machine Learning, Quantitative Research & Software",
  location: "Berkeley, CA",
  email: "danielsong2401@gmail.com",
  linkedin: "https://linkedin.com",
  github: "https://github.com",
};

export type Project = {
  title: string;
  category: string;
  description?: string;
  bullets?: string[];
  links: { label: string; href: string }[];
  placeholder?: boolean;
};

export const featuredProjects: Project[] = [
  {
    title: "Muscel: Adaptive Workouts",
    category: "Mobile App",
    links: [
      { label: "Website", href: "https://muscel.net/" },
      {
        label: "App Store",
        href: "https://apps.apple.com/us/app/muscel-adaptive-workouts/id6762177875",
      },
    ],
  },
];

export const tradingProjects: Project[] = [
  {
    title:
      "Fixed Deep Residual Networks with Multi-Objective Proximal Policy Optimization for Adaptive Trading",
    category: "Quantitative Research",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/bleepbloop301/Fixed-Deep-Residual-Networks-with-Multi-Objective-Proximal-Policy-Optimization-for-Adaptive-Trading",
      },
    ],
  },
  {
    title:
      "Pairwise Convolutional Relationship Modeling with Learned and Fixed Weighted Aggregation Forecasting",
    category: "Quantitative Research",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/bleepbloop301/Pairwise-Convolutional-Relationship-Modeling-with-Learned-and-Fixed-Weighted-Aggregation-Forecasting",
      },
    ],
  },
  {
    title: "Fourier Mapping Market Regime Detector",
    category: "Quantitative Research",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/bleepbloop301/quantitative-trading-project-JupyterNotebook-",
      },
    ],
  },
  {
    title: "TradingView Constructed Technical Indicators & Strategies",
    category: "Quantitative Research",
    links: [{ label: "GitHub", href: "https://github.com/bleepbloop301/tradingview-pine" }],
  },
];

export const clientProjects: Project[] = [
  {
    title: "Launchpad",
    category: "Web Design & Development",
    links: [{ label: "Visit Site", href: "https://launchpad-lemon-pi.vercel.app/" }],
  },
  {
    title: "Capital Investments at Berkeley",
    category: "Web Design & Development",
    links: [{ label: "Visit Site", href: "https://cib-three.vercel.app/" }],
  },
  {
    title: "Traders at Berkeley",
    category: "Web Design & Development",
    links: [{ label: "Visit Site", href: "https://traders-berkeley.vercel.app/" }],
  },
  {
    title: "SaaS",
    category: "Web Design & Development",
    links: [{ label: "Visit Site", href: "https://saa-s-smoky.vercel.app/" }],
  },
  {
    title: "Fortune and Beyond LLC",
    category: "Web Design & Development",
    links: [{ label: "Visit Site", href: "https://fortune-and-beyond.vercel.app/" }],
  },
  {
    title: "Microfinance at Berkeley",
    category: "Web Design & Development",
    links: [{ label: "Visit Site", href: "https://microfinance-at-berkeley.vercel.app/" }],
  },
  {
    title: "Netmind AI",
    category: "Web Design & Development",
    links: [{ label: "Visit Site", href: "https://netmind-eta.vercel.app/" }],
  },
  {
    title: "Mela Market",
    category: "Web Design & Development",
    links: [{ label: "Visit Site", href: "https://mm-lime-five.vercel.app/" }],
  },
  {
    title: "Big Data",
    category: "Web Design & Development",
    links: [{ label: "Visit Site", href: "https://big-data-olive.vercel.app/" }],
  },
  {
    title: "Mobile Developers at Berkeley",
    category: "Web Design & Development",
    links: [{ label: "Visit Site", href: "https://mobile-developers-of-berkeley.vercel.app/" }],
  },
  {
    title: "Machine Learning at Berkeley",
    category: "Web Design & Development",
    links: [{ label: "Visit Site", href: "https://machine-learning-at-berkeley.vercel.app/" }],
  },
];

export type Publication = {
  title: string;
  authors?: string;
  venue?: string;
  bullets?: string[];
  links: { label: string; href: string }[];
  placeholder?: boolean;
};

export const publications: Publication[] = [
  {
    title:
      "Fixed Deep Residual Networks with Multi-Objective Proximal Policy Optimization for Adaptive Trading",
    venue: "American Journal of Student Research, 4(4), 727–739, 2026",
    authors: "X. Song",
    links: [
      {
        label: "Paper",
        href: "https://ajosr.org/papers/volume-4/issue-4/fixed-deep-residual-networks-with-multi-objective-proximal-policy-optimization-for-adaptive-trading/",
      },
    ],
  },
  {
    title:
      "Pairwise Convolutional Relationship Modeling with Learned and Fixed Weighted Aggregation Forecasting",
    venue: "Preprint, 2026",
    authors: "X. Song, A. Becerra, A. Qiu",
    links: [{ label: "Paper", href: "https://zenodo.org/records/21329281" }],
  },
];

export type TranslatedBook = {
  title: string;
  author?: string;
  note?: string;
};

export const translatedBooks: TranslatedBook[] = [
  { title: "Made by James: The Honest Guide to Creativity and Logo Design", author: "James Martin" },
  { title: "Creative Revolution", author: "Flora Bowley" },
  {
    title: "Forthcoming titles",
    note: "Ken Howard, Trevor Chamberlain, and Ken Goldman",
  },
];

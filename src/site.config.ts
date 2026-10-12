/**
 * Everything you are likely to change lives in this one file.
 * Edit, commit, push. The site rebuilds itself.
 */

export const SITE = {
  /**
   * The public address of the site, with no trailing slash.
   * Change this to your custom domain once DNS is set up
   * (for example 'https://lavanyabasavaraju.com'). See RUNBOOK.md, step 2.
   */
  url: 'https://brainsesh.github.io',

  name: 'Lavanya Basavaraju',
  shortName: 'Lavanya',
  initials: 'LB',
  title: 'Lavanya Basavaraju',
  description:
    'Long-form explainers on AI research and the engineering behind it, and on how AI is changing finance and healthcare.',
  role: 'Machine learning practitioner',
  email: 'brainsesh@gmail.com',
  locale: 'en-US',

  social: {
    linkedin: 'https://www.linkedin.com/in/lavanya-basavaraju/',
    github: '', // e.g. 'https://github.com/your-handle'. Leave empty to hide.
    x: '', // e.g. 'https://x.com/your-handle'. Leave empty to hide.
    scholar: '', // Google Scholar profile, if you have one.
  },

  /** Source repository, used for "Suggest an edit" links on articles. */
  repo: 'https://github.com/brainsesh/brainsesh.github.io',

  newsletter: {
    /** The newsletter keeps the brainsesh name. */
    name: 'brainsesh',
    pitch: 'One email when a new piece is out. Paper reviews, engineering notes, and AI in finance and healthcare. No spam, unsubscribe in one click.',
    /**
     * Your Buttondown username (buttondown.com/<username>).
     * Leave empty and the signup form is replaced by an RSS link.
     */
    buttondown: 'brainsesh',
  },

  analytics: {
    /** GoatCounter site code (https://<code>.goatcounter.com). Empty = no analytics. */
    goatcounter: '',
  },

  /** Shown at the end of every article and on the About page. */
  disclaimer:
    'The views here are mine alone and do not represent my employers or any affiliated organization. Everything on this site is for informational purposes only and is not professional advice.',

  motto: 'The goal is simple. Better than yesterday.',
} as const;

/**
 * Topics are the main sections of the site. Every post belongs to exactly one.
 * The key is used in URLs (/topics/<key>/) and in post frontmatter (topic: <key>).
 * `color` names a CSS variable defined in src/styles/global.css.
 */
export const TOPICS = {
  'ai-ml': {
    label: 'AI & ML',
    long: 'AI models and engineering',
    description:
      'Paper reviews, model architectures, lectures and the engineering it takes to ship ML systems. Robotics, too, as it comes.',
    color: 'var(--topic-ai)',
    disclaimer: '',
  },
  finance: {
    label: 'AI in finance',
    long: 'finance',
    description:
      'How machine learning is used in markets, risk, fraud and banking operations, and where it breaks.',
    color: 'var(--topic-finance)',
    disclaimer:
      'For education only. Nothing here is investment, trading or financial advice.',
  },
  healthcare: {
    label: 'AI in healthcare',
    long: 'healthcare',
    description:
      'Clinical AI, medical imaging, health data and the evaluation and safety questions that come with them.',
    color: 'var(--topic-health)',
    disclaimer:
      'For education only. Nothing here is medical advice or should guide diagnosis or treatment.',
  },
  essays: {
    label: 'Essays',
    long: 'essays',
    description:
      'Resilience, craft and what it means to keep showing up. This section was called Mindset Reset on the old site.',
    color: 'var(--topic-essays)',
    disclaimer: '',
  },
} as const;

export type TopicKey = keyof typeof TOPICS;
export const TOPIC_KEYS = Object.keys(TOPICS) as [TopicKey, ...TopicKey[]];

/** The kind of piece. Shown on post rows and used to build the Papers page. */
export const POST_TYPES = {
  'paper-review': 'Paper review',
  'deep-dive': 'Deep dive',
  guide: 'Guide',
  notes: 'Talk & lecture notes',
  essay: 'Essay',
} as const;

export type PostType = keyof typeof POST_TYPES;
export const POST_TYPE_KEYS = Object.keys(POST_TYPES) as [PostType, ...PostType[]];

/** Top navigation. Pages with no content yet hide themselves. */
export const NAV = [
  { href: '/writing/', label: 'Writing' },
  { href: '/papers/', label: 'Papers' },
  { href: '/projects/', label: 'Projects' },
  { href: '/about/', label: 'About' },
  { href: '/newsletter/', label: 'Newsletter' },
] as const;

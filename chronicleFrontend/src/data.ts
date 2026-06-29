export type Article = {
  id?: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  date: string;
  author: string;
  readTime: string;
  image: string;
  status: 'Published' | 'Draft' | 'Scheduled' | 'Needs Review' | 'Archived';
  updatedAt: string;
  views: string;
  featured?: boolean;
};

export type MediaAsset = {
  name: string;
  type: string;
  size: string;
  date: string;
  image: string;
};

export const heroImage = '/futuristic-city-skyline.svg';

export const articles: Article[] = [
  {
    slug: 'architecture-of-truth',
    title: 'The Architecture of Truth: Redesigning the Modern Editorial Engine',
    summary:
      'A new generation of newsrooms is rebuilding trust through transparent workflows, stronger editorial systems, and deliberate information architecture.',
    category: 'Politics & Policy',
    date: 'October 24, 2024',
    author: 'Helena V. Vance',
    readTime: '12 min read',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=85',
    status: 'Published',
    updatedAt: 'Oct 24, 2024 09:42',
    views: '128K',
    featured: true,
  },
  {
    slug: 'sovereign-grid',
    title: 'The Sovereign Grid: Decentralizing Information in 2025',
    summary:
      'Cryptographic engineers are building peer-to-peer information networks that promise data autonomy beyond centralized platforms.',
    category: 'Technology',
    date: 'October 12, 2024',
    author: 'Elias Thorne',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=85',
    status: 'Draft',
    updatedAt: 'Oct 23, 2024 18:15',
    views: '0',
  },
  {
    slug: 'campus-reimagined',
    title: 'Reimagining the Campus: The Death of the Lecture Hall',
    summary:
      'Universities are repurposing massive halls into hybrid learning studios as academic life shifts into flexible networks.',
    category: 'Education',
    date: 'October 8, 2024',
    author: 'Mara Ellison',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=85',
    status: 'Needs Review',
    updatedAt: 'Oct 22, 2024 14:08',
    views: '0',
  },
  {
    slug: 'red-index',
    title: 'The Red Index: Why the Global Market is Shifting East',
    summary:
      'Emerging fiscal policies are challenging the dominance of traditional western exchanges and remapping capital flows.',
    category: 'Economy',
    date: 'October 7, 2024',
    author: 'Noah Sterling',
    readTime: '9 min read',
    image: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&w=1200&q=85',
    status: 'Published',
    updatedAt: 'Oct 21, 2024 11:30',
    views: '94K',
  },
  {
    slug: 'genetic-resilience',
    title: 'Genetic Resilience: Engineering Plants for the Super-Dry',
    summary:
      'Botanists identified a genetic marker that helps desert flora survive prolonged drought and extreme climates.',
    category: 'Health',
    date: 'October 5, 2024',
    author: 'Iris Vale',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&q=85',
    status: 'Scheduled',
    updatedAt: 'Oct 20, 2024 16:45',
    views: '0',
  },
  {
    slug: 'truth-machine',
    title: "The Truth Machine: AI's Role in Modern Editorial",
    summary:
      'Chronicle investigates how newsrooms are using automated verification tools without surrendering human judgment.',
    category: 'Media',
    date: 'October 4, 2024',
    author: 'Julian Thorne',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=85',
    status: 'Archived',
    updatedAt: 'Oct 19, 2024 10:12',
    views: '57K',
  },
];

export const categories = [
  { name: 'Technology', description: 'AI, platforms, gadgets, privacy, and the silicon frontier.', count: 412, tone: 'bg-secondary' },
  { name: 'Education', description: 'Academic research, institutional policy, and lifelong learning.', count: 258, tone: 'bg-slate-500' },
  { name: 'Health', description: 'Medical research, public health, and scientific breakthroughs.', count: 531, tone: 'bg-red-600' },
  { name: 'Sports', description: 'Performance, policy, athletes, and the business of competition.', count: 281, tone: 'bg-emerald-600' },
];

export const mediaAssets: MediaAsset[] = [
  {
    name: 'urban-skyline-v1.jpg',
    type: 'Image',
    size: '12.4 MB',
    date: 'Oct 24, 2024',
    image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=900&q=85',
  },
  {
    name: 'ceo-portrait-series.png',
    type: 'Image',
    size: '8.1 MB',
    date: 'Oct 22, 2024',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=85',
  },
  {
    name: 'rainforest-broll-h264.mp4',
    type: 'Video',
    size: '45.8 MB',
    date: 'Oct 20, 2024',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=85',
  },
  {
    name: 'tech-abstract-blue.jpg',
    type: 'Image',
    size: '6.2 MB',
    date: 'Oct 19, 2024',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=85',
  },
  {
    name: 'editorial-room.jpg',
    type: 'Image',
    size: '9.5 MB',
    date: 'Oct 18, 2024',
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=85',
  },
];

export const stats = [
  { label: 'Published Articles', value: '1,482', delta: '+12%' },
  { label: 'Draft Queue', value: '36', delta: '+4' },
  { label: 'Media Assets', value: '8,904', delta: '+187' },
  { label: 'Monthly Readers', value: '2.4M', delta: '+18%' },
];

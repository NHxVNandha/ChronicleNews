import type { Article } from '../../data';

export type BackendArticle = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body?: string;
  categoryId: string;
  categoryName: string;
  authorId: string;
  authorName: string;
  status: 'Draft' | 'NeedsReview' | 'Scheduled' | 'Published' | 'Archived';
  featured: boolean;
  featuredImageUrl?: string | null;
  views: number;
  seoTitle?: string | null;
  seoDescription?: string | null;
  createdAt: string;
  updatedAt: string;
  scheduledAt?: string | null;
  publishedAt?: string | null;
};

export type ArticleEditorRecord = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  categoryId: string;
  categoryName: string;
  authorName: string;
  status: Article['status'];
  featured: boolean;
  featuredImageUrl?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

export type PublicArticleDetail = ArticleEditorRecord & {
  image: string;
  date: string;
  readTime: string;
};

export type BackendCategory = {
  id: string;
  name: string;
  description?: string | null;
  slug: string;
  isActive: boolean;
};

import type { Article } from '../../data';
import type { ArticleEditorRecord, BackendArticle, PublicArticleDetail } from '../models/articleModels';

export function toFrontendStatus(status: BackendArticle['status']): Article['status'] {
  if (status === 'NeedsReview') return 'Needs Review';
  return status;
}

export function formatDateLabel(value?: string | null) {
  if (!value) return 'N/A';
  return new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function formatUpdatedLabel(value: string) {
  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatViews(value: number) {
  return value >= 1000 ? `${Math.round(value / 1000)}K` : `${value}`;
}

export function mapArticle(article: BackendArticle): Article {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    summary: article.summary,
    category: article.categoryName,
    date: formatDateLabel(article.publishedAt ?? article.createdAt),
    author: article.authorName,
    readTime: '5 min read',
    image: article.featuredImageUrl || 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=85',
    status: toFrontendStatus(article.status),
    updatedAt: formatUpdatedLabel(article.updatedAt),
    views: formatViews(article.views),
    featured: article.featured,
  };
}

export function mapEditorArticle(article: BackendArticle): ArticleEditorRecord {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    summary: article.summary,
    body: article.body ?? '',
    categoryId: article.categoryId,
    categoryName: article.categoryName,
    authorName: article.authorName,
    status: toFrontendStatus(article.status),
    featured: article.featured,
    featuredImageUrl: article.featuredImageUrl,
    seoTitle: article.seoTitle,
    seoDescription: article.seoDescription,
  };
}

export function mapPublicArticleDetail(article: BackendArticle): PublicArticleDetail {
  const editor = mapEditorArticle(article);
  return {
    ...editor,
    image: article.featuredImageUrl || 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=85',
    date: formatDateLabel(article.publishedAt ?? article.createdAt),
    readTime: '5 min read',
  };
}

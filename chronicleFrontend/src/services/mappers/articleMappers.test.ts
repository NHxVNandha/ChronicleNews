import { describe, expect, it } from 'vitest';
import { mapArticle, mapEditorArticle, mapPublicArticleDetail, toFrontendStatus } from './articleMappers';
import type { BackendArticle } from '../models/articleModels';

const article: BackendArticle = {
  id: '1',
  slug: 'architecture-of-truth',
  title: 'The Architecture of Truth',
  summary: 'Summary',
  body: '<p>Body</p>',
  categoryId: 'cat-1',
  categoryName: 'Technology',
  authorId: 'author-1',
  authorName: 'Julian Thorne',
  status: 'NeedsReview',
  featured: true,
  featuredImageUrl: null,
  views: 128000,
  seoTitle: 'SEO Title',
  seoDescription: 'SEO Description',
  createdAt: '2026-06-30T00:00:00Z',
  updatedAt: '2026-06-30T01:00:00Z',
  publishedAt: '2026-06-30T02:00:00Z',
  scheduledAt: null,
};

describe('article mappers', () => {
  it('maps backend status to frontend status', () => {
    expect(toFrontendStatus('NeedsReview')).toBe('Needs Review');
    expect(toFrontendStatus('Published')).toBe('Published');
  });

  it('maps article card shape', () => {
    const result = mapArticle(article);
    expect(result.slug).toBe(article.slug);
    expect(result.status).toBe('Needs Review');
    expect(result.views).toBe('128K');
  });

  it('maps editor shape', () => {
    const result = mapEditorArticle(article);
    expect(result.body).toBe('<p>Body</p>');
    expect(result.categoryName).toBe('Technology');
  });

  it('maps public detail shape', () => {
    const result = mapPublicArticleDetail(article);
    expect(result.readTime).toBe('5 min read');
    expect(result.image).toContain('unsplash');
  });
});

import type { Article } from '../data';
import { apiClient } from './apiClient';

export type ArticleFilter = {
  query?: string;
  category?: string;
  status?: Article['status'];
  featured?: boolean;
  sort?: 'newest' | 'oldest' | 'popular';
  limit?: number;
};

type BackendArticle = {
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

function toFrontendStatus(status: BackendArticle['status']): Article['status'] {
  if (status === 'NeedsReview') return 'Needs Review';
  return status;
}

function formatDateLabel(value?: string | null) {
  if (!value) return 'N/A';
  return new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatUpdatedLabel(value: string) {
  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatViews(value: number) {
  return value >= 1000 ? `${Math.round(value / 1000)}K` : `${value}`;
}

function mapArticle(article: BackendArticle): Article {
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

async function getArticleEntityBySlug(slug: string) {
  return apiClient<BackendArticle>(`/api/articles/${slug}`);
}

function mapEditorArticle(article: BackendArticle): ArticleEditorRecord {
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

export async function getArticles(filter?: ArticleFilter): Promise<Article[]> {
  const params = new URLSearchParams();
  if (filter?.query) params.set('query', filter.query);
  if (filter?.featured !== undefined) params.set('featured', String(filter.featured));
  if (filter?.sort) params.set('sort', filter.sort);

  if (filter?.status) {
    params.set('status', filter.status === 'Needs Review' ? 'NeedsReview' : filter.status);
  }

  const response = await apiClient<BackendArticle[]>(`/api/articles?${params.toString()}`);
  let items = response.map(mapArticle);

  if (filter?.category) {
    items = items.filter((article) => article.category === filter.category);
  }

  if (filter?.limit) {
    items = items.slice(0, filter.limit);
  }

  return items;
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  try {
    return mapArticle(await getArticleEntityBySlug(slug));
  } catch {
    return undefined;
  }
}

export async function getArticleEditorBySlug(slug: string): Promise<ArticleEditorRecord | undefined> {
  try {
    return mapEditorArticle(await getArticleEntityBySlug(slug));
  } catch {
    return undefined;
  }
}

export async function getPublicArticleDetail(slug: string): Promise<PublicArticleDetail | undefined> {
  try {
    const article = await getArticleEntityBySlug(slug);
    const editor = mapEditorArticle(article);
    return {
      ...editor,
      image: article.featuredImageUrl || 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=85',
      date: formatDateLabel(article.publishedAt ?? article.createdAt),
      readTime: '5 min read',
    };
  } catch {
    return undefined;
  }
}

export async function getFeaturedArticle(): Promise<Article | undefined> {
  const items = await getArticles({ featured: true, limit: 1 });
  return items[0];
}

export type UpdateArticlePayload = Partial<Pick<Article, 'title' | 'summary' | 'status' | 'category' | 'featured'>>;

export type SaveArticlePayload = {
  title: string;
  summary: string;
  body: string;
  category: string;
  featured?: boolean;
  featuredImageUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
};

async function resolveCategoryId(categoryName: string, fallbackCategoryId?: string) {
  const categories = await apiClient<Array<{ id: string; name: string }>>('/api/categories');
  const category = categories.find((item) => item.name === categoryName) ?? categories.find((item) => item.id === fallbackCategoryId);
  if (!category) {
    throw new Error('Category was not found.');
  }
  return category.id;
}

export async function createArticle(payload: SaveArticlePayload) {
  const categoryId = await resolveCategoryId(payload.category);
  const response = await apiClient<BackendArticle>('/api/articles', {
    method: 'POST',
    body: JSON.stringify({
      title: payload.title,
      summary: payload.summary,
      body: payload.body,
      categoryId,
      featured: payload.featured ?? false,
      featuredImageUrl: payload.featuredImageUrl,
      seoTitle: payload.seoTitle,
      seoDescription: payload.seoDescription,
      status: 'Draft',
    }),
  });

  return mapEditorArticle(response);
}

export async function saveArticle(slug: string, payload: SaveArticlePayload) {
  const current = await getArticleEntityBySlug(slug);
  const categoryId = await resolveCategoryId(payload.category, current.categoryId);

  const response = await apiClient<BackendArticle>(`/api/articles/${current.id}`, {
    method: 'PUT',
    body: JSON.stringify({
      title: payload.title,
      summary: payload.summary,
      body: payload.body,
      categoryId,
      featured: payload.featured ?? current.featured,
      featuredImageUrl: payload.featuredImageUrl ?? current.featuredImageUrl,
      seoTitle: payload.seoTitle ?? current.seoTitle,
      seoDescription: payload.seoDescription ?? current.seoDescription,
    }),
  });

  return mapEditorArticle(response);
}

export async function publishArticle(slug: string) {
  const current = await getArticleEntityBySlug(slug);
  await apiClient(`/api/articles/${current.id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'Published' }),
  });

  return getArticleEditorBySlug(slug);
}

export async function updateArticle(slug: string, payload: UpdateArticlePayload): Promise<Article> {
  const current = await getArticleEntityBySlug(slug);
  const categoryName = payload.category ?? current.categoryName;
  const categoryId = await resolveCategoryId(categoryName, current.categoryId);

  await apiClient(`/api/articles/${current.id}`, {
    method: 'PUT',
    body: JSON.stringify({
      title: payload.title ?? current.title,
      summary: payload.summary ?? current.summary,
      body: current.body ?? '<p>Updated from admin table.</p>',
      categoryId,
      featured: payload.featured ?? current.featured,
      featuredImageUrl: current.featuredImageUrl,
      seoTitle: current.seoTitle,
      seoDescription: current.seoDescription,
    }),
  });

  if (payload.status && payload.status !== mapArticle(current).status) {
    await apiClient(`/api/articles/${current.id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: payload.status === 'Needs Review' ? 'NeedsReview' : payload.status }),
    });
  }

  return (await getArticleBySlug(slug))!;
}

export async function deleteArticle(slug: string): Promise<void> {
  const current = await getArticleEntityBySlug(slug);
  await apiClient(`/api/articles/${current.id}`, {
    method: 'DELETE',
  });
}

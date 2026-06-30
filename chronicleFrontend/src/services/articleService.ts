import type { Article } from '../data';
import { apiClient } from './apiClient';
import { mapArticle, mapEditorArticle, mapPublicArticleDetail } from './mappers/articleMappers';
import type { ArticleEditorRecord, BackendArticle, BackendCategory, PublicArticleDetail } from './models/articleModels';

export type { ArticleEditorRecord, PublicArticleDetail } from './models/articleModels';

export type ArticleFilter = {
  query?: string;
  category?: string;
  status?: Article['status'];
  featured?: boolean;
  sort?: 'newest' | 'oldest' | 'popular';
  limit?: number;
};

async function getArticleEntityBySlug(slug: string) {
  return apiClient<BackendArticle>(`/api/articles/${slug}`);
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
    return mapPublicArticleDetail(await getArticleEntityBySlug(slug));
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
  const categories = await apiClient<BackendCategory[]>('/api/categories');
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

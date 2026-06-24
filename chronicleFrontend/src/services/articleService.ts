import { articles, type Article } from '../data';
import { simulateDelay } from './apiClient';

export type ArticleFilter = {
  query?: string;
  category?: string;
  status?: Article['status'];
  featured?: boolean;
  sort?: 'newest' | 'oldest' | 'popular';
  limit?: number;
};

function applyFilters(data: Article[], filter?: ArticleFilter): Article[] {
  if (!filter) return data;

  let result = [...data];

  if (filter.query) {
    const q = filter.query.toLowerCase();
    result = result.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.author.toLowerCase().includes(q),
    );
  }

  if (filter.category) {
    result = result.filter((a) => a.category === filter.category);
  }

  if (filter.status) {
    result = result.filter((a) => a.status === filter.status);
  }

  if (filter.featured !== undefined) {
    result = result.filter((a) => a.featured === filter.featured);
  }

  if (filter.sort === 'newest') {
    result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } else if (filter.sort === 'oldest') {
    result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } else if (filter.sort === 'popular') {
    result.sort((a, b) => parseInt(b.views.replace(/\D/g, '')) - parseInt(a.views.replace(/\D/g, '')));
  }

  if (filter.limit) {
    result = result.slice(0, filter.limit);
  }

  return result;
}

export async function getArticles(filter?: ArticleFilter): Promise<Article[]> {
  return simulateDelay(applyFilters(articles, filter));
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  return simulateDelay(articles.find((a) => a.slug === slug));
}

export async function getFeaturedArticle(): Promise<Article | undefined> {
  return simulateDelay(articles.find((a) => a.featured));
}

export type UpdateArticlePayload = Partial<Pick<Article, 'title' | 'summary' | 'status' | 'category'>>;

export async function updateArticle(slug: string, payload: UpdateArticlePayload): Promise<Article> {
  const index = articles.findIndex((a) => a.slug === slug);
  if (index === -1) throw new Error(`Article not found: ${slug}`);
  articles[index] = { ...articles[index], ...payload };
  return simulateDelay(articles[index]);
}

export async function deleteArticle(slug: string): Promise<void> {
  const index = articles.findIndex((a) => a.slug === slug);
  if (index === -1) throw new Error(`Article not found: ${slug}`);
  articles.splice(index, 1);
  return simulateDelay(undefined, 150);
}

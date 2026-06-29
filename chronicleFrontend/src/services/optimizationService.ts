import { apiClient } from './apiClient';

export type SeoSettings = {
  defaultMetaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  robotsTxt: string;
  enableCrawling: boolean;
  indexArticlePages: boolean;
  indexCategoryPages: boolean;
  noIndexAuthorPages: boolean;
};

export type AiSettings = {
  provider: string;
  modelName: string;
  baseUrl: string;
  apiKeyHint: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  primaryLanguage: string;
  languageStandard: string;
  writingStyle: string;
  tone: string;
};

export async function getSeoSettings() {
  return apiClient<SeoSettings>('/api/seo/settings');
}

export async function updateSeoSettings(payload: SeoSettings) {
  return apiClient<SeoSettings>('/api/seo/settings', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function getAiSettings() {
  return apiClient<AiSettings>('/api/ai-settings');
}

export async function updateAiSettings(payload: AiSettings) {
  return apiClient<AiSettings>('/api/ai-settings', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

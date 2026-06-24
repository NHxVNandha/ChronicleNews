import { Route, Routes } from 'react-router-dom';
import {
  AdminActivity,
  AdminAssetsHub,
  AdminContentHub,
  AdminDashboard,
  AdminEditor,
  AdminEngagementHub,
  AdminLayoutsHub,
  AdminMonetizationHub,
  AdminOptimizationHub,
  AdminProfile,
  AdminSettings,
} from '../pages/admin';
import {
  AboutPage,
  ArchivePage,
  ArticleDetailPage,
  AuthPage,
  AuthorDetailPage,
  AuthorsPage,
  CategoriesPage,
  ContactPage,
  LegalPage,
  HomePage,
  MultimediaHubPage,
  NewsletterPage,
  NewsPage,
  NotFoundPage,
  PublicSectionPage,
  SectionsHubPage,
  SearchPage,
  TopicPage,
} from '../pages/public';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/news" element={<NewsPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/news/:slug" element={<ArticleDetailPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/sections" element={<SectionsHubPage />} />
      <Route path="/multimedia" element={<MultimediaHubPage />} />
      <Route path="/breaking" element={<PublicSectionPage title="Breaking News Desk" eyebrow="Live Coverage" description="Kumpulan pembaruan cepat untuk peristiwa nasional, global, ekonomi, keamanan, dan kebijakan publik yang sedang berkembang." icon="bolt" />} />
      <Route path="/video" element={<PublicSectionPage title="Video Reports & Visual Journalism" eyebrow="Chronicle Video" description="Liputan video, explainer visual, wawancara, dan dokumenter singkat dari ruang redaksi Chronicle." icon="play_circle" />} />
      <Route path="/podcast" element={<PublicSectionPage title="Podcast & Audio Briefings" eyebrow="Chronicle Audio" description="Diskusi redaksi, analisis mendalam, dan rangkuman audio untuk pembaca yang mengikuti berita saat bepergian." icon="podcasts" />} />
      <Route path="/opinion" element={<PublicSectionPage title="Opinion, Editorials & Analysis" eyebrow="Opinion Desk" description="Kolom opini, tajuk rencana, perspektif pakar, dan analisis redaksi terhadap isu publik utama." icon="edit_note" />} />
      <Route path="/regional" element={<PublicSectionPage title="Regional & Local News" eyebrow="Regional Desk" description="Pantauan daerah, kebijakan lokal, dinamika kota, dan cerita masyarakat dari berbagai wilayah." icon="map" />} />
      <Route path="/archive" element={<ArchivePage />} />
      <Route path="/authors" element={<AuthorsPage />} />
      <Route path="/authors/:slug" element={<AuthorDetailPage />} />
      <Route path="/topics/:slug" element={<TopicPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/newsletter" element={<NewsletterPage />} />
      <Route path="/privacy" element={<LegalPage type="privacy" />} />
      <Route path="/terms" element={<LegalPage type="terms" />} />
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/register" element={<AuthPage mode="register" />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/content" element={<AdminContentHub />} />
      <Route path="/admin/layouts" element={<AdminLayoutsHub />} />
      <Route path="/admin/assets" element={<AdminAssetsHub />} />
      <Route path="/admin/publishing" element={<AdminContentHub />} />
      <Route path="/admin/optimization" element={<AdminOptimizationHub />} />
      <Route path="/admin/engagement" element={<AdminEngagementHub />} />
      <Route path="/admin/monetization" element={<AdminMonetizationHub />} />
      <Route path="/admin/articles" element={<AdminContentHub />} />
      <Route path="/admin/articles/new" element={<AdminEditor />} />
      <Route path="/admin/articles/:slug/edit" element={<AdminEditor />} />
      <Route path="/admin/review" element={<AdminContentHub />} />
      <Route path="/admin/calendar" element={<AdminContentHub />} />
      <Route path="/admin/categories" element={<AdminAssetsHub />} />
      <Route path="/admin/media" element={<AdminAssetsHub />} />
      <Route path="/admin/comments" element={<AdminEngagementHub />} />
      <Route path="/admin/seo" element={<AdminOptimizationHub />} />
      <Route path="/admin/ai-settings" element={<AdminOptimizationHub />} />
      <Route path="/admin/notifications" element={<AdminEngagementHub />} />
      <Route path="/admin/ads" element={<AdminMonetizationHub />} />
      <Route path="/admin/activity" element={<AdminActivity />} />
      <Route path="/admin/profile" element={<AdminProfile />} />
      <Route path="/admin/settings" element={<AdminSettings />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { RouteLoader } from '../components/RouteLoader';

const AdminActivity = lazy(() => import('../pages/admin/AdminActivity').then((module) => ({ default: module.AdminActivity })));
const AdminAssetsHub = lazy(() => import('../pages/admin/AdminAssetsHub').then((module) => ({ default: module.AdminAssetsHub })));
const AdminContentHub = lazy(() => import('../pages/admin/AdminContentHub').then((module) => ({ default: module.AdminContentHub })));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard').then((module) => ({ default: module.AdminDashboard })));
const AdminEditor = lazy(() => import('../pages/admin/AdminEditor').then((module) => ({ default: module.AdminEditor })));
const AdminEngagementHub = lazy(() => import('../pages/admin/AdminEngagementHub').then((module) => ({ default: module.AdminEngagementHub })));
const AdminLayoutsHub = lazy(() => import('../pages/admin/AdminLayoutsHub').then((module) => ({ default: module.AdminLayoutsHub })));
const AdminMonetizationHub = lazy(() => import('../pages/admin/AdminMonetizationHub').then((module) => ({ default: module.AdminMonetizationHub })));
const AdminOptimizationHub = lazy(() => import('../pages/admin/AdminOptimizationHub').then((module) => ({ default: module.AdminOptimizationHub })));
const AdminProfile = lazy(() => import('../pages/admin/AdminProfile').then((module) => ({ default: module.AdminProfile })));
const AdminSettings = lazy(() => import('../pages/admin/AdminSettings').then((module) => ({ default: module.AdminSettings })));

const AboutPage = lazy(() => import('../pages/public/AboutPage').then((module) => ({ default: module.AboutPage })));
const ArchivePage = lazy(() => import('../pages/public/ArchivePage').then((module) => ({ default: module.ArchivePage })));
const ArticleDetailPage = lazy(() => import('../pages/public/ArticleDetailPage').then((module) => ({ default: module.ArticleDetailPage })));
const AuthPage = lazy(() => import('../pages/public/AuthPage').then((module) => ({ default: module.AuthPage })));
const AuthorsPage = lazy(() => import('../pages/public/AuthorsPage').then((module) => ({ default: module.AuthorsPage })));
const AuthorDetailPage = lazy(() => import('../pages/public/AuthorsPage').then((module) => ({ default: module.AuthorDetailPage })));
const CategoriesPage = lazy(() => import('../pages/public/CategoriesPage').then((module) => ({ default: module.CategoriesPage })));
const ContactPage = lazy(() => import('../pages/public/ContactPage').then((module) => ({ default: module.ContactPage })));
const LegalPage = lazy(() => import('../pages/public/LegalPage').then((module) => ({ default: module.LegalPage })));
const HomePage = lazy(() => import('../pages/public/HomePage').then((module) => ({ default: module.HomePage })));
const MultimediaHubPage = lazy(() => import('../pages/public/MultimediaHubPage').then((module) => ({ default: module.MultimediaHubPage })));
const NewsletterPage = lazy(() => import('../pages/public/NewsletterPage').then((module) => ({ default: module.NewsletterPage })));
const NewsPage = lazy(() => import('../pages/public/NewsPage').then((module) => ({ default: module.NewsPage })));
const NotFoundPage = lazy(() => import('../pages/public/NotFoundPage').then((module) => ({ default: module.NotFoundPage })));
const PublicSectionPage = lazy(() => import('../pages/public/PublicSectionPage').then((module) => ({ default: module.PublicSectionPage })));
const SectionsHubPage = lazy(() => import('../pages/public/SectionsHubPage').then((module) => ({ default: module.SectionsHubPage })));
const SearchPage = lazy(() => import('../pages/public/SearchPage').then((module) => ({ default: module.SearchPage })));
const TopicPage = lazy(() => import('../pages/public/TopicPage').then((module) => ({ default: module.TopicPage })));

export function AppRoutes() {
  return (
    <Suspense fallback={<RouteLoader />}>
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
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/content" element={<ProtectedRoute><AdminContentHub /></ProtectedRoute>} />
        <Route path="/admin/layouts" element={<ProtectedRoute><AdminLayoutsHub /></ProtectedRoute>} />
        <Route path="/admin/assets" element={<ProtectedRoute><AdminAssetsHub /></ProtectedRoute>} />
        <Route path="/admin/publishing" element={<ProtectedRoute><AdminContentHub /></ProtectedRoute>} />
        <Route path="/admin/optimization" element={<ProtectedRoute><AdminOptimizationHub /></ProtectedRoute>} />
        <Route path="/admin/engagement" element={<ProtectedRoute><AdminEngagementHub /></ProtectedRoute>} />
        <Route path="/admin/monetization" element={<ProtectedRoute><AdminMonetizationHub /></ProtectedRoute>} />
        <Route path="/admin/articles" element={<ProtectedRoute><AdminContentHub /></ProtectedRoute>} />
        <Route path="/admin/articles/new" element={<ProtectedRoute><AdminEditor /></ProtectedRoute>} />
        <Route path="/admin/articles/:slug/edit" element={<ProtectedRoute><AdminEditor /></ProtectedRoute>} />
        <Route path="/admin/review" element={<ProtectedRoute><AdminContentHub /></ProtectedRoute>} />
        <Route path="/admin/calendar" element={<ProtectedRoute><AdminContentHub /></ProtectedRoute>} />
        <Route path="/admin/categories" element={<ProtectedRoute><AdminAssetsHub /></ProtectedRoute>} />
        <Route path="/admin/media" element={<ProtectedRoute><AdminAssetsHub /></ProtectedRoute>} />
        <Route path="/admin/comments" element={<ProtectedRoute><AdminEngagementHub /></ProtectedRoute>} />
        <Route path="/admin/seo" element={<ProtectedRoute><AdminOptimizationHub /></ProtectedRoute>} />
        <Route path="/admin/ai-settings" element={<ProtectedRoute><AdminOptimizationHub /></ProtectedRoute>} />
        <Route path="/admin/notifications" element={<ProtectedRoute><AdminEngagementHub /></ProtectedRoute>} />
        <Route path="/admin/ads" element={<ProtectedRoute><AdminMonetizationHub /></ProtectedRoute>} />
        <Route path="/admin/activity" element={<ProtectedRoute><AdminActivity /></ProtectedRoute>} />
        <Route path="/admin/profile" element={<ProtectedRoute><AdminProfile /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

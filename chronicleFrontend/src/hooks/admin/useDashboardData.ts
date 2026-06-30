import { useEffect, useState } from 'react';
import type { Article } from '../../data';
import { getArticles, getDashboardPipeline, getDashboardRecentActivity, getDashboardSummary, type DashboardPipeline, type DashboardRecentActivity, type DashboardSummary } from '../../services';

export function useDashboardData() {
  const [summary, setSummary] = useState<DashboardSummary>({ publishedArticles: 0, draftQueue: 0, mediaAssets: 0, monthlyReaders: 0 });
  const [pipeline, setPipeline] = useState<DashboardPipeline>({ draft: 0, needsReview: 0, scheduled: 0, published: 0 });
  const [recentActivity, setRecentActivity] = useState<DashboardRecentActivity[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const [summaryData, pipelineData, activityData, articlesData] = await Promise.all([
          getDashboardSummary(),
          getDashboardPipeline(),
          getDashboardRecentActivity(),
          getArticles({ sort: 'popular', limit: 4 }),
        ]);

        if (!isMounted) return;
        setSummary(summaryData);
        setPipeline(pipelineData);
        setRecentActivity(activityData);
        setArticles(articlesData);
      } catch (loadError) {
        if (isMounted) setError(loadError instanceof Error ? loadError.message : 'Failed to load dashboard data.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void load();
    return () => {
      isMounted = false;
    };
  }, []);

  return { summary, pipeline, recentActivity, articles, loading, error };
}

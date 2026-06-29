import { useEffect, useState } from 'react';
import { Icon } from '../../components/ui';
import { AdminLayout } from '../../layouts/AdminLayout';
import { getActivityLogs, type ActivityLogItem } from '../../services';

function getActivityIcon(action: string) {
  if (action.includes('publish')) return 'publish';
  if (action.includes('category')) return 'category';
  if (action.includes('review')) return 'rate_review';
  if (action.includes('login')) return 'login';
  if (action.includes('user')) return 'group';
  return 'history';
}

function formatRelativeTime(value: string) {
  const diffMs = Date.now() - new Date(value).getTime();
  const diffHours = Math.max(1, Math.round(diffMs / (1000 * 60 * 60)));
  return `${diffHours}h ago`;
}

export function AdminActivity() {
  const [events, setEvents] = useState<ActivityLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const result = await getActivityLogs({ page: 1, pageSize: 20 });
        if (isMounted) setEvents(result);
      } catch (loadError) {
        if (isMounted) setError(loadError instanceof Error ? loadError.message : 'Failed to load activity logs.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void load();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AdminLayout title="Activity Log">
      <section className="rounded-xl border border-slate-200 bg-white p-6 soft-shadow">
        <h1 className="font-display text-4xl font-bold text-primary">Workspace Activity</h1>
        <p className="mt-2 text-slate-600">Recent editorial, media, and access-management changes.</p>
        {error && <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}
        {loading ? (
          <div className="mt-8 space-y-4">
            {Array.from({ length: 5 }).map((_, index) => <div key={index} className="h-20 animate-pulse rounded-xl bg-slate-100" />)}
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {events.map((event) => (
              <div key={event.id} className="flex gap-4 rounded-xl bg-slate-50 p-4">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-primary text-white"><Icon name={getActivityIcon(event.action)} /></span>
                <div>
                  <p className="font-bold text-primary">{event.description}</p>
                  <p className="text-sm text-slate-500">{event.userName ?? 'System'} · {formatRelativeTime(event.createdAt)} · {event.entityType}</p>
                </div>
              </div>
            ))}
            {!events.length && <div className="rounded-xl bg-slate-50 p-6 text-sm text-slate-500">No activity found.</div>}
          </div>
        )}
      </section>
    </AdminLayout>
  );
}

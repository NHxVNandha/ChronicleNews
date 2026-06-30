import { useEffect, useState } from 'react';
import { getActivityLogs, type ActivityLogItem } from '../../services';

export function useActivityLogs(page = 1, pageSize = 20) {
  const [events, setEvents] = useState<ActivityLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const result = await getActivityLogs({ page, pageSize });
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
  }, [page, pageSize]);

  return { events, loading, error };
}

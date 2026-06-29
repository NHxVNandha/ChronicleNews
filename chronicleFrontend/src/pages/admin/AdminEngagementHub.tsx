import { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { SkeletonBlock } from '../../components/Skeleton';
import { Icon } from '../../components/ui';
import { addCommentReply, changeCommentStatus, createCampaign, getCampaigns, getComments, getSubscriberSummary, type Campaign as NotifCampaign, type EngagementCommentStatus as CommentStatus, type ModerationComment, type SubscriberSummary } from '../../services';

type SocialPost = {
  id: number;
  platform: string;
  text: string;
  scheduled: string;
  status: 'Scheduled' | 'Published' | 'Draft';
};

const statusStyles: Record<CommentStatus, string> = {
  Pending: 'bg-amber-100 text-amber-700',
  Approved: 'bg-emerald-100 text-emerald-700',
  Hidden: 'bg-slate-100 text-slate-600',
  Flagged: 'bg-red-100 text-red-700',
};

const statusTabs: { key: CommentStatus | 'All'; label: string }[] = [
  { key: 'All', label: 'All' },
  { key: 'Pending', label: 'Pending' },
  { key: 'Approved', label: 'Approved' },
  { key: 'Hidden', label: 'Hidden' },
  { key: 'Flagged', label: 'Flagged' },
];


const socialPosts: SocialPost[] = [
  { id: 1, platform: 'Twitter / X', text: 'New: The Architecture of Truth — redesigning the modern editorial engine...', scheduled: '2024-10-24 10:00', status: 'Scheduled' },
  { id: 2, platform: 'Facebook', text: 'How newsrooms are rebuilding trust through transparent workflows...', scheduled: '2024-10-24 10:05', status: 'Scheduled' },
  { id: 3, platform: 'LinkedIn', text: 'The Sovereign Grid — decentralized information networks in 2025...', scheduled: '2024-10-23 12:00', status: 'Published' },
  { id: 4, platform: 'Instagram', text: 'Infographic: Campus redesign trends across Indonesia...', scheduled: '2024-10-25 08:00', status: 'Draft' },
];

const platformColors: Record<string, string> = {
  'Twitter / X': 'bg-sky-100 text-sky-700',
  Facebook: 'bg-blue-100 text-blue-700',
  LinkedIn: 'bg-blue-200 text-blue-800',
  Instagram: 'bg-pink-100 text-pink-700',
};

export function AdminEngagementHub() {
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<ModerationComment[]>([]);
  const [campaigns, setCampaigns] = useState<NotifCampaign[]>([]);
  const [subscribers, setSubscribers] = useState<SubscriberSummary[]>([]);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<CommentStatus | 'All'>('All');
  const [searchText, setSearchText] = useState('');
  const [articleFilter, setArticleFilter] = useState('All');
  const [replyOpen, setReplyOpen] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const [pushTitle, setPushTitle] = useState('');
  const [pushBody, setPushBody] = useState('');
  const [pushSchedule, setPushSchedule] = useState('now');
  const [pushHistory, setPushHistory] = useState<{ title: string; sent: string; status: string }[]>([]);

  const [newsletterTitle, setNewsletterTitle] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState('');

  const [socialText, setSocialText] = useState('');
  const [socialPlatform, setSocialPlatform] = useState('Twitter / X');
  const [socialSchedule, setSocialSchedule] = useState('');
  const [socialPostsList, setSocialPostsList] = useState<SocialPost[]>(socialPosts);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const [commentData, campaignData, subscriberData] = await Promise.all([
          getComments(),
          getCampaigns(),
          getSubscriberSummary(),
        ]);

        if (!isMounted) return;
        setComments(commentData);
        setCampaigns(campaignData);
        setSubscribers(subscriberData);
      } catch (loadError) {
        if (isMounted) setError(loadError instanceof Error ? loadError.message : 'Failed to load engagement data.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void load();
    return () => {
      isMounted = false;
    };
  }, []);

  const sampleArticles = Array.from(new Set(comments.map((comment) => comment.articleTitle)));

  async function updateCommentStatus(id: string, status: CommentStatus) {
    const updated = await changeCommentStatus(id, status);
    setComments((current) => current.map((c) => c.id === id ? updated : c));
  }

  async function handleReply(commentId: string) {
    if (!replyText.trim()) return;
    const reply = await addCommentReply(commentId, replyText.trim());
    setComments((current) => current.map((c) => c.id === commentId ? { ...c, replies: [...c.replies, reply] } : c));
    setReplyText('');
    setReplyOpen(null);
  }

  function handleSendPush() {
    if (!pushTitle.trim()) return;
    const now = new Date().toLocaleString('id-ID');
    const status = pushSchedule === 'now' ? 'Sent' : 'Scheduled';
    setPushHistory((prev) => [{ title: pushTitle, sent: pushSchedule === 'now' ? now : pushSchedule, status }, ...prev]);
    setPushTitle('');
    setPushBody('');
    setPushSchedule('now');
  }

  async function handleSendNewsletter() {
    if (!newsletterTitle.trim()) return;
    const created = await createCampaign({ title: newsletterTitle, type: 'Newsletter', audience: 'All Subscribers' });
    setCampaigns((current) => [created, ...current]);
    setNewsletterStatus(`"${newsletterTitle}" will be sent to subscribers.`);
    setNewsletterTitle('');
  }

  function handleScheduleSocial() {
    if (!socialText.trim() || !socialSchedule.trim()) return;
    const newPost: SocialPost = {
      id: Date.now(),
      platform: socialPlatform,
      text: socialText,
      scheduled: socialSchedule,
      status: 'Scheduled',
    };
    setSocialPostsList((prev) => [newPost, ...prev]);
    setSocialText('');
    setSocialSchedule('');
  }

  const filteredComments = comments.filter((c) => {
    if (statusFilter !== 'All' && c.status !== statusFilter) return false;
    if (articleFilter !== 'All' && c.articleTitle !== articleFilter) return false;
    if (searchText && !c.text.toLowerCase().includes(searchText.toLowerCase()) && !c.author.toLowerCase().includes(searchText.toLowerCase())) return false;
    return true;
  });

  const counts = { All: comments.length } as Record<string, number>;
  statusTabs.forEach((t) => { counts[t.key] = comments.filter((c) => t.key === 'All' || c.status === t.key).length; });

  const readerMetrics = [
    { label: 'Daily Active Readers', value: '12.4K', delta: '+8.2%', icon: 'groups' },
    { label: 'Avg. Session Duration', value: '7m 24s', delta: '+3.1%', icon: 'schedule' },
    { label: 'Pages per Session', value: '4.8', delta: '+1.4%', icon: 'sticky_note_2' },
    { label: 'Bounce Rate', value: '32.1%', delta: '-2.4%', icon: 'logout' },
    { label: 'Returning Readers', value: '68%', delta: '+5.7%', icon: 'repeat' },
    { label: 'Scroll Depth (avg)', value: '74%', delta: '+6.3%', icon: 'swipe' },
  ];

  const geoData = [
    { region: 'Jakarta', readers: '4,280', pct: 34 },
    { region: 'Surabaya', readers: '1,840', pct: 15 },
    { region: 'Bandung', readers: '1,560', pct: 12 },
    { region: 'Yogyakarta', readers: '1,120', pct: 9 },
    { region: 'Medan', readers: '890', pct: 7 },
    { region: 'Other Cities', readers: '2,910', pct: 23 },
  ];

  const deviceData = [
    { device: 'Mobile', pct: 62, color: 'bg-secondary' },
    { device: 'Desktop', pct: 28, color: 'bg-slate-500' },
    { device: 'Tablet', pct: 10, color: 'bg-emerald-500' },
  ];

  const newsletterStats = [
    { label: 'Subscribers', value: '28,406', delta: '+3.2%' },
    { label: 'Avg. Open Rate', value: '26.8%', delta: '+1.4%' },
    { label: 'Avg. Click Rate', value: '4.2%', delta: '+0.6%' },
    { label: 'Bounce Rate', value: '1.8%', delta: '-0.3%' },
  ];

  return (
    <AdminLayout title="Engagement">
      {loading ? (
        <div className="space-y-8">
          <SkeletonBlock className="h-12" />
          <SkeletonBlock className="h-[600px]" />
        </div>
      ) : (
      <div className="space-y-10">
        {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}

        {/* ── Section 1: Comments Moderation ── */}
        <div className="space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-amber-600 text-white"><Icon name="forum" /></span>
            <div className="flex-1">
              <h2 className="font-display text-2xl font-bold text-primary">Comments Moderation</h2>
              <p className="text-sm text-slate-500">Internal editorial comments, corrections, and review notes across articles</p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white soft-shadow">
            <div className="flex flex-col gap-4 border-b border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                {statusTabs.map((tab) => (
                  <button
                    key={tab.key}
                    className={`rounded-lg px-4 py-2 text-sm font-bold transition ${statusFilter === tab.key ? 'bg-primary !text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    type="button"
                    onClick={() => setStatusFilter(tab.key)}
                  >
                    {tab.label} <span className="ml-1 text-xs opacity-70">({counts[tab.key]})</span>
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400" />
                  <input
                    className="w-48 rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-secondary"
                    placeholder="Search comments..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </div>
                <select
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-secondary"
                  value={articleFilter}
                  onChange={(e) => setArticleFilter(e.target.value)}
                >
                  <option value="All">All Articles</option>
                  {sampleArticles.map((title) => <option key={title} value={title}>{title}</option>)}
                </select>
                <button
                  className="rounded-lg bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-700 hover:bg-emerald-200"
                  type="button"
                  onClick={() => setComments((current) => current.map((c) => ({ ...c, status: 'Approved' as CommentStatus })))}
                >
                  Approve All
                </button>
              </div>
            </div>

            <div className="divide-y divide-slate-200">
              {filteredComments.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-16 text-slate-400">
                  <Icon name="inbox" className="text-5xl" />
                  <p className="text-lg font-semibold">No comments found</p>
                  <p className="text-sm">Try adjusting your filters or search terms.</p>
                </div>
              ) : (
                filteredComments.map((comment) => (
                  <div key={comment.id} className="p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyles[comment.status]}`}>{comment.status}</span>
                          <span className="text-sm font-semibold text-slate-700">{comment.author}</span>
                          <span className="text-xs text-slate-400">{comment.date}</span>
                          <span className="text-xs text-slate-400">on <span className="font-semibold text-slate-600">{comment.articleTitle}</span></span>
                        </div>
                        <p className="mt-3 text-primary">{comment.text}</p>
                        {comment.replies.length > 0 && (
                          <div className="ml-6 mt-3 space-y-2 border-l-2 border-slate-200 pl-4">
                            {comment.replies.map((reply, i) => (
                              <div key={i}>
                                <div className="flex items-center gap-2 text-xs">
                                  <span className="font-bold text-secondary">{reply.author}</span>
                                  <span className="text-slate-400">{reply.date}</span>
                                </div>
                                <p className="mt-1 text-sm text-slate-700">{reply.text}</p>
                              </div>
                            ))}
                          </div>
                        )}
                        {replyOpen === comment.id && (
                          <div className="mt-3 flex gap-3">
                            <input
                              className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none focus:border-secondary"
                              placeholder="Type your reply..."
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleReply(comment.id)}
                            />
                            <button className="rounded-lg bg-secondary px-4 py-2 text-sm font-bold !text-white" type="button" onClick={() => handleReply(comment.id)}>Send</button>
                            <button className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-slate-600" type="button" onClick={() => { setReplyOpen(null); setReplyText(''); }}>Cancel</button>
                          </div>
                        )}
                      </div>
                      <div className="flex shrink-0 flex-wrap gap-2">
                        {comment.status !== 'Approved' && (
                          <button className="rounded-lg bg-emerald-100 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-200" type="button" onClick={() => void updateCommentStatus(comment.id, 'Approved')}>Approve</button>
                        )}
                        {comment.status !== 'Hidden' && (
                          <button className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200" type="button" onClick={() => void updateCommentStatus(comment.id, 'Hidden')}>Hide</button>
                        )}
                        {comment.status !== 'Flagged' && (
                          <button className="rounded-lg bg-red-100 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-200" type="button" onClick={() => void updateCommentStatus(comment.id, 'Flagged')}>Flag</button>
                        )}
                        <button
                          className={`rounded-lg px-3 py-2 text-xs font-bold ${replyOpen === comment.id ? 'bg-primary !text-white' : 'bg-blue-100 text-secondary hover:bg-blue-200'}`}
                          type="button"
                          onClick={() => setReplyOpen(replyOpen === comment.id ? null : comment.id)}
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ── Section 2: Audience Analytics ── */}
        <div className="space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-purple-600 text-white"><Icon name="insights" /></span>
            <div className="flex-1">
              <h2 className="font-display text-2xl font-bold text-primary">Audience Analytics</h2>
              <p className="text-sm text-slate-500">Reader behavior, geographic distribution, and device breakdown</p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {readerMetrics.map((metric) => (
              <div key={metric.label} className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 soft-shadow">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-purple-50 text-purple-600"><Icon name={metric.icon} className="text-xl" /></span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{metric.label}</p>
                  <p className="mt-1 text-2xl font-bold text-primary">{metric.value}</p>
                  <p className="text-sm font-bold text-emerald-600">{metric.delta}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
            <section className="rounded-xl border border-slate-200 bg-white p-6 soft-shadow">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-xl font-bold text-primary">Reader Geography</h3>
                <span className="text-sm font-bold uppercase tracking-wider text-slate-400">Top cities</span>
              </div>
              <div className="space-y-4">
                {geoData.map((item) => (
                  <div key={item.region}>
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-700">{item.region}</span>
                      <span className="text-sm font-bold text-slate-700">{item.readers} <span className="font-normal text-slate-400">({item.pct}%)</span></span>
                    </div>
                    <div className="overflow-hidden rounded-full bg-slate-200">
                      <div className="h-2.5 rounded-full bg-secondary" style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-6 soft-shadow">
              <h3 className="mb-5 text-xl font-bold text-primary">Device Breakdown</h3>
              <div className="space-y-5">
                {deviceData.map((item) => (
                  <div key={item.device}>
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-700">{item.device}</span>
                      <span className="text-sm font-bold text-slate-700">{item.pct}%</span>
                    </div>
                    <div className="overflow-hidden rounded-full bg-slate-200">
                      <div className={`h-3 rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-lg bg-slate-50 p-4 text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Mobile Dominance</p>
                <p className="text-2xl font-bold text-primary">62%</p>
                <p className="text-sm text-slate-500">of readers access via mobile devices</p>
              </div>
            </section>
          </div>
        </div>

        {/* ── Section 3: Push Notifications ── */}
        <div className="space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-white"><Icon name="notifications_active" /></span>
            <div className="flex-1">
              <h2 className="font-display text-2xl font-bold text-primary">Push Notifications</h2>
              <p className="text-sm text-slate-500">Send breaking news alerts and updates to readers</p>
            </div>
          </div>

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
            <section className="rounded-xl border border-slate-200 bg-white p-6 soft-shadow">
              <h3 className="mb-5 text-xl font-bold text-primary">Compose Notification</h3>
              <div className="space-y-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-bold uppercase tracking-wider text-slate-600">Title</span>
                  <input className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-secondary" placeholder="Breaking: ..." value={pushTitle} onChange={(e) => setPushTitle(e.target.value)} />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold uppercase tracking-wider text-slate-600">Body</span>
                  <textarea className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-secondary" rows={3} placeholder="Notification message..." value={pushBody} onChange={(e) => setPushBody(e.target.value)} />
                </label>
                <div className="flex flex-wrap items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="push-schedule" value="now" checked={pushSchedule === 'now'} onChange={() => setPushSchedule('now')} />
                    <span className="text-sm font-semibold text-slate-700">Send now</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="push-schedule" value="schedule" checked={pushSchedule !== 'now'} onChange={() => setPushSchedule('')} />
                    <span className="text-sm font-semibold text-slate-700">Schedule</span>
                  </label>
                  {pushSchedule !== 'now' && (
                    <input type="datetime-local" className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none" value={pushSchedule || ''} onChange={(e) => setPushSchedule(e.target.value)} />
                  )}
                </div>
                <button className="w-full rounded-lg bg-primary py-3 font-bold !text-white hover:bg-primary/90" type="button" onClick={handleSendPush}>
                  {pushSchedule === 'now' ? 'Send Notification' : 'Schedule Notification'}
                </button>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-6 soft-shadow">
              <h3 className="mb-5 text-xl font-bold text-primary">Recent History</h3>
              {pushHistory.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-8 text-slate-400">
                  <Icon name="history" className="text-4xl" />
                  <p className="text-sm font-semibold">No notifications sent yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pushHistory.map((item, i) => (
                    <div key={i} className="rounded-lg bg-slate-50 p-3">
                      <p className="font-semibold text-primary">{item.title}</p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                        <span>{item.sent}</span>
                        <span className={`rounded-full px-2 py-0.5 font-bold ${item.status === 'Sent' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{item.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>

        {/* ── Section 4: Newsletter & Campaigns ── */}
        <div className="space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-600 text-white"><Icon name="campaign" /></span>
            <div className="flex-1">
              <h2 className="font-display text-2xl font-bold text-primary">Newsletter & Campaigns</h2>
              <p className="text-sm text-slate-500">Email campaigns, newsletters, and subscriber engagement metrics</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {newsletterStats.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-5 soft-shadow">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{stat.label}</p>
                <p className="mt-2 font-display text-3xl font-bold text-primary">{stat.value}</p>
                <p className="mt-1 text-sm font-bold text-emerald-600">{stat.delta}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
            <section className="rounded-xl border border-slate-200 bg-white p-6 soft-shadow">
              <h3 className="mb-5 text-xl font-bold text-primary">Create Campaign</h3>
              <div className="space-y-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-bold uppercase tracking-wider text-slate-600">Campaign Title</span>
                  <input className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-secondary" placeholder="e.g. Weekend Edition" value={newsletterTitle} onChange={(e) => setNewsletterTitle(e.target.value)} />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold uppercase tracking-wider text-slate-600">Target Audience</span>
                  <select className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-secondary" defaultValue="All">
                    <option>All Subscribers</option>
                    <option>Premium Readers</option>
                    <option>Newsletter Only</option>
                    <option>Push Subscribers</option>
                    <option>New Readers (30d)</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold uppercase tracking-wider text-slate-600">Email Subject</span>
                  <input className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-secondary" placeholder="Subject line..." />
                </label>
                <button className="w-full rounded-lg bg-primary py-3 font-bold !text-white hover:bg-primary/90" type="button" onClick={handleSendNewsletter}>Create & Send</button>
                {newsletterStatus && (
                  <p className="rounded-lg bg-emerald-50 p-3 text-center text-sm font-bold text-emerald-700">{newsletterStatus}</p>
                )}
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-6 soft-shadow">
              <h3 className="mb-5 text-xl font-bold text-primary">Subscriber Overview</h3>
              <div className="space-y-4">
                {subscribers.map((item) => (
                  <div key={item.tier} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-4">
                    <div>
                      <p className="font-bold text-primary">{item.tier}</p>
                      <p className="text-lg font-bold text-slate-700">{item.count}</p>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">{item.delta}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="rounded-xl border border-slate-200 bg-white soft-shadow">
            <div className="border-b border-slate-200 p-5">
              <h3 className="text-xl font-bold text-primary">Campaign History</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <th className="px-5 pb-4 pt-3">Campaign</th>
                    <th className="pb-4 pr-4 pt-3">Type</th>
                    <th className="pb-4 pr-4 pt-3">Audience</th>
                    <th className="pb-4 pr-4 pt-3">Sent</th>
                    <th className="pb-4 pr-4 pt-3">Open Rate</th>
                    <th className="pb-4 pr-4 pt-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((camp) => (
                    <tr key={camp.id} className="border-b border-slate-100">
                      <td className="px-5 py-4 font-semibold text-primary">{camp.title}</td>
                      <td className="py-4 pr-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${camp.type === 'Push' ? 'bg-blue-100 text-blue-700' : camp.type === 'Email' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'}`}>{camp.type}</span>
                      </td>
                      <td className="py-4 pr-4 text-slate-600">{camp.audience}</td>
                      <td className="py-4 pr-4 text-slate-600">{camp.sent || '-'}</td>
                      <td className="py-4 pr-4 font-bold text-slate-700">{camp.openRate || '-'}</td>
                      <td className="py-4 pr-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${camp.status === 'Sent' ? 'bg-emerald-100 text-emerald-700' : camp.status === 'Scheduled' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>{camp.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* ── Section 5: Social Media Scheduling ── */}
        <div className="space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-sky-600 text-white"><Icon name="share" /></span>
            <div className="flex-1">
              <h2 className="font-display text-2xl font-bold text-primary">Social Media</h2>
              <p className="text-sm text-slate-500">Schedule and manage cross-platform social posts</p>
            </div>
          </div>

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
            <section className="rounded-xl border border-slate-200 bg-white p-6 soft-shadow">
              <h3 className="mb-5 text-xl font-bold text-primary">Compose Post</h3>
              <div className="space-y-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-bold uppercase tracking-wider text-slate-600">Platform</span>
                  <select className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-secondary" value={socialPlatform} onChange={(e) => setSocialPlatform(e.target.value)}>
                    <option>Twitter / X</option>
                    <option>Facebook</option>
                    <option>LinkedIn</option>
                    <option>Instagram</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold uppercase tracking-wider text-slate-600">Post Text</span>
                  <textarea className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-secondary" rows={3} placeholder="Write your post..." value={socialText} onChange={(e) => setSocialText(e.target.value)} />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold uppercase tracking-wider text-slate-600">Schedule</span>
                  <input type="datetime-local" className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-secondary" value={socialSchedule} onChange={(e) => setSocialSchedule(e.target.value)} />
                </label>
                <button className="w-full rounded-lg bg-primary py-3 font-bold !text-white hover:bg-primary/90" type="button" onClick={handleScheduleSocial}>Schedule Post</button>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-6 soft-shadow">
              <h3 className="mb-5 text-xl font-bold text-primary">Scheduled Posts</h3>
              {socialPostsList.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-8 text-slate-400">
                  <Icon name="calendar_month" className="text-4xl" />
                  <p className="text-sm font-semibold">No posts scheduled</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {socialPostsList.map((post) => (
                    <div key={post.id} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${platformColors[post.platform] || 'bg-slate-100 text-slate-600'}`}>{post.platform}</span>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${post.status === 'Published' ? 'bg-emerald-100 text-emerald-700' : post.status === 'Scheduled' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>{post.status}</span>
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm text-slate-700">{post.text}</p>
                      <p className="mt-1 text-xs text-slate-400">{post.scheduled}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>

      </div>
      )}
    </AdminLayout>
  );
}

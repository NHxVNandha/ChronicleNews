import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { DayPicker } from 'react-day-picker';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { AdminPageHeader, AdminPanel, AdminSectionHeader, AdminStatCard, AdminStatusBadge } from '../../components/admin';
import { AdminLayout } from '../../layouts/AdminLayout';
import { queryKeys } from '../../lib/queryKeys';
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

const pushSchema = z.object({
  pushTitle: z.string().trim().min(5, 'Notification title must be at least 5 characters.'),
  pushBody: z.string().trim().min(10, 'Notification body must be at least 10 characters.'),
  pushSchedule: z.string().trim().min(1, 'Choose when to send the notification.'),
});

const newsletterSchema = z.object({
  newsletterTitle: z.string().trim().min(5, 'Campaign title must be at least 5 characters.'),
});

const socialSchema = z.object({
  socialPlatform: z.string().trim().min(1, 'Platform is required.'),
  socialText: z.string().trim().min(10, 'Post text must be at least 10 characters.'),
  socialSchedule: z.string().trim().min(1, 'Schedule time is required.'),
});

type PushFormValues = z.infer<typeof pushSchema>;
type NewsletterFormValues = z.infer<typeof newsletterSchema>;
type SocialFormValues = z.infer<typeof socialSchema>;

function formatDateInput(value: Date | undefined) {
  if (!value) {
    return '';
  }

  const year = value.getFullYear();
  const month = `${value.getMonth() + 1}`.padStart(2, '0');
  const day = `${value.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function combineScheduleValue(date: Date | undefined, time: string) {
  if (!date || !time) {
    return '';
  }

  return `${formatDateInput(date)}T${time}`;
}

export function AdminEngagementHub() {
  const queryClient = useQueryClient();
  const [comments, setComments] = useState<ModerationComment[]>([]);
  const [campaigns, setCampaigns] = useState<NotifCampaign[]>([]);
  const [subscribers, setSubscribers] = useState<SubscriberSummary[]>([]);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<CommentStatus | 'All'>('All');
  const [searchText, setSearchText] = useState('');
  const [articleFilter, setArticleFilter] = useState('All');
  const [replyOpen, setReplyOpen] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [pushHistory, setPushHistory] = useState<{ title: string; sent: string; status: string }[]>([]);
  const [newsletterStatus, setNewsletterStatus] = useState('');
  const [socialPostsList, setSocialPostsList] = useState<SocialPost[]>(socialPosts);
  const [pushScheduleDay, setPushScheduleDay] = useState<Date | undefined>();
  const [pushScheduleTime, setPushScheduleTime] = useState('09:00');
  const [socialScheduleDay, setSocialScheduleDay] = useState<Date | undefined>();
  const [socialScheduleTime, setSocialScheduleTime] = useState('09:00');
  const { register: registerPush, handleSubmit: handlePushSubmit, watch: watchPush, reset: resetPush, formState: { errors: pushErrors } } = useForm<PushFormValues>({
    resolver: zodResolver(pushSchema),
    defaultValues: { pushTitle: '', pushBody: '', pushSchedule: 'now' },
  });
  const { register: registerNewsletter, handleSubmit: handleNewsletterSubmit, reset: resetNewsletter, formState: { errors: newsletterErrors } } = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { newsletterTitle: '' },
  });
  const { register: registerSocial, handleSubmit: handleSocialSubmit, reset: resetSocial, setValue: setSocialValue, formState: { errors: socialErrors } } = useForm<SocialFormValues>({
    resolver: zodResolver(socialSchema),
    defaultValues: { socialPlatform: 'Twitter / X', socialText: '', socialSchedule: '' },
  });

  const pushValues = watchPush();
  const engagementQuery = useQuery({
    queryKey: queryKeys.engagement.overview,
    queryFn: async () => {
      const [comments, campaigns, subscribers] = await Promise.all([
        getComments(),
        getCampaigns(),
        getSubscriberSummary(),
      ]);

      return { comments, campaigns, subscribers };
    },
  });

  useEffect(() => {
    if (!engagementQuery.data) {
      return;
    }

    setComments(engagementQuery.data.comments);
    setCampaigns(engagementQuery.data.campaigns);
    setSubscribers(engagementQuery.data.subscribers);
  }, [engagementQuery.data]);

  useEffect(() => {
    if (engagementQuery.error) {
      setError(engagementQuery.error instanceof Error ? engagementQuery.error.message : 'Failed to load engagement data.');
    }
  }, [engagementQuery.error]);

  const updateCommentStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: CommentStatus }) => changeCommentStatus(id, status),
    onMutate: async ({ id, status }) => {
      const previousComments = comments;
      setComments((current) => current.map((c) => c.id === id ? { ...c, status } : c));
      return { previousComments };
    },
    onSuccess: (updated, variables) => {
      setComments((current) => current.map((c) => c.id === variables.id ? updated : c));
      void queryClient.invalidateQueries({ queryKey: queryKeys.engagement.overview });
      toast.success(`Comment ${variables.status.toLowerCase()}.`);
    },
    onError: (_error, _variables, context) => {
      if (context?.previousComments) {
        setComments(context.previousComments);
      }
    },
  });

  const addCommentReplyMutation = useMutation({
    mutationFn: ({ commentId, text }: { commentId: string; text: string }) => addCommentReply(commentId, text),
    onSuccess: (reply, variables) => {
      setComments((current) => current.map((c) => c.id === variables.commentId ? { ...c, replies: [...c.replies, reply] } : c));
      setReplyText('');
      setReplyOpen(null);
      void queryClient.invalidateQueries({ queryKey: queryKeys.engagement.overview });
      toast.success('Reply added.');
    },
  });

  const createCampaignMutation = useMutation({
    mutationFn: ({ title, type, audience }: { title: string; type: 'Newsletter'; audience: string }) => createCampaign({ title, type, audience }),
    onMutate: async ({ title, type, audience }) => {
      const previousCampaigns = campaigns;
      const optimisticCampaign: NotifCampaign = {
        id: `optimistic-${Date.now()}`,
        title,
        type,
        audience,
        sent: '',
        openRate: '',
        status: 'Draft',
      };
      setCampaigns((current) => [optimisticCampaign, ...current]);
      return { previousCampaigns };
    },
    onSuccess: (created) => {
      setCampaigns((current) => [created, ...current.filter((campaign) => !campaign.id.startsWith('optimistic-'))]);
      void queryClient.invalidateQueries({ queryKey: queryKeys.engagement.overview });
      toast.success('Campaign created.');
    },
    onError: (_error, _variables, context) => {
      if (context?.previousCampaigns) {
        setCampaigns(context.previousCampaigns);
      }
    },
  });

  const sampleArticles = Array.from(new Set(comments.map((comment) => comment.articleTitle)));

  async function updateCommentStatus(id: string, status: CommentStatus) {
    await updateCommentStatusMutation.mutateAsync({ id, status });
  }

  async function handleReply(commentId: string) {
    if (!replyText.trim()) return;
    await addCommentReplyMutation.mutateAsync({ commentId, text: replyText.trim() });
  }

  const handleSendPush = handlePushSubmit((values) => {
    if (values.pushSchedule !== 'now' && !pushScheduleDay) {
      toast.error('Choose a schedule date before sending the notification.');
      return;
    }

    const now = new Date().toLocaleString('id-ID');
    const status = values.pushSchedule === 'now' ? 'Sent' : 'Scheduled';
    const scheduledAt = values.pushSchedule === 'now' ? now : combineScheduleValue(pushScheduleDay, pushScheduleTime);
    setPushHistory((prev) => [{ title: values.pushTitle, sent: scheduledAt, status }, ...prev]);
    resetPush({ pushTitle: '', pushBody: '', pushSchedule: 'now' });
    setPushScheduleDay(undefined);
    setPushScheduleTime('09:00');
    toast.success(status === 'Sent' ? 'Notification sent.' : 'Notification scheduled.');
  });

  const handleSendNewsletter = handleNewsletterSubmit(async (values) => {
    await createCampaignMutation.mutateAsync({ title: values.newsletterTitle, type: 'Newsletter', audience: 'All Subscribers' });
    setNewsletterStatus(`"${values.newsletterTitle}" will be sent to subscribers.`);
    resetNewsletter({ newsletterTitle: '' });
  });

  const handleScheduleSocial = handleSocialSubmit((values) => {
    const newPost: SocialPost = {
      id: Date.now(),
      platform: values.socialPlatform,
      text: values.socialText,
      scheduled: values.socialSchedule,
      status: 'Scheduled',
    };
    setSocialPostsList((prev) => [newPost, ...prev]);
    resetSocial({ socialPlatform: values.socialPlatform, socialText: '', socialSchedule: '' });
    setSocialScheduleDay(undefined);
    setSocialScheduleTime('09:00');
    toast.success('Social post scheduled.');
  });

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
      {engagementQuery.isLoading ? (
        <div className="space-y-8">
          <SkeletonBlock className="h-12" />
          <SkeletonBlock className="h-[600px]" />
        </div>
      ) : (
      <div className="space-y-10 lg:space-y-12">
        {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}

        <div>
          <AdminPageHeader
            eyebrow="Audience Operations"
            title="Engagement Center"
            description="Comments, campaigns, and audience signals grouped into one modern moderation and outreach workspace."
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {newsletterStats.map((stat, index) => (
            <div key={stat.label}>
              <AdminStatCard
                label={stat.label}
                value={stat.value}
                delta={stat.delta}
                icon={index === 0 ? 'groups' : index === 1 ? 'mark_email_read' : index === 2 ? 'ads_click' : 'error'}
                tone={index === 0 ? 'blue' : 'default'}
                variant={index === 0 ? 'primary' : 'compact'}
              />
            </div>
          ))}
        </div>

        {/* ── Section 1: Comments Moderation ── */}
        <div>
        <AdminPanel>
          <AdminSectionHeader
            icon={<Icon name="forum" className="text-[20px]" />}
            title="Comments Moderation"
            description="Internal editorial comments, corrections, and review notes across articles."
            bordered={false}
          />

          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                {statusTabs.map((tab) => (
                  <button
                    key={tab.key}
                    className={`rounded-xl px-4 py-2 text-sm font-bold transition ${statusFilter === tab.key ? 'bg-slate-950 !text-white shadow-lg shadow-slate-950/10' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
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
                    className="w-48 rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-slate-300 focus:bg-white"
                    placeholder="Search comments..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </div>
                <select
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-slate-300 focus:bg-white"
                  value={articleFilter}
                  onChange={(e) => setArticleFilter(e.target.value)}
                >
                  <option value="All">All Articles</option>
                  {sampleArticles.map((title) => <option key={title} value={title}>{title}</option>)}
                </select>
                <button
                  className="rounded-xl bg-emerald-100 px-4 py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-200"
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
                          <AdminStatusBadge status={comment.status === 'Pending' ? 'pending' : comment.status === 'Approved' ? 'approved' : comment.status === 'Hidden' ? 'hidden' : 'flagged'}>{comment.status}</AdminStatusBadge>
                          <span className="text-sm font-semibold text-slate-700">{comment.author}</span>
                          <span className="text-xs text-slate-400">{comment.date}</span>
                          <span className="text-xs text-slate-400">on <span className="font-semibold text-slate-600">{comment.articleTitle}</span></span>
                        </div>
                        <p className="mt-3 text-primary">{comment.text}</p>
                        {comment.replies.length > 0 && (
                          <div className="ml-6 mt-3 space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-4">
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
                            <button className="rounded-xl bg-secondary px-4 py-2 text-sm font-bold !text-white" type="button" onClick={() => handleReply(comment.id)}>Send</button>
                            <button className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-bold text-slate-600" type="button" onClick={() => { setReplyOpen(null); setReplyText(''); }}>Cancel</button>
                          </div>
                        )}
                      </div>
                      <div className="flex shrink-0 flex-wrap gap-2">
                        {comment.status !== 'Approved' && (
                          <button className="rounded-xl bg-emerald-100 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-200" type="button" onClick={() => void updateCommentStatus(comment.id, 'Approved')}>Approve</button>
                        )}
                        {comment.status !== 'Hidden' && (
                          <button className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200" type="button" onClick={() => void updateCommentStatus(comment.id, 'Hidden')}>Hide</button>
                        )}
                        {comment.status !== 'Flagged' && (
                          <button className="rounded-xl bg-red-100 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-200" type="button" onClick={() => void updateCommentStatus(comment.id, 'Flagged')}>Flag</button>
                        )}
                        <button
                          className={`rounded-xl px-3 py-2 text-xs font-bold ${replyOpen === comment.id ? 'bg-slate-950 !text-white' : 'bg-blue-100 text-secondary hover:bg-blue-200'}`}
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
        </AdminPanel>
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

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {readerMetrics.map((metric, index) => (
              <AdminStatCard key={metric.label} label={metric.label} value={metric.value} delta={metric.delta} icon={metric.icon} tone={index === 0 ? 'blue' : 'default'} variant={index === 0 ? 'primary' : 'compact'} />
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
                  <input className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-secondary" placeholder="Breaking: ..." {...registerPush('pushTitle')} />
                  {pushErrors.pushTitle && <p className="mt-2 text-sm font-semibold text-red-600">{pushErrors.pushTitle.message}</p>}
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold uppercase tracking-wider text-slate-600">Body</span>
                  <textarea className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-secondary" rows={3} placeholder="Notification message..." {...registerPush('pushBody')} />
                  {pushErrors.pushBody && <p className="mt-2 text-sm font-semibold text-red-600">{pushErrors.pushBody.message}</p>}
                </label>
                <div className="flex flex-wrap items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input type="radio" value="now" {...registerPush('pushSchedule')} checked={pushValues.pushSchedule === 'now'} />
                    <span className="text-sm font-semibold text-slate-700">Send now</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" value="schedule" {...registerPush('pushSchedule')} checked={pushValues.pushSchedule !== 'now'} />
                    <span className="text-sm font-semibold text-slate-700">Schedule</span>
                  </label>
                  {pushValues.pushSchedule !== 'now' && (
                    <div className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 lg:grid-cols-[1fr_180px]">
                      <DayPicker mode="single" selected={pushScheduleDay} onSelect={setPushScheduleDay} className="mx-auto" />
                      <div>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Send Time</label>
                        <input type="time" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none" value={pushScheduleTime} onChange={(e) => setPushScheduleTime(e.target.value)} />
                      </div>
                    </div>
                  )}
                </div>
                {pushErrors.pushSchedule && <p className="text-sm font-semibold text-red-600">{pushErrors.pushSchedule.message}</p>}
                <button className="w-full rounded-lg bg-primary py-3 font-bold !text-white hover:bg-primary/90" type="button" onClick={() => void handleSendPush()}>
                  {pushValues.pushSchedule === 'now' ? 'Send Notification' : 'Schedule Notification'}
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
                  <input className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-secondary" placeholder="e.g. Weekend Edition" {...registerNewsletter('newsletterTitle')} />
                  {newsletterErrors.newsletterTitle && <p className="mt-2 text-sm font-semibold text-red-600">{newsletterErrors.newsletterTitle.message}</p>}
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
                <button className="w-full rounded-lg bg-primary py-3 font-bold !text-white hover:bg-primary/90" type="button" onClick={() => void handleSendNewsletter()}>Create & Send</button>
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
                  <select className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-secondary" {...registerSocial('socialPlatform')}>
                    <option>Twitter / X</option>
                    <option>Facebook</option>
                    <option>LinkedIn</option>
                    <option>Instagram</option>
                  </select>
                  {socialErrors.socialPlatform && <p className="mt-2 text-sm font-semibold text-red-600">{socialErrors.socialPlatform.message}</p>}
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold uppercase tracking-wider text-slate-600">Post Text</span>
                  <textarea className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-secondary" rows={3} placeholder="Write your post..." {...registerSocial('socialText')} />
                  {socialErrors.socialText && <p className="mt-2 text-sm font-semibold text-red-600">{socialErrors.socialText.message}</p>}
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold uppercase tracking-wider text-slate-600">Schedule</span>
                  <div className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 lg:grid-cols-[1fr_180px]">
                    <DayPicker mode="single" selected={socialScheduleDay} onSelect={(date) => { setSocialScheduleDay(date); setSocialValue('socialSchedule', combineScheduleValue(date, socialScheduleTime), { shouldDirty: true, shouldValidate: true }); }} className="mx-auto" />
                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Post Time</label>
                      <input type="time" className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none focus:border-secondary" value={socialScheduleTime} onChange={(e) => { const nextTime = e.target.value; setSocialScheduleTime(nextTime); setSocialValue('socialSchedule', combineScheduleValue(socialScheduleDay, nextTime), { shouldDirty: true, shouldValidate: true }); }} />
                    </div>
                  </div>
                  {socialErrors.socialSchedule && <p className="mt-2 text-sm font-semibold text-red-600">{socialErrors.socialSchedule.message}</p>}
                </label>
                <button className="w-full rounded-lg bg-primary py-3 font-bold !text-white hover:bg-primary/90" type="button" onClick={() => void handleScheduleSocial()}>Schedule Post</button>
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

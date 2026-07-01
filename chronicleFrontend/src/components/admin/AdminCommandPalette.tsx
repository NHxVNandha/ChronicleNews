import { Command } from 'cmdk';
import { Icon } from '../ui';

type CommandArticle = {
  slug: string;
  title: string;
  status: string;
  category?: string;
};

type AdminCommandPaletteProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  articles: CommandArticle[];
  isLoadingArticles: boolean;
  onNavigate: (path: string) => void;
};

type StaticCommand = {
  id: string;
  label: string;
  group: 'Navigation' | 'Editorial' | 'Workspace';
  path: string;
  keywords?: string[];
  icon?: string;
};

const staticCommands: StaticCommand[] = [
  { id: 'dashboard', label: 'Dashboard', group: 'Navigation', path: '/admin', icon: 'grid_view', keywords: ['overview', 'home'] },
  { id: 'content', label: 'Content', group: 'Navigation', path: '/admin/content', icon: 'description', keywords: ['articles', 'editorial'] },
  { id: 'layouts', label: 'Layouts', group: 'Navigation', path: '/admin/layouts', icon: 'view_quilt', keywords: ['templates'] },
  { id: 'assets', label: 'Assets', group: 'Navigation', path: '/admin/assets', icon: 'photo_library', keywords: ['media'] },
  { id: 'optimization', label: 'Optimization', group: 'Navigation', path: '/admin/optimization', icon: 'travel_explore', keywords: ['seo', 'ai'] },
  { id: 'engagement', label: 'Engagement', group: 'Navigation', path: '/admin/engagement', icon: 'forum', keywords: ['comments', 'campaigns'] },
  { id: 'monetization', label: 'Monetization', group: 'Navigation', path: '/admin/monetization', icon: 'ads_click', keywords: ['revenue', 'ads'] },
  { id: 'settings', label: 'Settings', group: 'Navigation', path: '/admin/settings', icon: 'settings', keywords: ['workspace', 'team'] },
  { id: 'activity', label: 'Activity Log', group: 'Navigation', path: '/admin/activity', icon: 'history', keywords: ['logs'] },
  { id: 'profile', label: 'Profile', group: 'Navigation', path: '/admin/profile', icon: 'badge', keywords: ['account'] },

  { id: 'new-article', label: 'Create New Article', group: 'Editorial', path: '/admin/articles/new', icon: 'add', keywords: ['write', 'draft'] },
  { id: 'review', label: 'Open Review Queue', group: 'Editorial', path: '/admin/review', icon: 'rate_review', keywords: ['approval'] },
  { id: 'calendar', label: 'Open Publishing Calendar', group: 'Editorial', path: '/admin/calendar', icon: 'calendar_month', keywords: ['schedule'] },

  { id: 'comments', label: 'Comments Moderation', group: 'Workspace', path: '/admin/comments', icon: 'forum', keywords: ['discussion'] },
  { id: 'seo', label: 'SEO Settings', group: 'Workspace', path: '/admin/seo', icon: 'travel_explore', keywords: ['search'] },
  { id: 'ai-settings', label: 'AI Settings', group: 'Workspace', path: '/admin/ai-settings', icon: 'auto_fix_high', keywords: ['assistant'] },
  { id: 'notifications', label: 'Notifications', group: 'Workspace', path: '/admin/notifications', icon: 'notifications_active', keywords: ['push'] },
];

function groupCommands(group: StaticCommand['group']) {
  return staticCommands.filter((item) => item.group === group);
}

export function AdminCommandPalette({ open, onOpenChange, articles, isLoadingArticles, onNavigate }: AdminCommandPaletteProps) {
  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      label="Admin command palette"
      className="fixed inset-0 z-[120] flex items-start justify-center bg-slate-950/45 px-4 pt-[12vh] backdrop-blur-sm"
    >
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/10">
        <div className="border-b border-slate-200 px-4 py-3">
          <Command.Input
            placeholder="Search pages, actions, or articles..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
          />
        </div>

        <Command.List className="max-h-[65vh] overflow-y-auto p-3">
          <Command.Empty>
            <div className="px-3 py-10 text-center">
              <p className="font-semibold text-slate-900">No matching commands</p>
              <p className="mt-1 text-sm text-slate-500">Try a page name, article title, or workflow action.</p>
            </div>
          </Command.Empty>

          <Command.Group heading="Navigation" className="mb-3">
            {groupCommands('Navigation').map((item) => (
              <Command.Item
                key={item.id}
                value={[item.label, ...(item.keywords ?? [])].join(' ')}
                onSelect={() => onNavigate(item.path)}
                className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-3 text-sm data-[selected=true]:bg-slate-100"
              >
                <span className="flex items-center gap-3">
                  {item.icon && <Icon name={item.icon} className="text-base text-slate-500" />}
                  <span className="font-medium text-slate-900">{item.label}</span>
                </span>
              </Command.Item>
            ))}
          </Command.Group>

          <Command.Group heading="Editorial" className="mb-3">
            {groupCommands('Editorial').map((item) => (
              <Command.Item
                key={item.id}
                value={[item.label, ...(item.keywords ?? [])].join(' ')}
                onSelect={() => onNavigate(item.path)}
                className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-3 text-sm data-[selected=true]:bg-slate-100"
              >
                <span className="flex items-center gap-3">
                  {item.icon && <Icon name={item.icon} className="text-base text-slate-500" />}
                  <span className="font-medium text-slate-900">{item.label}</span>
                </span>
              </Command.Item>
            ))}
          </Command.Group>

          <Command.Group heading="Workspace" className="mb-3">
            {groupCommands('Workspace').map((item) => (
              <Command.Item
                key={item.id}
                value={[item.label, ...(item.keywords ?? [])].join(' ')}
                onSelect={() => onNavigate(item.path)}
                className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-3 text-sm data-[selected=true]:bg-slate-100"
              >
                <span className="flex items-center gap-3">
                  {item.icon && <Icon name={item.icon} className="text-base text-slate-500" />}
                  <span className="font-medium text-slate-900">{item.label}</span>
                </span>
              </Command.Item>
            ))}
          </Command.Group>

          <Command.Group heading="Articles">
            {isLoadingArticles ? (
              <div className="px-3 py-4 text-sm text-slate-500">Loading articles...</div>
            ) : (
              articles.map((article) => (
                <Command.Item
                  key={article.slug}
                  value={[article.title, article.slug, article.category ?? '', article.status].join(' ')}
                  onSelect={() => onNavigate(`/admin/articles/${article.slug}/edit`)}
                  className="flex cursor-pointer items-start justify-between rounded-xl px-3 py-3 text-sm data-[selected=true]:bg-slate-100"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900">{article.title}</p>
                    <p className="mt-1 truncate text-xs text-slate-500">{article.category ? `${article.category} · ` : ''}{article.status}</p>
                  </div>
                  <Icon name="chevron_right" className="mt-0.5 text-sm text-slate-400" />
                </Command.Item>
              ))
            )}
          </Command.Group>
        </Command.List>

        <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-xs text-slate-500">
          <span>Press Enter to open</span>
          <span>Esc to close</span>
        </div>
      </div>
    </Command.Dialog>
  );
}

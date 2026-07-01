import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Badge,
  Bell,
  BellRing,
  BookImage,
  BookMarked,
  BookOpenText,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  ClipboardList,
  Clock3,
  CloudDownload,
  CloudUpload,
  Copy,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  FileCheck2,
  FileSearch,
  FileSpreadsheet,
  FileText,
  FolderX,
  Gavel,
  HardDrive,
  History,
  Image,
  Inbox,
  Info,
  LayoutGrid,
  LayoutTemplate,
  Link2,
  Link2Off,
  List,
  Mail,
  Map,
  Menu,
  MessageCircleMore,
  MonitorPlay,
  MousePointerClick,
  Pencil,
  Play,
  Plus,
  Radio,
  RefreshCw,
  Search,
  SearchCheck,
  Send,
  Settings,
  Share2,
  ShieldCheck,
  SquarePen,
  Star,
  StickyNote,
  Timer,
  Trash2,
  Trash,
  TrendingUp,
  Type,
  Users,
  WandSparkles,
  Workflow,
  X,
  UserMinus,
  UserPlus,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import type { Article } from '../data';

const iconMap: Record<string, LucideIcon> = {
  account_tree: Workflow,
  add: Plus,
  add_photo_alternate: Image,
  ads_click: MousePointerClick,
  api: FileSpreadsheet,
  arrow_forward: ArrowRight,
  article: FileText,
  assignment: ClipboardList,
  auto_fix_high: WandSparkles,
  badge: Badge,
  bookmark: BookMarked,
  bolt: Zap,
  calendar_month: CalendarDays,
  campaign: Send,
  check_circle: CheckCircle2,
  chevron_right: ChevronRight,
  close: X,
  cloud_download: CloudDownload,
  cloud_upload: CloudUpload,
  content_copy: Copy,
  delete: Trash,
  delete_forever: Trash2,
  description: FileText,
  download: Download,
  dynamic_feed: BookOpenText,
  edit: Pencil,
  edit_note: SquarePen,
  expand_more: ChevronDown,
  forum: MessageCircleMore,
  folder_delete: FolderX,
  gavel: Gavel,
  grid_view: LayoutGrid,
  groups: Users,
  history: History,
  image: Image,
  inbox: Inbox,
  info: Info,
  link: Link2,
  link_off: Link2Off,
  list: List,
  logout: ArrowRight,
  mail: Mail,
  map: Map,
  mark_email_read: Mail,
  menu: Menu,
  notifications: Bell,
  notifications_active: BellRing,
  online_prediction: Radio,
  open_in_new: ExternalLink,
  person_add: UserPlus,
  person_remove: UserMinus,
  photo_library: BookImage,
  play_arrow: Play,
  play_circle: MonitorPlay,
  podcasts: Radio,
  publish: Send,
  'push-schedule': BellRing,
  rate_review: FileSearch,
  refresh: RefreshCw,
  repeat: RefreshCw,
  schedule: Clock3,
  search: Search,
  search_off: EyeOff,
  settings: Settings,
  share: Share2,
  sticky_note_2: StickyNote,
  storage: HardDrive,
  swipe: MousePointerClick,
  tag: Star,
  task_alt: Check,
  timer: Timer,
  title: Type,
  today: CalendarDays,
  travel_explore: SearchCheck,
  trending_up: TrendingUp,
  verified: ShieldCheck,
  view_quilt: LayoutTemplate,
  visibility: Eye,
  warning: CircleAlert,
  workspace_premium: FileCheck2,
};

export function Icon({ name, className = '' }: { name: string; className?: string }) {
  const LucideIcon = iconMap[name];

  if (LucideIcon) {
    return <LucideIcon aria-hidden="true" className={`inline-block h-[1em] w-[1em] shrink-0 ${className}`} strokeWidth={1.9} />;
  }

  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}

export function Avatar({ src, alt, size = 'h-10 w-10' }: { src: string; alt: string; size?: string }) {
  return (
    <div className={`${size} overflow-hidden rounded-full border border-slate-200 bg-slate-100`}>
      <img className="h-full w-full object-cover" src={src} alt={alt} />
    </div>
  );
}

export function ArticleCard({ article, compact = false }: { article: Article; compact?: boolean }) {
  return (
    <Link to={`/news/${article.slug}`} className="group block overflow-hidden rounded-xl border border-slate-200 bg-white soft-shadow transition hover:-translate-y-1 hover:shadow-xl">
      <div className="aspect-video overflow-hidden bg-slate-200">
        <img className="h-full w-full object-cover transition duration-500 group-hover:scale-105" src={article.image} alt="" />
      </div>
      <div className={compact ? 'p-5' : 'p-6'}>
        <div className="mb-4 flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-widest">
          <span className="text-secondary">{article.category}</span>
          <span className="text-slate-400">{article.date.split(',')[0]}</span>
        </div>
        <h3 className="font-display mb-3 text-2xl font-semibold leading-tight text-primary transition group-hover:text-secondary">
          {article.title}
        </h3>
        <p className="line-clamp-2 text-slate-600">{article.summary}</p>
      </div>
    </Link>
  );
}

export function ImagePanel({ image, className = '' }: { image: string; className?: string }) {
  return <div className={`bg-cover bg-center ${className}`} style={{ backgroundImage: `url(${image})` }} />;
}

export function Field({ label, placeholder, icon, type = 'text' }: { label: string; placeholder: string; icon: string; type?: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold uppercase tracking-wider text-slate-600">{label}</span>
      <span className="relative block">
        <Icon name={icon} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input className="w-full rounded-lg border border-slate-200 bg-slate-50 py-4 pl-11 pr-4 outline-none transition focus:border-secondary focus:ring-1 focus:ring-secondary" placeholder={placeholder} type={type} />
      </span>
    </label>
  );
}

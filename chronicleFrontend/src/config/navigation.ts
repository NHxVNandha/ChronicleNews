export const navItems = [
  { to: '/', label: 'Home' },
  { to: '/news', label: 'News' },
  { to: '/sections', label: 'Sections' },
  { to: '/multimedia', label: 'Multimedia' },
  { to: '/opinion', label: 'Opinion' },
  { to: '/about', label: 'About Us' },
];

export const adminItems = [
  { to: '/admin', label: 'Dashboard', icon: 'grid_view' },
  { to: '/admin/content', label: 'Content', icon: 'description' },
  { to: '/admin/layouts', label: 'Layouts', icon: 'view_quilt' },
  { to: '/admin/assets', label: 'Assets', icon: 'photo_library' },
  { to: '/admin/optimization', label: 'Optimization', icon: 'auto_fix_high' },
  { to: '/admin/engagement', label: 'Engagement', icon: 'forum' },
  { to: '/admin/monetization', label: 'Monetization', icon: 'ads_click' },
  { to: '/admin/settings', label: 'Settings', icon: 'settings' },
];

export const footerLinks = [
  { label: 'Newsletter', to: '/newsletter' },
  { label: 'Podcast', to: '/podcast' },
  { label: 'Regional News', to: '/regional' },
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Service', to: '/terms' },
  { label: 'Contact Editorial', to: '/contact' },
  { label: 'Archive', to: '/archive' },
];

export const topicList = ['Artificial Intelligence', 'Climate Policy', 'Global Trade', 'Public Health', 'Urbanism', 'Space Tech'];

export const adminProfileImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBKP9cCTrvo9epMFyNo1_SlIOMZTCOwo4Xkds9_ewk6id30Sd1eCpaT5QyvTk6QA9yTeX9AxBwnNRwakHbaM0KJduIjiVzc0GYN5jSbUrlUVKwcZJ0ETDBIPIvAl-W1zpYM-BexBxxpjlfHKavW29A_MY6BoKKk4V3BvaKHZh2lbfHasdqZhLxqxIopldffBPC0vI6ECfYfPlligAsMG7prmQ45jp-hWYnuqccYZOH6mvQ1v-pmfN21';

export const authorProfileImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCLJiaiiMMVZnyvhW1FyiqWN0RUK4D1Ni458-NODer0bs9KRuQxF8r6UcEwI7-r-p7OutxzFo4m8rA2lRIABW8i7IxdS4WgXoNHwU7uOkzQJc7vOieacb-UC8mP4HTVoKGISyZY1_DfvjXPBKduq7TXqOF0yYei0hTSAln6DHqmBH3jfOi7aaKZr6BvPVZJ1Quszoe1-BpHIKJNeyKQrAlrz2JcEmCts_Sy0DU2STWcZK7FdgN1wEYQ';

export function toSlug(value: string) {
  return value.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

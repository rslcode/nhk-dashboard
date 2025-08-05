import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'customers', title: 'Customers', href: paths.dashboard.customers, icon: 'users' },
  { key: 'carousel', title: 'Carousel', href: paths.dashboard.carousel, icon: 'images' },
  { key: 'news', title: 'News', href: paths.dashboard.news, icon: 'newspaper' },
  { key: 'attractions', title: 'Attractions', href: paths.dashboard.attractions, icon: 'map-pin' },
  { key: 'navigation', title: 'Navigation', href: paths.dashboard.navigation, icon: 'buildings' },
  { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
  { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
] satisfies NavItemConfig[];

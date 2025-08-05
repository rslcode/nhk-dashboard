import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { BuildingsIcon } from '@phosphor-icons/react/dist/ssr/Buildings';
import { ChartPieIcon } from '@phosphor-icons/react/dist/ssr/ChartPie';
import { GearSixIcon } from '@phosphor-icons/react/dist/ssr/GearSix';
import { ImagesIcon } from '@phosphor-icons/react/dist/ssr/Images';
import { MapPinIcon } from '@phosphor-icons/react/dist/ssr/MapPin';
import { NewspaperIcon } from '@phosphor-icons/react/dist/ssr/Newspaper';
import { UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';

export const navIcons = {
  'buildings': BuildingsIcon,
  'chart-pie': ChartPieIcon,
  'gear-six': GearSixIcon,
  'images': ImagesIcon,
  'map-pin': MapPinIcon,
  'newspaper': NewspaperIcon,
  user: UserIcon,
  users: UsersIcon,
} as Record<string, Icon>;

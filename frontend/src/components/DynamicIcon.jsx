import React from 'react';
import * as LucideIcons from 'lucide-react';

const iconMap = {
  // ไอคอนทั่วไป
  phone: LucideIcons.Phone,
  mail: LucideIcons.Mail,
  clock: LucideIcons.Clock,
  file: LucideIcons.FileText,
  shield: LucideIcons.Shield,
  lock: LucideIcons.Lock,
  user: LucideIcons.User,
  database: LucideIcons.Database,
  home: LucideIcons.Home,
  star: LucideIcons.Star,
  heart: LucideIcons.Heart,
  cart: LucideIcons.ShoppingCart,
  gift: LucideIcons.Gift,
  truck: LucideIcons.Truck,
  creditcard: LucideIcons.CreditCard,
  wallet: LucideIcons.Wallet,
  bell: LucideIcons.Bell,
  settings: LucideIcons.Settings,
  map: LucideIcons.Map,
  store: LucideIcons.Store,
  message: LucideIcons.MessageCircle,
  calendar: LucideIcons.Calendar,
  book: LucideIcons.Book,
  link: LucideIcons.Link,
  image: LucideIcons.Image,
  save: LucideIcons.Save,
  edit: LucideIcons.Edit,
  trash: LucideIcons.Trash,
  eye: LucideIcons.Eye,
  search: LucideIcons.Search,
  filter: LucideIcons.Filter,
  share: LucideIcons.Share,
  facebook: LucideIcons.Facebook,
  instagram: LucideIcons.Instagram,
  twitter: LucideIcons.Twitter,
  youtube: LucideIcons.Youtube,
  'message-square': LucideIcons.MessageSquare,
  'shield-check': LucideIcons.ShieldCheck,
  'lock-keyhole': LucideIcons.LockKeyhole,
  package: LucideIcons.Package,
  'refresh-cw': LucideIcons.RefreshCw,
  target: LucideIcons.Target,
  'bar-chart': LucideIcons.BarChart,
  'chevron-down': LucideIcons.ChevronDown,
  check: LucideIcons.Check,
  'alert-triangle': LucideIcons.AlertTriangle,
  'usercheck': LucideIcons.UserCheck,
  'barchart': LucideIcons.BarChart,
  'filetext': LucideIcons.FileText,
  'shoppingcart': LucideIcons.ShoppingCart,
  'creditcard': LucideIcons.CreditCard,
  'messagecircle': LucideIcons.MessageCircle,
  'help-circle': LucideIcons.HelpCircle,
  'bell-ring': LucideIcons.BellRing,

  // Special icons mapping (kebab case)
  'shopping-bag': LucideIcons.ShoppingBag,
  'refresh-cw': LucideIcons.RefreshCircle,

  // Camel case alternatives
  shoppingbag: LucideIcons.ShoppingBag,
  refreshcw: LucideIcons.RefreshCircle,

  // Base icons
  bag: LucideIcons.ShoppingBag,
  refresh: LucideIcons.RefreshCw,

  // Icon mapping with variations
  'messagesquare': LucideIcons.MessageSquare,
  'MessageSquare': LucideIcons.MessageSquare,
  'message': LucideIcons.MessageSquare, // Default to MessageSquare for 'message'
  'shoppingbag': LucideIcons.ShoppingBag,
  'ShoppingBag': LucideIcons.ShoppingBag,

  // Add shield variants
  'shield-check': LucideIcons.ShieldCheck,
  'shieldcheck': LucideIcons.ShieldCheck,
  'ShieldCheck': LucideIcons.ShieldCheck,
  'shield': LucideIcons.Shield,

  // Add message variants
  'message-square': LucideIcons.MessageSquare,
  'messagesquare': LucideIcons.MessageSquare,
  'MessageSquare': LucideIcons.MessageSquare,
  'message': LucideIcons.MessageCircle,
  'message-circle': LucideIcons.MessageCircle,

  // Add shopping variants  
  'shopping-cart': LucideIcons.ShoppingCart,
  'shoppingcart': LucideIcons.ShoppingCart,
  'shopping-bag': LucideIcons.ShoppingBag,
  'shoppingbag': LucideIcons.ShoppingBag,

  // Add bar chart variants
  'bar-chart': LucideIcons.BarChart,
  'barchart': LucideIcons.BarChart,
  'BarChart': LucideIcons.BarChart,

  // Add refresh variants
  'refresh-cw': LucideIcons.RefreshCw,
  'refreshcw': LucideIcons.RefreshCw,
  'refresh': LucideIcons.RefreshCw,
};

export const DynamicIcon = ({ name, className }) => {
  if (!name) return null;

  // แปลงชื่อให้เป็นตัวพิมพ์เล็กและรองรับหลายรูปแบบ
  const normalizedName = name.toLowerCase().replace(/[\s_]/g, '-');
  
  // ลองหาไอคอนจากทุกรูปแบบที่เป็นไปได้
  const Icon = iconMap[name] || 
               iconMap[normalizedName] || 
               iconMap[name.toLowerCase()] ||
               LucideIcons[name] ||
               LucideIcons[name.replace(/(^|-)(\w)/g, (_, p1, p2) => p2.toUpperCase())];

  if (!Icon) {
    console.warn(`Icon "${name}" not found`);
    return <LucideIcons.HelpCircle className={className} />;
  }

  return <Icon className={className} />;
};

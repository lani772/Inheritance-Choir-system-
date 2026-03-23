import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CalendarDays, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Music,
  ClipboardCheck,
  Banknote,
  MessageSquare,
  Megaphone,
  Heart,
  Music as MusicIcon,
  Shield,
  BarChart2,
  User,
  CheckSquare
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const location = useLocation();
  
  const navItems = [
    { id: '/', icon: LayoutDashboard, label: 'Dashboard', section: 'MAIN' },
    { id: '/members', icon: Users, label: 'Choir Members', section: 'MAIN' },
    { id: '/attendance', icon: ClipboardCheck, label: 'Attendance', section: 'MAIN' },
    { id: '/contributions', icon: Banknote, label: 'Contributions', section: 'MAIN' },
    { id: '/events', icon: CalendarDays, label: 'Events', section: 'MAIN' },
    { id: '/tasks', icon: CheckSquare, label: 'Tasks', section: 'MAIN' },
    { id: '/messages', icon: MessageSquare, label: 'Messages', section: 'MAIN' },
    { id: '/posts', icon: Megaphone, label: 'Posts', section: 'MAIN' },
    { id: '/welfare', icon: Heart, label: 'Welfare', section: 'MAIN' },
    { id: '/songs', icon: MusicIcon, label: 'Songs Library', section: 'MAIN' },
    { id: '/admin', icon: Shield, label: 'Admin Panel', section: 'ADMINISTRATION' },
    { id: '/reports', icon: BarChart2, label: 'Reports', section: 'ADMINISTRATION' },
    { id: '/profile', icon: User, label: 'My Profile', section: 'ACCOUNT' },
    { id: '/settings', icon: Settings, label: 'Settings', section: 'ACCOUNT' },
  ];

  const sections = ['MAIN', 'ADMINISTRATION', 'ACCOUNT'];

  return (
    <div className={cn(
      "min-h-screen bg-bg-surface border-r border-border-subtle flex flex-col transition-all duration-300 shrink-0 relative",
      collapsed ? "w-16" : "w-60"
    )}>
      {!collapsed && (
        <div className="absolute left-1.5 top-1/2 -translate-y-1/2 -rotate-90 text-[9px] text-gold/10 tracking-[7px] font-cinzel font-black whitespace-nowrap pointer-events-none select-none">
          INHERITANCE CHOIR
        </div>
      )}
      
      {/* Header */}
      <div className={cn(
        "border-b border-border-subtle flex items-center gap-2.5",
        collapsed ? "p-4" : "p-4"
      )}>
        <div className="w-9 h-9 rounded-lg bg-[radial-gradient(circle,rgba(201,168,76,0.2),rgba(201,168,76,0.04))] border border-border-gold flex items-center justify-center text-gold shrink-0 shadow-[0_0_20px_rgba(201,168,76,0.08)]">
          <Music size={18} />
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-cinzel font-black tracking-[1.5px] text-gold">INHERITANCE</div>
            <div className="text-[9px] text-text-muted tracking-[2px] mt-0.5">CHOIR SYSTEM</div>
          </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)} 
          className="bg-transparent border-none text-text-muted cursor-pointer p-1 shrink-0 hover:text-gold transition-colors"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto p-2.5">
        {sections.map(section => (
          <div key={section} className="mb-4">
            {!collapsed && <div className="text-[9px] font-bold text-text-muted tracking-[2px] px-2 pb-1.5 uppercase">{section}</div>}
            {navItems.filter(item => item.section === section).map(item => {
              const isActive = location.pathname === item.id || (item.id !== '/' && location.pathname.startsWith(item.id));
              const Icon = item.icon;
              return (
                <Link 
                  key={item.id} 
                  to={item.id}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg cursor-pointer mb-0.5 relative transition-all duration-150",
                    collapsed ? "p-2.5 justify-center" : "px-2.5 py-2",
                    isActive 
                      ? "bg-gold/10 border-l-2 border-gold text-gold-bright" 
                      : "bg-transparent border-l-2 border-transparent text-text-secondary hover:bg-white/5"
                  )}
                >
                  <Icon size={18} className="shrink-0" />
                  {!collapsed && <span className="text-xs font-medium flex-1">{item.label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

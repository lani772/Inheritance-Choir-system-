import { Menu, Search, Bell, LogOut } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface TopBarProps {
  onToggle: () => void;
  onLogout: () => void;
}

export default function TopBar({ onToggle, onLogout }: TopBarProps) {
  const location = useLocation();
  
  const getPageName = () => {
    switch(location.pathname) {
      case '/': return 'Dashboard';
      case '/members': return 'Member Directory';
      case '/attendance': return 'Mark Attendance';
      case '/contributions': return 'Contributions';
      case '/events': return 'Events & Rehearsals';
      case '/messages': return 'Messages';
      case '/posts': return 'Posts & Announcements';
      case '/welfare': return 'Welfare & Support';
      case '/songs': return 'Song Library';
      case '/admin': return 'Admin Panel';
      case '/reports': return 'Reports & Analytics';
      case '/profile': return 'My Profile';
      case '/settings': return 'Settings';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="h-14 bg-bg-surface border-b border-border-subtle flex items-center px-4 gap-3 sticky top-0 z-50">
      <button 
        onClick={onToggle} 
        className="bg-transparent border-none text-text-muted cursor-pointer p-1.5 shrink-0 hover:text-gold transition-colors"
      >
        <Menu size={20} />
      </button>
      
      <div className="text-xs text-text-muted min-w-0">
        <span className="text-gold font-cinzel text-[11px]">INHERITANCE CHOIR</span> · {getPageName()}
      </div>
      
      <div className="flex-1 max-w-xs ml-2">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            <Search size={14} />
          </span>
          <input 
            placeholder="Search... (⌘K)" 
            className="w-full py-1.5 pr-3.5 pl-8 bg-bg-input border border-border-default rounded-lg text-text-primary text-xs outline-none font-sans box-border focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all" 
          />
        </div>
      </div>
      
      <div className="ml-auto flex items-center gap-2">
        <button className="relative bg-transparent border border-border-subtle text-text-secondary rounded-lg p-1.5 cursor-pointer hover:bg-white/5 transition-colors">
          <Bell size={16} />
          <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-error rounded-full" />
        </button>
        
        <button 
          onClick={onLogout} 
          className="flex items-center gap-1.5 bg-error/10 border border-error/20 text-error rounded-lg px-3 py-1.5 cursor-pointer text-[11px] font-bold hover:bg-error/20 transition-colors ml-2"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </div>
  );
}

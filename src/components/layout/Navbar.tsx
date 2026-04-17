import { LayoutGrid, TestTube2, TrendingUp } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface NavbarProps {
  activeTab: 'exchange' | 'demo';
  onTabChange: (tab: 'exchange' | 'demo') => void;
}

export function Navbar({ activeTab, onTabChange }: NavbarProps) {
  return (
    <header className="h-16 px-8 flex items-center justify-between border-b border-border-subtle bg-card-bg sticky top-0 z-50">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => onTabChange('exchange')}>
        <div className="bg-accent-green w-7 h-7 rounded-md" />
        <span className="font-extrabold text-xl tracking-tighter text-text-primary">SmartFX <span className="text-[10px] bg-accent-blue px-1.5 py-0.5 rounded text-white font-bold ml-1 uppercase">Pro</span></span>
      </div>
      
      <nav className="flex gap-6">
        <button
          onClick={() => onTabChange('exchange')}
          className={cn(
            "text-sm font-medium px-3 py-2 rounded-md transition-all",
            activeTab === 'exchange' 
              ? "text-text-primary bg-white/5" 
              : "text-text-secondary hover:text-text-primary hover:bg-white/5"
          )}
        >
          Exchange
        </button>
        <button
          onClick={() => onTabChange('demo')}
          className={cn(
            "text-sm font-medium px-3 py-2 rounded-md transition-all",
            activeTab === 'demo' 
              ? "text-text-primary bg-white/5" 
              : "text-text-secondary hover:text-text-primary hover:bg-white/5"
          )}
        >
          Demo Testing
        </button>
      </nav>
    </header>
  );
}


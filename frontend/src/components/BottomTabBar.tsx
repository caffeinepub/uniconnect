import React from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { Home, ShoppingBag, Users, Calendar } from 'lucide-react';

const tabs = [
  { to: '/', label: 'Home', icon: Home, exact: true },
  { to: '/marketplace', label: 'Market', icon: ShoppingBag },
  { to: '/communities', label: 'Groups', icon: Users },
  { to: '/events', label: 'Events', icon: Calendar },
];

export default function BottomTabBar() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isActive = (to: string, exact?: boolean) => {
    if (exact) return currentPath === to;
    return currentPath.startsWith(to);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map(({ to, label, icon: Icon, exact }) => {
          const active = isActive(to, exact);
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-colors min-w-0 flex-1 ${
                active
                  ? 'text-teal'
                  : 'text-muted-foreground'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className={`text-[10px] font-medium ${active ? 'font-semibold' : ''}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

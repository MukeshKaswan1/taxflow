'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export default function MobileNav() {
  const pathname = usePathname();
  const { isAdmin } = useAuth();

  const navItems = [
    ...(isAdmin ? [{ href: '/', label: 'Dashboard' }] : []),
    { href: '/launch', label: 'Intake' },
    { href: '/jobs', label: isAdmin ? 'Runs' : 'My Runs' },
  ];

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="lg:hidden flex border-b border-slate-200 bg-white">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex-1 text-center py-3 text-sm font-semibold transition-colors ${
            isActive(item.href)
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

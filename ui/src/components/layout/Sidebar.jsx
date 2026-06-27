'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

function NavLink({ href, label, active }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${active
        ? 'bg-blue-50 text-blue-600 border border-blue-100'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
        }`}
    >
      {label}
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin, logout } = useAuth();

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const navItems = [
    ...(isAdmin ? [{ href: '/', label: 'Dashboard' }] : []),
    { href: '/launch', label: 'Initiate Verification' },
    { href: '/jobs', label: isAdmin ? 'All Verification Runs' : 'My Runs' },
  ];

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const displayRole = user?.role === 'spoc' ? 'Operator' : 'Administrator';

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 bg-white p-6 gap-8">
      <div>
        <h2 className="text-lg font-bold text-slate-800">TaxFlow Engine</h2>
        {user && (
          <p className="text-xs text-slate-500 mt-2 font-medium">
            {/* {user.displayName} */}
            <span className="ml-1 text-blue-600">{displayRole}</span>
          </p>
        )}
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        {navItems.map((item) => (
          <NavLink key={item.href} {...item} active={isActive(item.href)} />
        ))}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="text-sm text-slate-500 hover:text-slate-800 px-4 py-2.5 rounded-xl hover:bg-slate-50 text-left font-medium"
      >
        Sign out
      </button>
    </aside>
  );
}

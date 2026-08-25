'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, CalendarDays, BedDouble, Image as ImageIcon, MessageSquare, Settings, LogOut, Menu, X, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    // Verify admin session on client side
    fetch('/api/admin/session')
      .then((res) => {
        if (res.ok) {
          setAuthenticated(true);
        } else {
          router.push('/admin/login');
        }
      })
      .catch(() => {
        router.push('/admin/login');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch {
      // continue logout redirect
    }
    router.push('/admin/login');
    router.refresh();
  };

  // If this is the login page, render children directly without dashboard chrome
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Show loading spinner while checking authentication state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-400">Verifying Admin Authorization...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, return null as router will redirect
  if (!authenticated) {
    return null;
  }

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: Home },
    { label: 'Bookings', href: '/admin/bookings', icon: CalendarDays },
    { label: 'Rooms', href: '/admin/rooms', icon: BedDouble },
    { label: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
    { label: 'Messages', href: '/admin/messages', icon: MessageSquare },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col shadow-sm">
        <div className="h-20 flex items-center gap-3 px-7 border-b border-slate-100">
          <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-sm">AB</div>
          <div>
            <p className="font-semibold text-slate-900 text-base leading-tight">Arrow Beach</p>
            <p className="text-xs text-slate-500 font-medium">Admin Panel</p>
          </div>
        </div>
        
        <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 text-base font-semibold rounded-lg transition ${
                  active
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-100 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-600 rounded-lg hover:bg-slate-100 transition"
          >
            <ExternalLink size={18} />
            View Public Site
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-600 rounded-lg hover:bg-red-50 transition"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 z-50 transform transition-transform md:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">AB</div>
            <p className="font-semibold text-slate-900 text-base">Admin Panel</p>
          </div>
          <button onClick={() => setMobileOpen(false)} className="text-slate-500">
            <X size={22} />
          </button>
        </div>
        <nav className="py-4 px-3 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-base font-semibold rounded-lg transition ${
                  active ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-slate-100 space-y-1">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-600 rounded-lg hover:bg-slate-100 transition"
          >
            <ExternalLink size={18} />
            View Public Site
          </Link>
          <button
            onClick={() => {
              setMobileOpen(false);
              handleLogout();
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-600 rounded-lg hover:bg-red-50 transition"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shadow-sm">
          <button onClick={() => setMobileOpen(true)} className="md:hidden text-slate-600 hover:text-slate-900">
            <Menu size={24} />
          </button>
          <div className="hidden md:block">
            <p className="text-base text-slate-500">
              Welcome back, <span className="font-semibold text-slate-900">Admin</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50"
            >
              Sign Out
            </button>
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">A</div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

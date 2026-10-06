'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sparkles,
  LayoutDashboard,
  Search,
  Calendar,
  MessageSquare,
  Bot,
  Megaphone,
  Shield,
  CreditCard,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Zap,
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userStats, setUserStats] = useState<any>({
    plan: 'pro',
    postsUsados: 5,
    maxPosts: 100,
    closerUsados: 18,
    maxCloser: 1000,
  });

  useEffect(() => {
    fetch('/api/admin')
      .then((res) => res.json())
      .then((data) => {
        const demoUser = data?.users?.find((u: any) => u.userId === 'demo_user') || data?.users?.[0];
        if (demoUser) {
          setUserStats({
            plan: demoUser.plan,
            postsUsados: demoUser.postsUsados || 0,
            maxPosts: demoUser.plan === 'emprendedor' ? 30 : demoUser.plan === 'pro' ? 100 : 300,
            closerUsados: demoUser.closerRespuestasUsadas || 0,
            maxCloser: demoUser.plan === 'emprendedor' ? 200 : demoUser.plan === 'pro' ? 1000 : 3000,
          });
        }
      })
      .catch(() => {});
  }, [pathname]);

  const navItems = [
    { name: 'Resumen Principal', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Diagnóstico 360 & PDF', href: '/dashboard/diagnostico', icon: Search },
    { name: 'Fábrica 30 Posts & Ads', href: '/dashboard/contenido', icon: Calendar },
    { name: 'Closer de Ventas IA', href: '/dashboard/closer', icon: MessageSquare },
    { name: 'Bot Telegram Control', href: '/dashboard/telegram', icon: Bot },
    { name: 'Modo Agencia (Autoventa)', href: '/dashboard/agencia', icon: Megaphone },
    { name: 'Panel Super Admin', href: '/dashboard/admin', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="flex md:hidden items-center justify-between border-b border-slate-800 bg-[#0d1424] px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-white text-sm">
          <Sparkles className="h-5 w-5 text-indigo-400" />
          <span>SEGAR AI</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Sidebar Desktop & Mobile Drawer */}
      <aside
        className={`fixed md:sticky top-0 z-40 h-screen w-72 shrink-0 border-r border-slate-800/80 bg-[#0a0f1d] p-5 flex flex-col justify-between transition-transform md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 px-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <span className="font-extrabold tracking-tight text-white text-base">SEGAR AI</span>
              <span className="block text-[10px] font-semibold text-indigo-400 uppercase tracking-wider">Marketing Pyme</span>
            </div>
          </Link>

          {/* User / Plan Mini Card */}
          <div className="rounded-2xl border border-indigo-500/20 bg-indigo-950/20 p-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-400">Membresía:</span>
              <span className="rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-indigo-300 border border-indigo-500/30">
                Plan {userStats.plan}
              </span>
            </div>
            {/* Posts Progress */}
            <div className="space-y-1 mb-2">
              <div className="flex justify-between text-[11px] text-slate-300">
                <span>Posts del mes:</span>
                <span className="font-semibold text-white">{userStats.postsUsados} / {userStats.maxPosts}</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (userStats.postsUsados / userStats.maxPosts) * 100)}%` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium">
              <Zap className="h-3 w-3" />
              <span>Garantía $0 Costo: Free Tier Seguro</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition ${
                    active
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="border-t border-slate-800 pt-4 space-y-2">
          <Link
            href="/#planes"
            className="flex items-center justify-between rounded-xl bg-slate-800/80 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition"
          >
            <span className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-indigo-400" />
              <span>Mejorar Plan</span>
            </span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          </Link>

          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-400 hover:text-white transition"
          >
            <LogOut className="h-4 w-4" />
            <span>Volver a la Landing</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}

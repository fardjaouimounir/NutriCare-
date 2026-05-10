import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard, Users, FileText, Settings, LogOut,
  Menu, X, Shield, Bell, ChevronDown, Search,
  BarChart2, UserCheck, MessageSquare, Download
} from 'lucide-react';

export default function AdminLayout() {
  const { t, i18n } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, profile, user } = useAuth();

  const navGroups = [
    {
      label: i18n.language === 'ar' ? 'الرئيسية' : 'PRINCIPAL',
      items: [
        { to: '/admin', icon: LayoutDashboard, label: t('admin_dashboard'), exact: true },
        { to: '/admin/analytics', icon: BarChart2, label: t('admin_analytics') },
      ],
    },
    {
      label: i18n.language === 'ar' ? 'إدارة المستخدمين' : 'UTILISATEURS',
      items: [
        { to: '/admin/users', icon: Users, label: t('admin_users') },
        { to: '/admin/specialists', icon: UserCheck, label: t('admin_specialists') },
      ],
    },
    {
      label: i18n.language === 'ar' ? 'المحتوى' : 'CONTENU',
      items: [
        { to: '/admin/content', icon: FileText, label: t('admin_content') },
        { to: '/admin/community', icon: MessageSquare, label: t('nav_community') },
        { to: '/admin/notifications', icon: Bell, label: t('admin_notifications') },
      ],
    },
    {
      label: i18n.language === 'ar' ? 'النظام' : 'SYSTÈME',
      items: [
        { to: '/admin/reports', icon: Download, label: t('admin_reports') },
        { to: '/admin/settings', icon: Settings, label: t('admin_settings') },
      ],
    },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  const isActive = (item) => item.exact
    ? location.pathname === item.to
    : location.pathname.startsWith(item.to);

  const isRtl = i18n.language === 'ar';

  return (
    <div className={`min-h-screen flex bg-slate-50 font-sans ${isRtl ? 'text-right' : 'text-left'}`}>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 ${isRtl ? 'right-0 border-l' : 'left-0 border-r'} z-50 w-64 bg-white border-slate-100 shadow-xl
          flex flex-col transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : (isRtl ? 'translate-x-full' : '-translate-x-full')}
          lg:translate-x-0 lg:static lg:shadow-none lg:shrink-0
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center shadow-sm">
              <Shield size={19} />
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm leading-tight">{i18n.language === 'ar' ? 'لوحة الإدارة' : 'Admin Panel'}</p>
              <p className="text-xs text-slate-400">NutriCare Admin</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition">
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-5">
          {navGroups.map(group => (
            <div key={group.label}>
              <p className={`text-xs font-bold text-slate-400 uppercase tracking-widest px-3 mb-2 ${isRtl ? 'text-right' : 'text-left'}`}>{group.label}</p>
              <div className="space-y-0.5">
                {group.items.map(item => {
                  const active = isActive(item);
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setSidebarOpen(false)}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all
                        ${active
                          ? 'bg-rose-500 text-white shadow-sm shadow-rose-200'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }
                      `}
                    >
                      <item.icon size={17} className={active ? 'text-white' : 'text-slate-400'} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut size={18} className="text-slate-400" />
            {t('admin_logout')}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-100 flex items-center gap-4 px-5 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition"
          >
            <Menu size={21} />
          </button>

          {/* Search */}
          <div className="relative flex-1 max-w-sm hidden sm:block">
            <Search size={16} className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-slate-400`} />
            <input
              type="text"
              placeholder={t('admin_search')}
              className={`w-full ${isRtl ? 'pr-9 pl-4 text-right' : 'pl-9 pr-4 text-left'} py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl placeholder-slate-400 text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-400 transition`}
            />
          </div>

          <div className={`flex items-center gap-2 ${isRtl ? 'mr-auto' : 'ml-auto'}`}>
            {/* Notifications */}
            <button className="relative p-2.5 rounded-xl hover:bg-slate-100 text-slate-500 transition">
              <Bell size={19} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full"></span>
            </button>

            {/* Admin Profile */}
            <button className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 transition">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-pink-600 text-white flex items-center justify-center font-bold text-xs">
                {profile?.full_name?.charAt(0) || (isRtl ? 'م' : 'A')}
              </div>
              <div className={`${isRtl ? 'text-right' : 'text-left'} hidden sm:block`}>
                <p className="text-sm font-semibold text-slate-800 leading-tight">{profile?.full_name || (isRtl ? 'المشرف' : 'Admin')}</p>
                <p className="text-xs text-slate-400">{user?.email || ''}</p>
              </div>
              <ChevronDown size={15} className="text-slate-400" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-5 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}


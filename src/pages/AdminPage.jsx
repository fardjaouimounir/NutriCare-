import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Star, Bell, TrendingUp, Activity, UserCheck, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

export default function AdminPage() {
  const { t, i18n } = useTranslation();
  const [stats, setStats] = useState({ users: 0, articles: 0, recipes: 0, posts: 0, specialists: 0, notifications: 0 });
  const [recentUsers, setRecentUsers] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const [usersRes, articlesRes, recipesRes, postsRes, specialistsRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'patient'),
        supabase.from('articles').select('id', { count: 'exact' }),
        supabase.from('recipes').select('id', { count: 'exact' }),
        supabase.from('community_posts').select('id', { count: 'exact' }),
        supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'specialist'),
      ]);
      setStats({
        users: usersRes.count || 0,
        articles: articlesRes.count || 0,
        recipes: recipesRes.count || 0,
        posts: postsRes.count || 0,
        specialists: specialistsRes.count || 0,
      });

      // Recent users
      const { data: recent } = await supabase
        .from('profiles').select('full_name, treatment_phase, created_at')
        .order('created_at', { ascending: false }).limit(5);
      setRecentUsers(recent || []);

      // Activity: last 7 days signups
      const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(); d.setDate(d.getDate() - 6 + i);
        return d.toISOString().split('T')[0];
      });
      const { data: signups } = await supabase
        .from('profiles').select('created_at')
        .gte('created_at', days[0]);
      setActivityData(days.map(day => ({
        day: new Date(day).toLocaleDateString(i18n.language === 'ar' ? 'ar-DZ' : 'fr-FR', { weekday: 'short' }),
        value: (signups || []).filter(u => u.created_at?.startsWith(day)).length,
      })));
      setLoading(false);
    };
    fetchStats();
  }, [i18n.language]);

  const statCards = [
    { label: t('admin_users'), value: stats.users, icon: Users, color: 'from-rose-500 to-pink-500', bg: 'bg-rose-50', text: 'text-rose-600' },
    { label: t('admin_specialists'), value: stats.specialists, icon: UserCheck, color: 'from-violet-500 to-purple-500', bg: 'bg-violet-50', text: 'text-violet-600' },
    { label: i18n.language === 'ar' ? 'المقالات' : 'Articles', value: stats.articles, icon: BookOpen, color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50', text: 'text-blue-600' },
    { label: i18n.language === 'ar' ? 'الوصفات' : 'Recettes', value: stats.recipes, icon: Star, color: 'from-amber-500 to-orange-500', bg: 'bg-amber-50', text: 'text-amber-600' },
    { label: i18n.language === 'ar' ? 'منشورات المجتمع' : 'Posts Communauté', value: stats.posts, icon: MessageCircle, color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-50', text: 'text-emerald-600' },
  ];

  const phaseLabel = {
    newly_diagnosed: i18n.language === 'ar' ? 'تشخيص حديث' : 'Nouv. Diagnostiqué',
    chemotherapy: i18n.language === 'ar' ? 'كيماوي' : 'Chimiothérapie',
    radiation: i18n.language === 'ar' ? 'إشعاعي' : 'Radiothérapie',
    recovery: i18n.language === 'ar' ? 'تعافي' : 'Récupération',
    hormonal: i18n.language === 'ar' ? 'هرموني' : 'Hormonothérapie',
  };

  const isRtl = i18n.language === 'ar';

  return (
    <div className={`space-y-8 ${isRtl ? 'text-right' : 'text-left'}`}>
      <div>
        <h1 className="text-2xl font-bold text-slate-800">{t('admin_dashboard')}</h1>
        <p className="text-slate-500 text-sm mt-1">{i18n.language === 'ar' ? 'نظرة عامة على منصة SENOCARE' : 'Aperçu de la plateforme SENOCARE'}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-11 h-11 rounded-xl ${s.bg} ${s.text} flex items-center justify-center mb-4 mx-0`}><s.icon size={22} /></div>
            <div className="text-3xl font-bold text-slate-800 mb-1">{loading ? '—' : s.value}</div>
            <div className="text-xs text-slate-500 font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-slate-800 flex items-center gap-2"><TrendingUp size={20} className="text-rose-500" /> {i18n.language === 'ar' ? 'تسجيلات الأسبوع' : 'Inscriptions de la semaine'}</h2>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="adminGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="value" stroke="#f43f5e" strokeWidth={3} fill="url(#adminGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h2 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><Users size={20} className="text-rose-500" /> {i18n.language === 'ar' ? 'آخر المسجّلات' : 'Dernières inscriptions'}</h2>
          <div className="space-y-4">
            {recentUsers.length === 0 ? <p className="text-slate-400 text-sm text-center py-4">{i18n.language === 'ar' ? 'لا توجد بيانات' : 'Aucune donnée'}</p> :
              recentUsers.map((u, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 text-white flex items-center justify-center font-bold text-sm">
                    {u.full_name?.charAt(0) || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-700 truncate">{u.full_name || (i18n.language === 'ar' ? 'مجهول' : 'Inconnue')}</p>
                    <p className="text-xs text-slate-400">{phaseLabel[u.treatment_phase] || '—'}</p>
                  </div>
                  <span className="text-xs text-slate-400">{new Date(u.created_at).toLocaleDateString(i18n.language === 'ar' ? 'ar-DZ' : 'fr-FR', { month: 'short', day: 'numeric' })}</span>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}


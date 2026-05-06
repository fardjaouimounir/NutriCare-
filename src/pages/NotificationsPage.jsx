import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Bell, Heart, Apple, Droplet, Users, Trash2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const typeIcons = { meal: Apple, hydration: Droplet, community: Users, general: Bell, health: Heart };
const typeColors = { meal: 'text-primary', hydration: 'text-blue-500', community: 'text-accent', general: 'text-dark', health: 'text-success' };

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('الكل');

  const fetchNotifs = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);
    setNotifications(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchNotifs(); }, [user]);

  const markAllRead = async () => {
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id);
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const markRead = async (id) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const deleteNotif = async (id) => {
    await supabase.from('notifications').delete().eq('id', id);
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `منذ ${mins} دقيقة`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `منذ ${hrs} ساعة`;
    return `منذ ${Math.floor(hrs / 24)} يوم`;
  };

  const filtered = filter === 'غير المقروءة'
    ? notifications.filter(n => !n.is_read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="pb-12 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-dark mb-2 flex items-center gap-2">
            <Bell className="text-primary mt-1" /> مركز الإشعارات
            {unreadCount > 0 && <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">{unreadCount}</span>}
          </h1>
          <p className="text-text-muted font-medium">تابعي كل التحديثات والتذكيرات المهمة لحالتك الخاصة.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button variant="ghost" className="text-sm px-4 py-2 border-primary/20 bg-white/50 w-full md:w-auto" onClick={markAllRead}>
            <CheckCircle2 size={16} className="rtl:ml-2 ltr:mr-2 inline" /> تحديد الكل كمقروء
          </Button>
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
        {['الكل', 'غير المقروءة'].map((tag) => (
          <button key={tag} onClick={() => setFilter(tag)}
            className={`px-5 py-2 rounded-full font-bold whitespace-nowrap transition-colors outline-none ${filter === tag ? 'bg-dark text-white shadow-md' : 'bg-white/60 text-text-muted hover:bg-white/90 hover:text-dark border border-white'}`}>
            {tag}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Bell size={48} className="text-text-muted/30 mx-auto mb-4" />
          <p className="text-text-muted font-medium text-lg">لا توجد إشعارات</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filtered.map((n, i) => {
              const Icon = typeIcons[n.type] || Bell;
              const color = typeColors[n.type] || 'text-dark';
              return (
                <motion.div key={n.id} initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.05 }}>
                  <Card variant="glass" onClick={() => markRead(n.id)}
                    className={`p-5 flex items-start gap-4 transition-all duration-300 border-l-4 rtl:border-l-0 rtl:border-r-4 cursor-pointer ${!n.is_read ? 'bg-white/80 border-primary shadow-md' : 'bg-white/40 border-transparent opacity-80 hover:opacity-100'}`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-inner ${!n.is_read ? 'bg-neutral' : 'bg-white'} ${color}`}>
                      <Icon size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className={`font-bold text-lg ${!n.is_read ? 'text-dark' : 'text-text-dark'}`}>{n.title}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-text-muted bg-white/50 px-2 py-1 rounded-md">{timeAgo(n.created_at)}</span>
                          <button onClick={e => { e.stopPropagation(); deleteNotif(n.id); }} className="p-1 rounded hover:bg-red-50 text-text-muted hover:text-red-500 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <p className="text-text-muted max-w-2xl text-sm leading-relaxed font-medium">{n.body}</p>
                    </div>
                    {!n.is_read && <div className="w-3 h-3 rounded-full bg-primary mt-4 mr-2 shadow-sm shrink-0" />}
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

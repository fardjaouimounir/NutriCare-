import React, { useState, useEffect } from 'react';
import { Bell, Plus, Trash2, Send, Users, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const NOTIF_TYPES = [
  { value: 'reminder', label: '⏰ تذكير' },
  { value: 'achievement', label: '🏆 إنجاز' },
  { value: 'info', label: 'ℹ️ معلومة' },
  { value: 'warning', label: '⚠️ تنبيه' },
];

const emptyForm = { title: '', message: '', type: 'info', target: 'all', user_id: '' };

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [sending, setSending] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    const [nRes, uRes] = await Promise.all([
      supabase.from('notifications').select('*, profiles(full_name)').order('created_at', { ascending: false }).limit(50),
      supabase.from('profiles').select('id, full_name').eq('role', 'patient').order('full_name'),
    ]);
    setNotifications(nRes.data || []);
    setUsers(uRes.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const sendNotification = async () => {
    if (!form.title || !form.message) return;
    setSending(true);
    const targets = form.target === 'all'
      ? users.map(u => u.id)
      : [form.user_id];

    const rows = targets.filter(Boolean).map(uid => ({
      user_id: uid, title: form.title, message: form.message, type: form.type, is_read: false,
    }));

    if (rows.length > 0) {
      await supabase.from('notifications').insert(rows);
    }
    setForm(emptyForm); setShowForm(false);
    setSending(false); fetchAll();
  };

  const deleteNotification = async (id) => {
    await supabase.from('notifications').delete().eq('id', id);
    fetchAll();
  };

  const markAllRead = async () => {
    await supabase.from('notifications').update({ is_read: true }).eq('is_read', false);
    fetchAll();
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const typeColor = { reminder: 'bg-blue-50 text-blue-700', achievement: 'bg-amber-50 text-amber-700', info: 'bg-emerald-50 text-emerald-700', warning: 'bg-red-50 text-red-700' };
  const typeLabel = { reminder: '⏰ تذكير', achievement: '🏆 إنجاز', info: 'ℹ️ معلومة', warning: '⚠️ تنبيه' };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">إدارة الإشعارات</h1>
          <p className="text-slate-500 text-sm mt-0.5">{unreadCount} إشعار غير مقروء من أصل {notifications.length}</p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="px-4 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-sm font-semibold transition-colors">
              تحديد الكل كمقروء
            </button>
          )}
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm">
            <Plus size={16} /> إرسال إشعار
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'إجمالي الإشعارات', value: notifications.length, color: 'text-slate-700' },
          { label: 'غير مقروءة', value: unreadCount, color: 'text-rose-600' },
          { label: 'تذكيرات', value: notifications.filter(n => n.type === 'reminder').length, color: 'text-blue-600' },
          { label: 'مستلمين', value: users.length, color: 'text-violet-600' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm text-center">
            <div className={`text-3xl font-bold ${s.color} mb-1`}>{s.value}</div>
            <div className="text-xs text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="font-bold text-slate-700">سجل الإشعارات</h2>
        </div>
        {loading ? <div className="py-12 text-center text-slate-400">جاري التحميل...</div>
          : notifications.length === 0 ? <div className="py-12 text-center text-slate-400">لا توجد إشعارات</div>
            : notifications.map(n => (
              <div key={n.id} className={`flex items-start gap-4 px-6 py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors ${!n.is_read ? 'bg-rose-50/40' : ''}`}>
                <div className={`mt-0.5 px-2 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${typeColor[n.type] || 'bg-slate-50 text-slate-600'}`}>
                  {typeLabel[n.type] || n.type}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-800">{n.title}</p>
                    {!n.is_read && <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0"></span>}
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5">{n.message}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {n.profiles?.full_name || 'مستخدمة'} · {new Date(n.created_at).toLocaleString('ar-DZ')}
                  </p>
                </div>
                <button onClick={() => deleteNotification(n.id)} className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"><Trash2 size={14} /></button>
              </div>
            ))}
      </div>

      {/* ── Send Notification Modal ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">إرسال إشعار</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-100 rounded-lg"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <input placeholder="عنوان الإشعار *" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
              <textarea rows={3} placeholder="نص الإشعار *" value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none" />
              <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none bg-white">
                {NOTIF_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              <div className="flex gap-3 bg-slate-50 p-1 rounded-xl">
                <button onClick={() => setForm(p => ({ ...p, target: 'all' }))}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${form.target === 'all' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>
                  <Users size={15} /> إرسال للجميع
                </button>
                <button onClick={() => setForm(p => ({ ...p, target: 'specific' }))}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${form.target === 'specific' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>
                  <Bell size={15} /> مستخدمة محددة
                </button>
              </div>
              {form.target === 'specific' && (
                <select value={form.user_id} onChange={e => setForm(p => ({ ...p, user_id: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none bg-white">
                  <option value="">اختاري المستخدمة...</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.full_name}</option>)}
                </select>
              )}
              <button onClick={sendNotification} disabled={!form.title || !form.message || sending}
                className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                <Send size={16} /> {sending ? 'جاري الإرسال...' : `إرسال ${form.target === 'all' ? `للجميع (${users.length})` : ''}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

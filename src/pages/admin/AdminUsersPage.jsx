import React, { useState, useEffect } from 'react';
import { Users, Search, MoreHorizontal, Eye, Ban, Edit3, Trash2, UserCheck, UserX, XCircle, Download } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const phaseColors = {
  'recovery': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'التعافي' },
  'chemotherapy': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', label: 'الكيماوي' },
  'newly_diagnosed': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', label: 'تشخيص حديث' },
  'hormonal': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', label: 'الهرموني' },
  'radiation': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: 'الإشعاعي' },
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('الكل');
  const [openMenu, setOpenMenu] = useState(null);
  const [page, setPage] = useState(1);
  const perPage = 8;

  const fetchUsers = async () => {
    setLoading(true);
    let query = supabase
      .from('profiles')
      .select('*')
      .eq('role', 'patient')
      .order('created_at', { ascending: false });
    if (search) query = query.ilike('full_name', `%${search}%`);
    const { data } = await query;
    setUsers(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, [search]);

  const handleBan = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'banned' ? 'active' : 'banned';
    await supabase.from('profiles').update({ status: newStatus }).eq('id', userId);
    fetchUsers();
    setOpenMenu(null);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('هل أنتِ متأكدة من حذف هذا الحساب نهائياً؟')) return;
    await supabase.from('profiles').delete().eq('id', userId);
    fetchUsers();
    setOpenMenu(null);
  };

  const filtered = users.filter(u => {
    if (statusFilter === 'الكل') return true;
    if (statusFilter === 'نشط') return u.status !== 'banned';
    if (statusFilter === 'موقوف') return u.status === 'banned';
    return true;
  });

  const total = filtered.length;
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(total / perPage);

  const stats = [
    { label: 'إجمالي المريضات', value: users.length, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'نشطات', value: users.filter(u => u.status !== 'banned').length, icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'موقوفات', value: users.filter(u => u.status === 'banned').length, icon: UserX, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'هذا الشهر', value: users.filter(u => new Date(u.created_at) > new Date(Date.now() - 30 * 86400000)).length, icon: XCircle, color: 'text-slate-500', bg: 'bg-slate-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">إدارة المريضات</h1>
          <p className="text-slate-500 text-sm mt-0.5">عرض وإدارة جميع حسابات المريضات المسجلة</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm">
          <Download size={16} /> تصدير البيانات
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl ${s.bg} ${s.color} flex items-center justify-center shrink-0`}><s.icon size={22} /></div>
            <div><p className="text-2xl font-bold text-slate-800">{s.value}</p><p className="text-xs text-slate-500 font-medium">{s.label}</p></div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-wrap gap-3 items-center justify-between">
          <div className="relative flex-1 min-w-64">
            <Search size={17} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="البحث بالاسم..."
              className="w-full pr-9 pl-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-300 bg-slate-50/50" />
          </div>
          <div className="flex gap-2">
            {['الكل', 'نشط', 'موقوف'].map(f => (
              <button key={f} onClick={() => { setStatusFilter(f); setPage(1); }}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${statusFilter === f ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-100">
                  {['المريضة', 'المرحلة العلاجية', 'تاريخ الانضمام', 'الحالة', 'إجراءات'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginated.map(u => {
                  const phase = phaseColors[u.treatment_phase] || { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200', label: u.treatment_phase };
                  const isBanned = u.status === 'banned';
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition-colors group">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-400 to-pink-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                            {u.full_name?.charAt(0) || '؟'}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{u.full_name || 'بدون اسم'}</p>
                            <p className="text-xs text-slate-400">{u.phone || '—'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold border ${phase.bg} ${phase.text} ${phase.border}`}>
                          {phase.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-500">
                        {new Date(u.created_at).toLocaleDateString('ar-DZ', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${isBanned ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isBanned ? 'bg-red-500' : 'bg-emerald-500'}`} />
                          {isBanned ? 'موقوف' : 'نشط'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center relative">
                          <button onClick={() => setOpenMenu(openMenu === u.id ? null : u.id)}
                            className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors">
                            <MoreHorizontal size={18} />
                          </button>
                          {openMenu === u.id && (
                            <div className="absolute left-0 top-full mt-1 w-44 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-20 text-sm" onMouseLeave={() => setOpenMenu(null)}>
                              <button onClick={() => handleBan(u.id, u.status)}
                                className="w-full flex items-center gap-2.5 px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                                <Ban size={15} /><span>{isBanned ? 'رفع الإيقاف' : 'إيقاف الحساب'}</span>
                              </button>
                              <div className="border-t border-slate-100 my-1" />
                              <button onClick={() => handleDelete(u.id)}
                                className="w-full flex items-center gap-2.5 px-4 py-2 text-red-500 hover:bg-red-50 transition-colors">
                                <Trash2 size={15} /><span>حذف الحساب</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            عرض <span className="font-semibold text-slate-700">{Math.min((page - 1) * perPage + 1, total)}–{Math.min(page * perPage, total)}</span> من <span className="font-semibold text-slate-700">{total}</span>
          </p>
          <div className="flex items-center gap-1.5">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition">السابق</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setPage(i + 1)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition ${page === i + 1 ? 'bg-rose-500 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
                {i + 1}
              </button>
            ))}
            <button disabled={page === totalPages || totalPages === 0} onClick={() => setPage(p => p + 1)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition">التالي</button>
          </div>
        </div>
      </div>
    </div>
  );
}

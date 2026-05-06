import React, { useState } from 'react';
import {
  Users, Search, Filter, ChevronDown, MoreHorizontal,
  Eye, Ban, Edit3, Trash2, CheckCircle, XCircle,
  UserCheck, UserX, Download, RefreshCw
} from 'lucide-react';

const ALL_USERS = [
  { id: 1, name: 'سارة أحمد', email: 'sara@example.com', phase: 'مرحلة التعافي', joined: '10 أبريل 2026', status: 'نشط', sessions: 142, avatar: 'س' },
  { id: 2, name: 'مريم خالد', email: 'maryam.k@gmail.com', phase: 'العلاج الكيماوي', joined: '8 أبريل 2026', status: 'نشط', sessions: 89, avatar: 'م' },
  { id: 3, name: 'فاطمة الزهراء', email: 'fatima@yahoo.com', phase: 'تم التشخيص حديثاً', joined: '5 أبريل 2026', status: 'موقوف', sessions: 12, avatar: 'ف' },
  { id: 4, name: 'عائشة نبيل', email: 'aisha.n@outlook.com', phase: 'العلاج الهرموني', joined: '1 أبريل 2026', status: 'نشط', sessions: 201, avatar: 'ع' },
  { id: 5, name: 'خديجة علي', email: 'khadija.a@gmail.com', phase: 'العلاج الإشعاعي', joined: '28 مارس 2026', status: 'غير نشط', sessions: 34, avatar: 'خ' },
  { id: 6, name: 'زينب حسن', email: 'zeinab@example.com', phase: 'مرحلة التعافي', joined: '20 مارس 2026', status: 'نشط', sessions: 175, avatar: 'ز' },
  { id: 7, name: 'أميرة سعيد', email: 'amira.s@gmail.com', phase: 'العلاج الكيماوي', joined: '15 مارس 2026', status: 'نشط', sessions: 68, avatar: 'أ' },
  { id: 8, name: 'نورا إبراهيم', email: 'nora.i@yahoo.com', phase: 'تم التشخيص حديثاً', joined: '10 مارس 2026', status: 'موقوف', sessions: 5, avatar: 'ن' },
];

const phaseColors = {
  'مرحلة التعافي': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'العلاج الكيماوي': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'تم التشخيص حديثاً': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  'العلاج الهرموني': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  'العلاج الإشعاعي': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
};

const statusConfig = {
  'نشط': { dot: 'bg-emerald-500', bg: 'bg-emerald-50 text-emerald-700' },
  'غير نشط': { dot: 'bg-slate-400', bg: 'bg-slate-100 text-slate-600' },
  'موقوف': { dot: 'bg-red-500', bg: 'bg-red-50 text-red-700' },
};

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('الكل');
  const [openMenu, setOpenMenu] = useState(null);
  const [page, setPage] = useState(1);
  const perPage = 6;

  const filtered = ALL_USERS.filter(u => {
    const matchSearch = u.name.includes(search) || u.email.includes(search);
    const matchStatus = statusFilter === 'الكل' || u.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const total = filtered.length;
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(total / perPage);

  const stats = [
    { label: 'إجمالي المريضات', value: ALL_USERS.length, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'نشطات', value: ALL_USERS.filter(u => u.status === 'نشط').length, icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'موقوفات', value: ALL_USERS.filter(u => u.status === 'موقوف').length, icon: UserX, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'غير نشطات', value: ALL_USERS.filter(u => u.status === 'غير نشط').length, icon: XCircle, color: 'text-slate-500', bg: 'bg-slate-100' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">إدارة المريضات</h1>
          <p className="text-slate-500 text-sm mt-0.5">عرض وإدارة جميع حسابات المريضات المسجلة</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm">
          <Download size={16} />
          <span>تصدير البيانات</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl ${s.bg} ${s.color} flex items-center justify-center shrink-0`}>
              <s.icon size={22} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{s.value}</p>
              <p className="text-xs text-slate-500 font-medium">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 border-b border-slate-100 flex flex-wrap gap-3 items-center justify-between">
          <div className="relative flex-1 min-w-64">
            <Search size={17} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="البحث بالاسم أو البريد الإلكتروني..."
              className="w-full pr-9 pl-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-400 transition bg-slate-50/50"
            />
          </div>
          <div className="flex gap-2">
            {['الكل', 'نشط', 'غير نشط', 'موقوف'].map(f => (
              <button
                key={f}
                onClick={() => { setStatusFilter(f); setPage(1); }}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${statusFilter === f ? 'bg-rose-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">المريضة</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">المرحلة العلاجية</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">الجلسات</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">تاريخ التسجيل</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">الحالة</th>
                <th className="px-5 py-3.5 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginated.map(u => {
                const phase = phaseColors[u.phase] || { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' };
                const st = statusConfig[u.status] || statusConfig['غير نشط'];
                return (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-400 to-pink-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                          {u.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{u.name}</p>
                          <p className="text-xs text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold border ${phase.bg} ${phase.text} ${phase.border}`}>
                        {u.phase}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-slate-700">{u.sessions}</td>
                    <td className="px-5 py-4 text-sm text-slate-500">{u.joined}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${st.bg}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`}></span>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center">
                        <div className="relative">
                          <button
                            onClick={() => setOpenMenu(openMenu === u.id ? null : u.id)}
                            className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                          >
                            <MoreHorizontal size={18} />
                          </button>
                          {openMenu === u.id && (
                            <div className="absolute left-0 top-full mt-1 w-44 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-20 text-sm" onMouseLeave={() => setOpenMenu(null)}>
                              <button className="w-full flex items-center gap-2.5 px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                                <Eye size={15} /> <span>عرض الملف</span>
                              </button>
                              <button className="w-full flex items-center gap-2.5 px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                                <Edit3 size={15} /> <span>تعديل البيانات</span>
                              </button>
                              <button className="w-full flex items-center gap-2.5 px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                                <Ban size={15} /> <span>إيقاف الحساب</span>
                              </button>
                              <div className="border-t border-slate-100 my-1"></div>
                              <button className="w-full flex items-center gap-2.5 px-4 py-2 text-red-500 hover:bg-red-50 transition-colors">
                                <Trash2 size={15} /> <span>حذف الحساب</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            عرض <span className="font-semibold text-slate-700">{Math.min((page - 1) * perPage + 1, total)}–{Math.min(page * perPage, total)}</span> من <span className="font-semibold text-slate-700">{total}</span>
          </p>
          <div className="flex items-center gap-1.5">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              السابق
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition ${page === i + 1 ? 'bg-rose-500 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              التالي
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

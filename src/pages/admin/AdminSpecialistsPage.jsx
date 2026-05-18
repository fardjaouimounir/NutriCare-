import React, { useState } from 'react';
import {
  UserPlus, Star, Users, FileText, CheckCircle, XCircle,
  MoreHorizontal, Edit3, Trash2, Eye, Mail, Phone,
  Award, BookOpen, Calendar, Search, Filter, Download
} from 'lucide-react';

const SPECIALISTS = [
  {
    id: 1, name: 'د. نورة الشامي', specialty: 'أخصائية تغذية سريرية', avatar: 'ن',
    email: 'noura.s@senocare.dz', phone: '+213 550 123 456',
    patients: 128, rating: 4.9, published: 24, joined: 'يناير 2026', status: 'نشطة',
    color: 'from-rose-400 to-pink-600',
  },
  {
    id: 2, name: 'د. رانيا فهمي', specialty: 'أخصائية نفسية وعلاج معرفي', avatar: 'ر',
    email: 'rania.f@senocare.dz', phone: '+213 661 789 012',
    patients: 94, rating: 4.7, published: 18, joined: 'فبراير 2026', status: 'نشطة',
    color: 'from-indigo-400 to-purple-600',
  },
  {
    id: 3, name: 'د. أمل رشيد', specialty: 'أخصائية أورام وعلاج داعم', avatar: 'أ',
    email: 'amal.r@senocare.dz', phone: '+213 770 345 678',
    patients: 156, rating: 4.8, published: 31, joined: 'ديسمبر 2025', status: 'نشطة',
    color: 'from-emerald-400 to-teal-600',
  },
  {
    id: 4, name: 'د. لينا محمود', specialty: 'معالجة طبيعية وتأهيل', avatar: 'ل',
    email: 'lina.m@senocare.dz', phone: '+213 560 901 234',
    patients: 72, rating: 4.6, published: 12, joined: 'مارس 2026', status: 'نشطة',
    color: 'from-amber-400 to-orange-500',
  },
  {
    id: 5, name: 'د. سلمى قاسم', specialty: 'طبيبة عامة ومتخصصة في الرعاية التلطيفية', avatar: 'س',
    email: 'salma.q@senocare.dz', phone: '+213 699 567 890',
    patients: 48, rating: 4.5, published: 8, joined: 'أبريل 2026', status: 'في انتظار التفعيل',
    color: 'from-cyan-400 to-blue-500',
  },
];

const statusConfig = {
  'نشطة': { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  'في انتظار التفعيل': { bg: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  'موقوفة': { bg: 'bg-red-50 text-red-600 border-red-200', dot: 'bg-red-500' },
};

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <Star key={s} size={13} className={s <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'} />
      ))}
      <span className="mr-1 text-xs font-bold text-slate-700">{rating}</span>
    </div>
  );
}

export default function AdminSpecialistsPage() {
  const [search, setSearch] = useState('');
  const [openMenu, setOpenMenu] = useState(null);
  const [view, setView] = useState('cards');

  const filtered = SPECIALISTS.filter(s =>
    s.name.includes(search) || s.specialty.includes(search)
  );

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">إدارة الأخصائيات</h1>
          <p className="text-slate-500 text-sm mt-0.5">إدارة فريق الدعم الطبي والأخصائيين المنضمين للمنصة</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-semibold transition shadow-sm">
          <UserPlus size={16} />
          إضافة أخصائية جديدة
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'إجمالي الأخصائيات', value: SPECIALISTS.length, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'نشطات', value: SPECIALISTS.filter(s => s.status === 'نشطة').length, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'إجمالي المقالات', value: SPECIALISTS.reduce((a, s) => a + s.published, 0), icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'متوسط التقييم', value: (SPECIALISTS.reduce((a, s) => a + s.rating, 0) / SPECIALISTS.length).toFixed(1), icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((s, i) => (
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

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-56">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="البحث بالاسم أو التخصص..."
            className="w-full pr-9 pl-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white transition"
          />
        </div>
        <div className="flex gap-1.5 bg-white border border-slate-200 rounded-xl p-1">
          <button onClick={() => setView('cards')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${view === 'cards' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-700'}`}>بطاقات</button>
          <button onClick={() => setView('table')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${view === 'table' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-700'}`}>جدول</button>
        </div>
      </div>

      {/* Cards View */}
      {view === 'cards' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(sp => {
            const st = statusConfig[sp.status] || statusConfig['موقوفة'];
            return (
              <div key={sp.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:-translate-y-1 transition-all group">
                {/* Card Header */}
                <div className={`bg-gradient-to-r ${sp.color} px-6 py-5 relative`}>
                  <div className="flex items-start justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm text-white flex items-center justify-center text-2xl font-bold border border-white/30">
                      {sp.avatar}
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border bg-white/20 text-white border-white/30`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                      {sp.status}
                    </span>
                  </div>
                  <div className="mt-3">
                    <h3 className="font-bold text-white text-lg leading-tight">{sp.name}</h3>
                    <p className="text-white/80 text-xs mt-0.5">{sp.specialty}</p>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 divide-x divide-x-reverse divide-slate-100 border-b border-slate-100">
                  {[
                    { label: 'مريضة', value: sp.patients },
                    { label: 'مقال', value: sp.published },
                    { label: 'تقييم', value: sp.rating },
                  ].map((s, i) => (
                    <div key={i} className="py-3 text-center">
                      <p className="text-xl font-bold text-slate-800">{s.value}</p>
                      <p className="text-xs text-slate-400">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Info & Actions */}
                <div className="p-5 space-y-3">
                  <StarRating rating={sp.rating} />
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Mail size={13} className="text-slate-400" />
                    <span className="truncate" dir="ltr">{sp.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Calendar size={13} className="text-slate-400" />
                    <span>انضمت {sp.joined}</span>
                  </div>
                  <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100">
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-slate-50 hover:bg-rose-50 hover:text-rose-600 text-slate-600 rounded-xl text-xs font-semibold transition border border-slate-200 hover:border-rose-200">
                      <Eye size={14} /> عرض الملف
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 rounded-xl text-xs font-semibold transition border border-slate-200 hover:border-indigo-200">
                      <Edit3 size={14} /> تعديل
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add New Card */}
          <button className="bg-white rounded-2xl border-2 border-dashed border-slate-200 hover:border-rose-300 hover:bg-rose-50/30 transition-all flex flex-col items-center justify-center gap-3 p-8 min-h-[280px] group">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 group-hover:bg-rose-100 text-slate-400 group-hover:text-rose-500 flex items-center justify-center transition">
              <UserPlus size={26} />
            </div>
            <div className="text-center">
              <p className="font-bold text-slate-600 group-hover:text-rose-600 transition">إضافة أخصائية جديدة</p>
              <p className="text-xs text-slate-400 mt-1">انقر لإضافة عضو جديد للفريق</p>
            </div>
          </button>
        </div>
      )}

      {/* Table View */}
      {view === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500">الأخصائية</th>
                  <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500">التخصص</th>
                  <th className="px-5 py-3.5 text-center text-xs font-semibold text-slate-500">المريضات</th>
                  <th className="px-5 py-3.5 text-center text-xs font-semibold text-slate-500">المقالات</th>
                  <th className="px-5 py-3.5 text-center text-xs font-semibold text-slate-500">التقييم</th>
                  <th className="px-5 py-3.5 text-center text-xs font-semibold text-slate-500">الحالة</th>
                  <th className="px-5 py-3.5 text-center text-xs font-semibold text-slate-500">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(sp => {
                  const st = statusConfig[sp.status] || statusConfig['موقوفة'];
                  return (
                    <tr key={sp.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${sp.color} text-white flex items-center justify-center font-bold text-sm shrink-0`}>{sp.avatar}</div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{sp.name}</p>
                            <p className="text-xs text-slate-400" dir="ltr">{sp.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">{sp.specialty}</td>
                      <td className="px-5 py-4 text-center text-sm font-bold text-slate-700">{sp.patients}</td>
                      <td className="px-5 py-4 text-center text-sm font-bold text-slate-700">{sp.published}</td>
                      <td className="px-5 py-4 text-center"><StarRating rating={sp.rating} /></td>
                      <td className="px-5 py-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border ${st.bg}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`}></span>
                          {sp.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"><Eye size={15} /></button>
                          <button className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition"><Edit3 size={15} /></button>
                          <button className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition"><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

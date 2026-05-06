import React, { useState } from 'react';
import {
  MessageSquare, Flag, CheckCircle, XCircle, Eye,
  Trash2, AlertTriangle, ThumbsUp, ThumbsDown,
  Filter, Search, Users, Clock, ArrowLeft, Heart,
  MoreHorizontal, Pin, EyeOff
} from 'lucide-react';

const POSTS = [
  {
    id: 1, author: 'سارة أحمد', avatar: 'س', content: 'مرحباً يا صديقاتي، هل جربتن وصفة حساء العدس الموجودة في قسم الوصفات؟ كانت رائعة جداً وساعدتني خلال العلاج.', likes: 42, replies: 8, date: 'منذ 2 ساعة', status: 'منشور', reported: false, category: 'تجارب شخصية',
  },
  {
    id: 2, author: 'مريم خالد', avatar: 'م', content: 'يوم صعب اليوم بعد جلسة العلاج الكيماوي... هل عندكن نصائح لتخطي الغثيان؟', likes: 29, replies: 15, date: 'منذ 4 ساعات', status: 'منشور', reported: false, category: 'طلب مساعدة',
  },
  {
    id: 3, author: 'مجهول', avatar: '؟', content: 'هذا المنتج يعالج السرطان نهائياً خلال أسبوعين فقط! تواصلوا معي على الواتساب...', likes: 1, replies: 2, date: 'منذ 5 ساعات', status: 'بانتظار المراجعة', reported: true, category: 'إعلان مشبوه',
  },
  {
    id: 4, author: 'زينب حسن', avatar: 'ز', content: 'أريد مشاركة تجربتي الإيجابية... مضى عام على علاجي وأنا اليوم في مرحلة التعافي. الأمل موجود دائماً!', likes: 118, replies: 34, date: 'منذ يوم', status: 'مثبت', reported: false, category: 'قصص نجاح',
  },
  {
    id: 5, author: 'فاطمة الزهراء', avatar: 'ف', content: 'محتوى يشمل معلومات طبية خاطئة ومضللة. يجب حذفه فوراً.', likes: 0, replies: 3, date: 'منذ 2 يوم', status: 'بانتظار المراجعة', reported: true, category: 'محتوى مشبوه',
  },
];

const CATEGORIES = [
  { name: 'تجارب شخصية', count: 89, color: 'bg-blue-50 text-blue-700' },
  { name: 'طلب مساعدة', count: 64, color: 'bg-amber-50 text-amber-700' },
  { name: 'قصص نجاح', count: 47, color: 'bg-emerald-50 text-emerald-700' },
  { name: 'نصائح غذائية', count: 38, color: 'bg-rose-50 text-rose-700' },
  { name: 'أسئلة طبية', count: 22, color: 'bg-purple-50 text-purple-700' },
];

const statusConfig = {
  'منشور': { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  'بانتظار المراجعة': { bg: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  'مثبت': { bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', dot: 'bg-indigo-500' },
  'محذوف': { bg: 'bg-red-50 text-red-600 border-red-200', dot: 'bg-red-500' },
};

export default function AdminCommunityPage() {
  const [activeFilter, setActiveFilter] = useState('الكل');
  const [search, setSearch] = useState('');

  const filters = ['الكل', 'منشور', 'بانتظار المراجعة', 'مثبت', 'مُبلَّغ عنه'];

  const filtered = POSTS.filter(p => {
    if (activeFilter === 'مُبلَّغ عنه') return p.reported;
    if (activeFilter !== 'الكل') return p.status === activeFilter;
    return true;
  }).filter(p => !search || p.content.includes(search) || p.author.includes(search));

  const stats = [
    { label: 'إجمالي المنشورات', value: '1,284', icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'بانتظار المراجعة', value: '12', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'بلاغات نشطة', value: '3', icon: Flag, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'عضوات المجتمع', value: '389', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">إدارة المجتمع</h1>
        <p className="text-slate-500 text-sm mt-0.5">مراقبة وإدارة منشورات مجتمع الدعم</p>
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

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
        {/* Posts List */}
        <div className="xl:col-span-3 space-y-4">
          {/* Toolbar */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-48">
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="بحث في المنشورات..."
                className="w-full pr-9 pl-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-300 bg-slate-50 transition"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {filters.map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition ${activeFilter === f ? 'bg-rose-500 text-white shadow-sm' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Post Cards */}
          {filtered.map(post => {
            const st = statusConfig[post.status] || statusConfig['محذوف'];
            return (
              <div key={post.id} className={`bg-white rounded-2xl border shadow-sm p-5 transition-all ${post.reported ? 'border-red-200 bg-red-50/30' : 'border-slate-100'}`}>
                {/* Post header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-400 to-pink-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {post.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold text-slate-800">{post.author}</p>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold border ${st.bg}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`}></span>
                          {post.status}
                        </span>
                        {post.reported && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold bg-red-100 text-red-600 border border-red-200">
                            <Flag size={10} /> مُبلَّغ عنه
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 bg-slate-100 rounded-md text-xs font-medium text-slate-600">{post.category}</span>
                        <Clock size={11} /> {post.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button title="تثبيت" className="p-1.5 rounded-lg hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition"><Pin size={15} /></button>
                    <button title="إخفاء" className="p-1.5 rounded-lg hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition"><EyeOff size={15} /></button>
                    <button title="حذف" className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition"><Trash2 size={15} /></button>
                  </div>
                </div>

                {/* Content */}
                <p className="text-sm text-slate-700 leading-relaxed mb-4 px-1">{post.content}</p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1"><Heart size={13} className="text-rose-400" /> {post.likes}</span>
                    <span className="flex items-center gap-1"><MessageSquare size={13} /> {post.replies} رد</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold transition border border-emerald-200">
                      <CheckCircle size={13} /> موافقة
                    </button>
                    <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold transition border border-red-200">
                      <XCircle size={13} /> حذف
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Categories */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-bold text-slate-800 text-sm mb-4">فئات المنشورات</h3>
            <div className="space-y-2.5">
              {CATEGORIES.map((c, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${c.color}`}>{c.name}</span>
                  <span className="text-sm font-bold text-slate-700">{c.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Moderation Rules */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-bold text-slate-800 text-sm mb-4">قواعد المجتمع</h3>
            <div className="space-y-3">
              {[
                'احترام الخصوصية',
                'ممنوع الإعلان التجاري',
                'لا للمعلومات الطبية الخاطئة',
                'التعاطف والدعم المتبادل',
                'الإبلاغ عن المحتوى المشين',
              ].map((r, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-slate-600">
                  <CheckCircle size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-bold text-slate-800 text-sm mb-4">هذا الأسبوع</h3>
            <div className="space-y-3">
              {[
                { label: 'منشورات جديدة', value: '48' },
                { label: 'ردود وتعليقات', value: '213' },
                { label: 'محتوى محذوف', value: '5' },
                { label: 'بلاغات معالجة', value: '8' },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">{s.label}</span>
                  <span className="font-bold text-slate-800">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

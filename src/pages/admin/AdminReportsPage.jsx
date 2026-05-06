import React, { useState } from 'react';
import {
  Download, FileText, Calendar, Users, Activity, BarChart2,
  Filter, CheckCircle, Clock, ChevronDown, RefreshCw,
  Database, Utensils, Droplets, Heart, MessageSquare,
  TrendingUp, AlertCircle, FileDown
} from 'lucide-react';

const REPORTS = [
  {
    id: 1, name: 'تقرير المريضات الشهري', desc: 'تفاصيل تسجيلات وبيانات جميع المريضات', icon: Users, generated: '1 أبريل 2026', size: '2.4 MB', format: 'Excel', color: 'text-indigo-600 bg-indigo-50',
  },
  {
    id: 2, name: 'تقرير نشاط التغذية', desc: 'إجمالي الوجبات المسجلة وبيانات التغذية', icon: Utensils, generated: '1 أبريل 2026', size: '1.8 MB', format: 'Excel', color: 'text-rose-500 bg-rose-50',
  },
  {
    id: 3, name: 'تقرير الترطيب والعافية', desc: 'بيانات شرب الماء والتمارين الأسبوعية', icon: Droplets, generated: '7 أبريل 2026', size: '980 KB', format: 'Excel', color: 'text-cyan-600 bg-cyan-50',
  },
  {
    id: 4, name: 'تقرير المجتمع والتفاعل', desc: 'إحصاءات المنشورات والتعليقات والبلاغات', icon: MessageSquare, generated: '10 أبريل 2026', size: '1.2 MB', format: 'PDF', color: 'text-purple-600 bg-purple-50',
  },
  {
    id: 5, name: 'تقرير الأداء الطبي', desc: 'أداء الأخصائيات والمقالات المنشورة', icon: Heart, generated: '12 أبريل 2026', size: '750 KB', format: 'PDF', color: 'text-emerald-600 bg-emerald-50',
  },
  {
    id: 6, name: 'التقرير الربع سنوي الشامل', desc: 'نظرة عامة كاملة على أداء المنصة لـ Q1', icon: BarChart2, generated: '1 أبريل 2026', size: '5.6 MB', format: 'PDF', color: 'text-amber-600 bg-amber-50',
  },
];

const EXPORT_TYPES = [
  { id: 'users', label: 'بيانات المريضات', icon: Users, fields: ['الاسم', 'البريد', 'المرحلة العلاجية', 'تاريخ التسجيل', 'الحالة'] },
  { id: 'meals', label: 'بيانات التغذية', icon: Utensils, fields: ['المريضة', 'الوجبة', 'السعرات', 'التاريخ', 'الوقت'] },
  { id: 'hydration', label: 'بيانات الترطيب', icon: Droplets, fields: ['المريضة', 'الكمية (مل)', 'التاريخ', 'الهدف اليومي'] },
  { id: 'community', label: 'نشاط المجتمع', icon: MessageSquare, fields: ['المنشور', 'الكاتبة', 'التفاعلات', 'التاريخ', 'الحالة'] },
];

const SCHEDULE_OPTIONS = [
  { label: 'يومياً', icon: Clock, active: true },
  { label: 'أسبوعياً', icon: Calendar, active: false },
  { label: 'شهرياً', icon: FileText, active: true },
  { label: 'ربع سنوياً', icon: Database, active: false },
];

export default function AdminReportsPage() {
  const [selectedType, setSelectedType] = useState('users');
  const [format, setFormat] = useState('Excel');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [downloading, setDownloading] = useState(null);

  const handleDownload = (id) => {
    setDownloading(id);
    setTimeout(() => setDownloading(null), 1500);
  };

  const handleExport = () => {
    setDownloading('custom');
    setTimeout(() => setDownloading(null), 2000);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">التقارير والتصدير</h1>
        <p className="text-slate-500 text-sm mt-0.5">تحميل وتصدير بيانات المنصة بتنسيقات متعددة</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'تقارير جاهزة', value: REPORTS.length, icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'آخر تصدير', value: 'منذ يومين', icon: Clock, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'إجمالي البيانات', value: '12.7 MB', icon: Database, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'تقارير مجدولة', value: '2', icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl ${s.bg} ${s.color} flex items-center justify-center shrink-0`}><s.icon size={22} /></div>
            <div>
              <p className="text-xl font-bold text-slate-800">{s.value}</p>
              <p className="text-xs text-slate-500 font-medium">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Custom Export Builder */}
        <div className="xl:col-span-1 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="font-bold text-slate-800 text-base mb-5 flex items-center gap-2">
              <FileDown size={18} className="text-rose-500" />
              تصدير مخصص
            </h2>
            <div className="space-y-4">
              {/* Data Type */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-2">نوع البيانات</label>
                <div className="space-y-2">
                  {EXPORT_TYPES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedType(t.id)}
                      className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl border transition text-sm font-semibold text-right ${selectedType === t.id ? 'bg-rose-50 border-rose-300 text-rose-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                      <t.icon size={17} className={selectedType === t.id ? 'text-rose-500' : 'text-slate-400'} />
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-2">نطاق التاريخ</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">من</p>
                    <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-300 bg-slate-50 transition" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">إلى</p>
                    <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-300 bg-slate-50 transition" />
                  </div>
                </div>
              </div>

              {/* Format */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-2">صيغة الملف</label>
                <div className="flex gap-2">
                  {['Excel', 'CSV', 'PDF'].map(f => (
                    <button
                      key={f}
                      onClick={() => setFormat(f)}
                      className={`flex-1 py-2.5 rounded-xl border text-sm font-bold transition ${format === f ? 'bg-slate-800 text-white border-slate-800' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fields Preview */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-xs font-bold text-slate-500 mb-2">الحقول المُصدَّرة:</p>
                <div className="flex flex-wrap gap-1.5">
                  {(EXPORT_TYPES.find(t => t.id === selectedType)?.fields || []).map((f, i) => (
                    <span key={i} className="px-2 py-0.5 bg-white rounded-md border border-slate-200 text-xs font-medium text-slate-600">{f}</span>
                  ))}
                </div>
              </div>

              <button
                onClick={handleExport}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition shadow-sm ${downloading === 'custom' ? 'bg-emerald-500 text-white' : 'bg-rose-500 hover:bg-rose-600 text-white'}`}
              >
                {downloading === 'custom' ? <><CheckCircle size={18} /> جاري التصدير...</> : <><Download size={18} /> تصدير البيانات</>}
              </button>
            </div>
          </div>

          {/* Scheduled Reports */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="font-bold text-slate-800 text-sm mb-4">التقارير المجدولة</h2>
            <div className="space-y-3">
              {SCHEDULE_OPTIONS.map((s, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-sm text-slate-700 font-medium">
                    <s.icon size={16} className="text-slate-400" />
                    {s.label}
                  </div>
                  <div className={`w-10 h-5 rounded-full relative transition-colors ${s.active ? 'bg-rose-500' : 'bg-slate-200'}`}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${s.active ? 'right-0.5' : 'left-0.5'}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reports Library */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-800 text-base">مكتبة التقارير</h2>
                <p className="text-xs text-slate-400 mt-0.5">تقارير جاهزة للتحميل الفوري</p>
              </div>
              <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 font-semibold bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition">
                <RefreshCw size={13} /> تحديث
              </button>
            </div>
            <div className="divide-y divide-slate-50">
              {REPORTS.map(r => (
                <div key={r.id} className="flex items-center gap-4 px-5 py-5 hover:bg-slate-50 transition-colors group">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${r.color}`}>
                    <r.icon size={22} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 group-hover:text-rose-600 transition truncate">{r.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">{r.desc}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="flex items-center gap-1 text-xs text-slate-400"><Calendar size={11} />{r.generated}</span>
                      <span className="text-xs text-slate-300">•</span>
                      <span className="text-xs font-medium text-slate-500">{r.size}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${r.format === 'Excel' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>{r.format}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload(r.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition shrink-0 ${downloading === r.id ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border border-slate-200'}`}
                  >
                    {downloading === r.id ? <CheckCircle size={15} /> : <Download size={15} />}
                    <span className="hidden sm:inline">{downloading === r.id ? 'تم!' : 'تحميل'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import {
  TrendingUp, TrendingDown, Users, Activity, Clock,
  Calendar, BarChart2, Globe, Award, Target, Download,
  ChevronDown, Zap, ArrowUp, ArrowDown
} from 'lucide-react';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

// ─── Data ────────────────────────────────────────────────────────────────
const monthlyGrowth = [
  { month: 'أكتوبر', new: 42, churned: 8, net: 34 },
  { month: 'نوفمبر', new: 58, churned: 11, net: 47 },
  { month: 'ديسمبر', new: 71, churned: 9, net: 62 },
  { month: 'يناير', new: 89, churned: 14, net: 75 },
  { month: 'فبراير', new: 112, churned: 12, net: 100 },
  { month: 'مارس', new: 134, churned: 10, net: 124 },
  { month: 'أبريل', new: 148, churned: 8, net: 140 },
];

const dailyActiveUsers = [
  { day: 'أحد', users: 198 }, { day: 'إثن', users: 210 }, { day: 'ثلث', users: 245 },
  { day: 'أرب', users: 230 }, { day: 'خمس', users: 268 }, { day: 'جمع', users: 290 },
  { day: 'سبت', users: 195 },
];

const featureUsage = [
  { feature: 'التغذية', usage: 92, color: '#f43f5e' },
  { feature: 'الترطيب', usage: 78, color: '#06b6d4' },
  { feature: 'اليوميات', usage: 65, color: '#8b5cf6' },
  { feature: 'المجتمع', usage: 58, color: '#f59e0b' },
  { feature: 'الوصفات', usage: 74, color: '#10b981' },
  { feature: 'العافية', usage: 61, color: '#3b82f6' },
];

const retentionData = [
  { week: 'الأسبوع 1', rate: 100 },
  { week: 'الأسبوع 2', rate: 84 },
  { week: 'الأسبوع 3', rate: 74 },
  { week: 'الأسبوع 4', rate: 69 },
  { week: 'الأسبوع 6', rate: 61 },
  { week: 'الأسبوع 8', rate: 55 },
  { week: 'الأسبوع 12', rate: 48 },
];

const sessionDuration = [
  { range: '0-2 د', count: 45 },
  { range: '2-5 د', count: 120 },
  { range: '5-10 د', count: 210 },
  { range: '10-20 د', count: 185 },
  { range: '20-30 د', count: 98 },
  { range: '30+ د', count: 54 },
];

const phaseEngagement = [
  { phase: 'التعافي', meals: 88, hydration: 82, journal: 70, community: 90 },
  { phase: 'كيماوي', meals: 72, hydration: 78, journal: 65, community: 60 },
  { phase: 'إشعاعي', meals: 80, hydration: 85, journal: 55, community: 45 },
  { phase: 'هرموني', meals: 85, hydration: 75, journal: 78, community: 72 },
];

const cityData = [
  { city: 'الجزائر العاصمة', count: 198, pct: 36 },
  { city: 'وهران', count: 112, pct: 21 },
  { city: 'قسنطينة', count: 87, pct: 16 },
  { city: 'عنابة', count: 62, pct: 11 },
  { city: 'سطيف', count: 48, pct: 9 },
  { city: 'أخرى', count: 35, pct: 7 },
];

const COLORS = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#64748b'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-100 rounded-xl px-4 py-3 shadow-xl text-sm">
        <p className="font-bold text-slate-700 mb-2 pb-1 border-b border-slate-50">{label}</p>
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-2 text-xs mt-1">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color || p.fill }}></span>
            <span className="text-slate-500">{p.name}:</span>
            <span className="font-bold text-slate-800">{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

function MetricCard({ label, value, change, up, sub, color = 'text-rose-500', bg = 'bg-rose-50' }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:-translate-y-0.5 transition-all">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">{label}</p>
      <p className="text-3xl font-bold text-slate-800 mb-1">{value}</p>
      {change && (
        <div className={`flex items-center gap-1 text-xs font-semibold ${up ? 'text-emerald-600' : 'text-red-500'}`}>
          {up ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
          {change}
        </div>
      )}
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-5">
      <h3 className="font-bold text-slate-800 text-base">{title}</h3>
      {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState('هذا الشهر');

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">التحليلات والإحصاءات</h1>
          <p className="text-slate-500 text-sm mt-0.5">رؤى تفصيلية حول أداء المنصة وسلوك المستخدمات</p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
            {['هذا الأسبوع', 'هذا الشهر', 'آخر 3 أشهر'].map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${period === p ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {p}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-semibold transition shadow-sm">
            <Download size={15} /> تصدير
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="متوسط جلسة الاستخدام" value="11.4 د" change="↑ 1.8 دقيقة" up={true} sub="مقارنة بالشهر الماضي" />
        <MetricCard label="معدل الاحتفاظ (4 أسابيع)" value="69%" change="↑ 3.2%" up={true} sub="من أصل 542 مريضة" />
        <MetricCard label="معدل التسجيل اليومي" value="4.8" change="↑ 0.6" up={true} sub="مستخدمة جديدة/يوم" />
        <MetricCard label="معدل التراجع (Churn)" value="2.1%" change="↓ 0.4%" up={true} sub="تحسن واضح هذا الشهر" />
      </div>

      {/* Growth & Daily Active */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Net Growth */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <SectionHeader title="نمو قاعدة المريضات" subtitle="مقارنة التسجيلات الجديدة والمتوقفات والصافي" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyGrowth} margin={{ top: 5, right: 5, left: -30, bottom: 0 }} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc', radius: 6 }} />
                <Bar dataKey="new" name="تسجيلات جديدة" fill="#10b981" radius={[5, 5, 0, 0]} barSize={18} />
                <Bar dataKey="churned" name="متوقفات" fill="#f43f5e" radius={[5, 5, 0, 0]} barSize={18} />
                <Bar dataKey="net" name="الصافي" fill="#3b82f6" radius={[5, 5, 0, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 mt-2 justify-end flex-wrap">
            {[['تسجيلات جديدة', '#10b981'], ['متوقفات', '#f43f5e'], ['الصافي', '#3b82f6']].map(([l, c]) => (
              <div key={l} className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <span className="w-2.5 h-2.5 rounded-sm block" style={{ backgroundColor: c }}></span> {l}
              </div>
            ))}
          </div>
        </div>

        {/* DAU */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <SectionHeader title="المستخدمات النشطات يومياً" subtitle="توزيع النشاط على أيام الأسبوع" />
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyActiveUsers} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc', radius: 4 }} />
                <Bar dataKey="users" name="مستخدمات" fill="#f43f5e" radius={[5, 5, 0, 0]} barSize={24} opacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Retention + Session Duration */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Retention Curve */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <SectionHeader title="منحنى الاحتفاظ" subtitle="نسبة المريضات اللواتي يستمررن في الاستخدام بمرور الوقت" />
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={retentionData} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
                <defs>
                  <linearGradient id="retentionGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="10%" stopColor="#8b5cf6" stopOpacity={0.2} />
                    <stop offset="90%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} domain={[0, 100]} unit="%" />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="rate" name="معدل الاحتفاظ" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#retentionGrad)" dot={{ r: 4, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Session Duration */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <SectionHeader title="مدة جلسة الاستخدام" subtitle="توزيع المستخدمات حسب مدة البقاء في التطبيق" />
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sessionDuration} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc', radius: 4 }} />
                <Bar dataKey="count" name="عدد المستخدمات" fill="#06b6d4" radius={[5, 5, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Feature Usage + Geographic */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Feature Usage */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <SectionHeader title="معدل استخدام كل قسم" subtitle="نسبة المريضات اللواتي تفاعلن مع كل ميزة هذا الشهر" />
          <div className="space-y-4 mt-2">
            {featureUsage.map((f, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="w-16 text-xs font-semibold text-slate-600 text-right shrink-0">{f.feature}</span>
                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${f.usage}%`, backgroundColor: f.color }}
                  ></div>
                </div>
                <span className="w-10 text-xs font-bold text-slate-700 text-left shrink-0">{f.usage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <SectionHeader title="التوزيع الجغرافي" subtitle="توزيع المريضات حسب المدينة في الجزائر" />
          <div className="space-y-3 mt-2">
            {cityData.map((c, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ backgroundColor: COLORS[i] }}>
                  {i + 1}
                </div>
                <span className="flex-1 text-sm font-semibold text-slate-700">{c.city}</span>
                <div className="w-28 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${c.pct}%`, backgroundColor: COLORS[i] }}></div>
                </div>
                <span className="w-14 text-xs text-slate-500 font-medium text-left">{c.count} ({c.pct}%)</span>
              </div>
            ))}
          </div>
          <div className="mt-5 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-xs text-slate-400 font-semibold mb-1">إجمالي المدن المغطاة</p>
            <p className="text-2xl font-bold text-slate-800">24 مدينة</p>
            <p className="text-xs text-slate-400 mt-0.5">عبر كامل التراب الجزائري</p>
          </div>
        </div>
      </div>

      {/* Phase Engagement Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <SectionHeader title="التفاعل حسب المرحلة العلاجية" subtitle="متوسط معدل استخدام كل ميزة لكل مجموعة علاجية" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">المرحلة العلاجية</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-rose-500 uppercase tracking-wide">التغذية</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-cyan-500 uppercase tracking-wide">الترطيب</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-purple-500 uppercase tracking-wide">اليوميات</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-amber-500 uppercase tracking-wide">المجتمع</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">المتوسط</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {phaseEngagement.map((row, i) => {
                const avg = Math.round((row.meals + row.hydration + row.journal + row.community) / 4);
                return (
                  <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-800">{row.phase}</td>
                    {[row.meals, row.hydration, row.journal, row.community].map((v, j) => (
                      <td key={j} className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-sm font-bold text-slate-800">{v}%</span>
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-rose-400" style={{ width: `${v}%` }}></div>
                          </div>
                        </div>
                      </td>
                    ))}
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold ${avg >= 75 ? 'bg-emerald-50 text-emerald-700' : avg >= 60 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-600'}`}>
                        {avg}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

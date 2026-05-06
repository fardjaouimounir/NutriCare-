import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, FileText, Activity, AlertTriangle, TrendingUp, TrendingDown,
  ArrowLeft, Clock, Heart, Droplets, Apple, MessageSquare,
  CheckCircle, XCircle, Bell, Zap, Server, HardDrive,
  Wifi, Shield, Star, Eye, ThumbsUp, Calendar, UserPlus,
  BarChart2, Download, RefreshCw, ChevronRight, Flag,
  Coffee, Award, Target, Utensils, BookOpen, Flame,
  AlertCircle, Info, PlusCircle, Settings, Database
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, RadialBarChart, RadialBar, Legend
} from 'recharts';

// ─── Mock Data ───────────────────────────────────────────────────────────
const registrationData = [
  { month: 'أكتوبر', users: 95, active: 70 },
  { month: 'نوفمبر', users: 130, active: 100 },
  { month: 'ديسمبر', users: 168, active: 140 },
  { month: 'يناير', users: 210, active: 180 },
  { month: 'فبراير', users: 275, active: 240 },
  { month: 'مارس', users: 340, active: 298 },
  { month: 'أبريل', users: 420, active: 370 },
];

const weeklyActivity = [
  { day: 'أحد', meals: 310, hydration: 280, journal: 140 },
  { day: 'إثن', meals: 295, hydration: 310, journal: 165 },
  { day: 'ثلث', meals: 430, hydration: 390, journal: 200 },
  { day: 'أرب', meals: 385, hydration: 350, journal: 180 },
  { day: 'خمس', meals: 470, hydration: 420, journal: 215 },
  { day: 'جمع', meals: 510, hydration: 460, journal: 240 },
  { day: 'سبت', meals: 360, hydration: 320, journal: 170 },
];

const phaseData = [
  { name: 'مرحلة التعافي', value: 38, color: '#10b981' },
  { name: 'العلاج الكيماوي', value: 28, color: '#3b82f6' },
  { name: 'العلاج الإشعاعي', value: 17, color: '#f59e0b' },
  { name: 'العلاج الهرموني', value: 10, color: '#8b5cf6' },
  { name: 'تشخيص حديث', value: 7, color: '#f43f5e' },
];

const engagementData = [
  { name: 'التغذية', value: 87, fill: '#f43f5e' },
  { name: 'الترطيب', value: 72, fill: '#3b82f6' },
  { name: 'المجتمع', value: 65, fill: '#8b5cf6' },
  { name: 'اليوميات', value: 58, fill: '#f59e0b' },
];

const topRecipes = [
  { title: 'حساء العدس بالكركم', author: 'د. نورة', views: 4210, likes: 612, category: 'وجبة رئيسية', trend: 'up' },
  { title: 'سلطة الأفوكادو والحمص', author: 'مريم خالد', views: 3890, likes: 541, category: 'سلطات', trend: 'up' },
  { title: 'عصير الزنجبيل والليمون', author: 'سارة أحمد', views: 3210, likes: 489, category: 'مشروبات', trend: 'down' },
  { title: 'شوفان بالتوت والمكسرات', author: 'د. رانيا', views: 2950, likes: 415, category: 'إفطار', trend: 'up' },
  { title: 'سمك مشوي بالأعشاب', author: 'خديجة علي', views: 2640, likes: 378, category: 'وجبة رئيسية', trend: 'up' },
];

const patientAlerts = [
  { name: 'فاطمة الزهراء', alert: 'لم تسجل أي وجبات منذ 5 أيام', type: 'nutrition', severity: 'high', avatar: 'ف' },
  { name: 'نورا إبراهيم', alert: 'انخفاض في معدل الترطيب اليومي', type: 'hydration', severity: 'medium', avatar: 'ن' },
  { name: 'خديجة علي', alert: 'لم تكمل استبيان الرعاية الأسبوعي', type: 'wellness', severity: 'low', avatar: 'خ' },
  { name: 'أميرة سعيد', alert: 'أبلغت عن آثار جانبية للعلاج', type: 'medical', severity: 'high', avatar: 'أ' },
];

const activityFeed = [
  { user: 'سارة أحمد', action: 'سجّلت وجبة الإفطار', time: 'منذ 3 دقائق', icon: Utensils, color: 'text-emerald-500 bg-emerald-50' },
  { user: 'مريم خالد', action: 'نشرت وصفة جديدة للمراجعة', time: 'منذ 8 دقائق', icon: FileText, color: 'text-blue-500 bg-blue-50' },
  { user: 'عائشة نبيل', action: 'أكملت تسجيل شرب الماء اليومي', time: 'منذ 15 دقيقة', icon: Droplets, color: 'text-cyan-500 bg-cyan-50' },
  { user: 'زينب حسن', action: 'كتبت في يومياتها', time: 'منذ 22 دقيقة', icon: BookOpen, color: 'text-purple-500 bg-purple-50' },
  { user: 'فاطمة الزهراء', action: 'انضمت للمجتمع لأول مرة', time: 'منذ 34 دقيقة', icon: Heart, color: 'text-rose-500 bg-rose-50' },
  { user: 'نورا إبراهيم', action: 'أرسلت بلاغاً عن محتوى', time: 'منذ 48 دقيقة', icon: Flag, color: 'text-amber-500 bg-amber-50' },
  { user: 'أميرة سعيد', action: 'أكملت برنامج العافية اليومي', time: 'منذ ساعة', icon: Award, color: 'text-indigo-500 bg-indigo-50' },
  { user: 'خديجة علي', action: 'طرحت سؤالاً في المجتمع', time: 'منذ ساعتين', icon: MessageSquare, color: 'text-pink-500 bg-pink-50' },
];

const specialists = [
  { name: 'د. نورة الشامي', specialty: 'أخصائية تغذية', patients: 128, rating: 4.9, published: 24, avatar: 'ن' },
  { name: 'د. رانيا فهمي', specialty: 'أخصائية نفسية', patients: 94, rating: 4.7, published: 18, avatar: 'ر' },
  { name: 'د. أمل رشيد', specialty: 'أخصائية أورام', patients: 156, rating: 4.8, published: 31, avatar: 'أ' },
  { name: 'د. لينا محمود', specialty: 'معالجة طبيعية', patients: 72, rating: 4.6, published: 12, avatar: 'ل' },
];

const systemStats = [
  { label: 'وقت التشغيل', value: '99.8%', icon: Wifi, color: 'text-emerald-600', bg: 'bg-emerald-50', status: 'جيد' },
  { label: 'مساحة التخزين', value: '42%', icon: HardDrive, color: 'text-blue-600', bg: 'bg-blue-50', status: 'طبيعي' },
  { label: 'أداء الخادم', value: '94ms', icon: Server, color: 'text-indigo-600', bg: 'bg-indigo-50', status: 'ممتاز' },
  { label: 'قاعدة البيانات', value: 'مستقرة', icon: Database, color: 'text-purple-600', bg: 'bg-purple-50', status: 'جيد' },
];

// ─── Sub-components ───────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-100 rounded-xl px-4 py-3 shadow-xl text-sm">
        <p className="font-bold text-slate-700 mb-2 border-b border-slate-50 pb-1">{label}</p>
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-2 text-xs mt-1">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color || p.fill }}></span>
            <span className="text-slate-500">{p.name}:</span>
            <span className="font-bold text-slate-800">{p.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const severityConfig = {
  high: { label: 'عالي', badge: 'bg-red-50 text-red-700 border border-red-200', dot: 'bg-red-500' },
  medium: { label: 'متوسط', badge: 'bg-amber-50 text-amber-700 border border-amber-200', dot: 'bg-amber-500' },
  low: { label: 'منخفض', badge: 'bg-slate-100 text-slate-600 border border-slate-200', dot: 'bg-slate-400' },
};

const alertTypeIcon = {
  nutrition: { icon: Utensils, color: 'bg-orange-50 text-orange-500' },
  hydration: { icon: Droplets, color: 'bg-blue-50 text-blue-500' },
  wellness: { icon: Heart, color: 'bg-pink-50 text-pink-500' },
  medical: { icon: AlertCircle, color: 'bg-red-50 text-red-500' },
};

function SectionHeader({ title, subtitle, action, actionLabel }) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        <h3 className="font-bold text-slate-800 text-base">{title}</h3>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {action && (
        <Link to={action} className="flex items-center gap-1.5 text-xs font-semibold text-rose-500 hover:text-rose-600 transition shrink-0">
          {actionLabel || 'عرض الكل'} <ArrowLeft size={13} />
        </Link>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────
export default function AdminPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  const timeStr = currentTime.toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' });
  const dateStr = currentTime.toLocaleDateString('ar-DZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const kpiCards = [
    { label: 'إجمالي المريضات', value: '542', change: '+12%', up: true, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50', sub: '64 هذا الشهر' },
    { label: 'نشطات اليوم', value: '128', change: '+8%', up: true, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50', sub: '23.6% معدل نشاط' },
    { label: 'وجبات مسجلة', value: '1,492', change: '+22%', up: true, icon: Utensils, color: 'text-rose-500', bg: 'bg-rose-50', sub: 'هذا الأسبوع' },
    { label: 'جلسات الترطيب', value: '3,841', change: '+15%', up: true, icon: Droplets, color: 'text-cyan-600', bg: 'bg-cyan-50', sub: 'منذ بداية الشهر' },
    { label: 'مشاركات المجتمع', value: '289', change: '-3%', up: false, icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50', sub: 'هذا الأسبوع' },
    { label: 'بلاغات للمراجعة', value: '3', change: '+1', up: false, icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50', sub: 'تحتاج إجراءاً فورياً' },
  ];

  const quickActions = [
    { label: 'إضافة مريضة', icon: UserPlus, color: 'bg-indigo-500', to: '/admin/users' },
    { label: 'مراجعة المحتوى', icon: FileText, color: 'bg-rose-500', to: '/admin/content' },
    { label: 'إرسال إشعار', icon: Bell, color: 'bg-amber-500', to: '/admin/settings' },
    { label: 'تصدير التقرير', icon: Download, color: 'bg-emerald-500', to: '#' },
    { label: 'إعدادات المنصة', icon: Settings, color: 'bg-slate-600', to: '/admin/settings' },
    { label: 'نسخ احتياطي', icon: Database, color: 'bg-purple-500', to: '#' },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">لوحة التحكم الرئيسية</h1>
          <p className="text-slate-400 text-sm mt-0.5 flex items-center gap-1.5">
            <Clock size={13} /> {dateStr} — {timeStr}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRefresh}
            className={`flex items-center gap-2 px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition ${refreshing ? 'opacity-60 pointer-events-none' : ''}`}
          >
            <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">تحديث</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-semibold transition shadow-sm shadow-rose-200">
            <Download size={15} />
            <span>تصدير التقرير</span>
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiCards.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:-translate-y-0.5 transition-all cursor-default group">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl ${s.bg} ${s.color} flex items-center justify-center`}>
                <s.icon size={18} />
              </div>
              <span className={`flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.5 rounded-lg ${s.up ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                {s.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {s.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-800 leading-tight">{s.value}</p>
            <p className="text-xs font-semibold text-slate-600 mt-0.5">{s.label}</p>
            <p className="text-xs text-slate-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Quick Actions ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">إجراءات سريعة</p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {quickActions.map((a, i) => (
            <Link key={i} to={a.to} className="flex flex-col items-center gap-2.5 p-3 rounded-xl hover:bg-slate-50 transition group">
              <div className={`w-11 h-11 rounded-xl ${a.color} text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
                <a.icon size={20} />
              </div>
              <span className="text-xs font-semibold text-slate-600 text-center leading-tight">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Charts Row 1 ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Area Chart - Registrations */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <SectionHeader title="نمو المريضات والمستخدمات النشطات" subtitle="مقارنة بين الإجمالي والنشطات شهرياً" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={registrationData} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="10%" stopColor="#f43f5e" stopOpacity={0.2} />
                    <stop offset="90%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="areaActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="10%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="90%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="users" name="إجمالي" stroke="#f43f5e" strokeWidth={2.5} fill="url(#areaUsers)" dot={false} activeDot={{ r: 5, fill: '#f43f5e', stroke: '#fff', strokeWidth: 2 }} />
                <Area type="monotone" dataKey="active" name="نشطات" stroke="#10b981" strokeWidth={2} fill="url(#areaActive)" dot={false} activeDot={{ r: 4, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 mt-2 justify-end">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium"><span className="w-3 h-0.5 bg-rose-500 rounded-full block"></span> إجمالي المريضات</div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium"><span className="w-3 h-0.5 bg-emerald-500 rounded-full block"></span> النشطات</div>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <SectionHeader title="المراحل العلاجية" subtitle="توزيع المريضات حسب المرحلة" />
          <div className="h-44 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={phaseData} cx="50%" cy="50%" innerRadius={52} outerRadius={76} paddingAngle={3} dataKey="value">
                  {phaseData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v, n) => [`${v}%`, n]} contentStyle={{ fontSize: 12, borderRadius: 10, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {phaseData.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                  <span className="text-slate-600 font-medium truncate">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color }}></div>
                  </div>
                  <span className="font-bold text-slate-700 w-8 text-left">{item.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Charts Row 2 ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Grouped Bar Chart */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <SectionHeader title="نشاط المنصة الأسبوعي" subtitle="مقارنة الوجبات والترطيب واليوميات" />
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyActivity} margin={{ top: 5, right: 5, left: -30, bottom: 0 }} barGap={3}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc', radius: 6 }} />
                <Bar dataKey="meals" name="وجبات" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={14} />
                <Bar dataKey="hydration" name="ترطيب" fill="#06b6d4" radius={[4, 4, 0, 0]} barSize={14} />
                <Bar dataKey="journal" name="يوميات" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 mt-2 justify-end flex-wrap">
            {[['وجبات', '#f43f5e'], ['ترطيب', '#06b6d4'], ['يوميات', '#8b5cf6']].map(([l, c]) => (
              <div key={l} className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <span className="w-2.5 h-2.5 rounded-sm block" style={{ backgroundColor: c }}></span> {l}
              </div>
            ))}
          </div>
        </div>

        {/* Engagement Radial Bars */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <SectionHeader title="معدل التفاعل" subtitle="نسبة استخدام كل قسم" />
          <div className="space-y-4 mt-2">
            {engagementData.map((item, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-700">{item.name}</span>
                  <span className="font-bold" style={{ color: item.fill }}>{item.value}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${item.value}%`, backgroundColor: item.fill }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-xs font-bold text-slate-500 mb-1">معدل الاحتفاظ بالمستخدمات</p>
            <p className="text-3xl font-bold text-slate-800">78.4%</p>
            <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1"><TrendingUp size={11} /> أعلى بـ 5.2% من الشهر الماضي</p>
          </div>
        </div>
      </div>

      {/* ── Patient Alerts + Activity Feed ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Patient Alerts */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <SectionHeader
            title="تنبيهات المريضات"
            subtitle="حالات تحتاج متابعة فورية"
            action="/admin/users"
            actionLabel="عرض الكل"
          />
          <div className="space-y-3">
            {patientAlerts.map((alert, i) => {
              const sev = severityConfig[alert.severity];
              const typeInfo = alertTypeIcon[alert.type];
              const TypeIcon = typeInfo.icon;
              return (
                <div key={i} className="flex items-start gap-3.5 p-3.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors group">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br from-rose-400 to-pink-600 text-white flex items-center justify-center font-bold text-sm shrink-0`}>
                    {alert.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <p className="text-sm font-bold text-slate-800">{alert.name}</p>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold ${sev.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sev.dot}`}></span>
                        {sev.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{alert.alert}</p>
                  </div>
                  <div className={`w-8 h-8 rounded-lg ${typeInfo.color} flex items-center justify-center shrink-0`}>
                    <TypeIcon size={15} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <SectionHeader title="آخر النشاطات" subtitle="تدفق فوري لنشاط المنصة" />
          <div className="space-y-1 relative">
            <div className="absolute right-[22px] top-0 bottom-0 w-px bg-slate-100"></div>
            {activityFeed.map((item, i) => {
              const ItemIcon = item.icon;
              return (
                <div key={i} className="flex items-start gap-3.5 py-2.5 group">
                  <div className={`w-9 h-9 rounded-full ${item.color} flex items-center justify-center shrink-0 z-10 border-2 border-white shadow-sm`}>
                    <ItemIcon size={15} />
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <p className="text-xs text-slate-700 leading-snug">
                      <span className="font-bold">{item.user}</span>{' '}
                      <span className="text-slate-500">{item.action}</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Top Content + Specialists ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Top Recipes Table */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <SectionHeader title="أفضل الوصفات أداءً" subtitle="الأكثر مشاهدة وتفاعلاً هذا الشهر" action="/admin/content" actionLabel="عرض المحتوى" />
          </div>
          <div className="divide-y divide-slate-50">
            {topRecipes.map((recipe, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 transition-colors group">
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 font-bold text-sm flex items-center justify-center shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-rose-500 transition-colors">{recipe.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{recipe.author}</p>
                </div>
                <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-lg hidden sm:block">{recipe.category}</span>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                    <Eye size={12} className="text-slate-400" /> {recipe.views.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                    <ThumbsUp size={12} className="text-slate-400" /> {recipe.likes}
                  </span>
                  <span className={`${recipe.trend === 'up' ? 'text-emerald-500' : 'text-red-400'}`}>
                    {recipe.trend === 'up' ? <TrendingUp size={15} /> : <TrendingDown size={15} />}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Specialists */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <SectionHeader title="الأخصائيات" subtitle="أداء فريق الدعم الطبي" />
          </div>
          <div className="divide-y divide-slate-50">
            {specialists.map((sp, i) => (
              <div key={i} className="flex items-center gap-3.5 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {sp.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">{sp.name}</p>
                  <p className="text-xs text-slate-400 truncate">{sp.specialty}</p>
                </div>
                <div className="text-left shrink-0">
                  <div className="flex items-center gap-0.5 justify-end">
                    <Star size={11} className="text-amber-400 fill-amber-400" />
                    <span className="text-xs font-bold text-slate-700">{sp.rating}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{sp.patients} مريضة</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── System Health ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <SectionHeader title="صحة النظام" subtitle="مؤشرات الأداء التقني للمنصة" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {systemStats.map((s, i) => (
            <div key={i} className="flex items-center gap-3.5 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className={`w-10 h-10 rounded-xl ${s.bg} ${s.color} flex items-center justify-center shrink-0`}>
                <s.icon size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{s.value}</p>
                <p className="text-xs text-slate-500 font-medium">{s.label}</p>
                <span className="inline-block mt-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">{s.status}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3">
          <CheckCircle size={18} className="text-emerald-500 shrink-0" />
          <p className="text-sm font-semibold text-emerald-700">جميع الأنظمة تعمل بشكل طبيعي — آخر تحديث: {timeStr}</p>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import {
  Bell, Send, Users, CheckCircle, Clock, Star,
  Trash2, Eye, PlusCircle, Megaphone, Heart,
  AlertTriangle, Info, Zap, Calendar, Target,
  ChevronDown, Filter, Award
} from 'lucide-react';

const SENT_NOTIFICATIONS = [
  {
    id: 1, title: 'تذكير بشرب الماء', body: 'لا تنسي شرب كميتك اليومية من الماء! الترطيب الجيد يساعد جسمك على التعافي.', target: 'جميع المريضات', type: 'reminder', sent: 'منذ 3 ساعات', reach: 498, opened: 341, openRate: 68,
  },
  {
    id: 2, title: 'وصفة جديدة: سلطة الأفوكادو', body: 'وصفة جديدة مغذية ومشهية أضافتها أخصائيتنا د. نورة الشامي خصيصاً لمرضى العلاج الكيماوي.', target: 'مريضات العلاج الكيماوي', type: 'content', sent: 'البارحة', reach: 152, opened: 128, openRate: 84,
  },
  {
    id: 3, title: 'إنجاز أسبوعي! 🏆', body: 'أكملتِ أسبوعاً كاملاً من تسجيل وجباتك. استمري في هذا التقدم الرائع!', target: 'مريضات نشطات', type: 'achievement', sent: 'منذ يومين', reach: 128, opened: 119, openRate: 93,
  },
  {
    id: 4, title: 'تحديث المنصة: ميزات جديدة', body: 'أضفنا ميزة تتبع مستوى الطاقة اليومي وقسماً جديداً للتمارين الخفيفة.', target: 'جميع المريضات', type: 'system', sent: 'منذ أسبوع', reach: 542, opened: 380, openRate: 70,
  },
];

const typeConfig = {
  reminder: { label: 'تذكير', icon: Bell, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  content: { label: 'محتوى جديد', icon: Star, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  achievement: { label: 'إنجاز', icon: Award, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  system: { label: 'نظام', icon: Zap, color: 'text-purple-600 bg-purple-50 border-purple-200' },
  alert: { label: 'تنبيه', icon: AlertTriangle, color: 'text-red-600 bg-red-50 border-red-200' },
};

const TEMPLATES = [
  { title: 'تذكير يومي بالماء', body: 'لا تنسي شرب كميتك اليومية من الماء اليوم! الترطيب مهم جداً لصحتك.' },
  { title: 'تشجيع أسبوعي', body: 'أسبوع آخر من القوة والصبر! نحن فخورات بك ومعكِ في كل خطوة.' },
  { title: 'تنبيه وصفة جديدة', body: 'وصفة جديدة مغذية ومناسبة لمرحلتك العلاجية في انتظارك.' },
  { title: 'إنجاز التغذية', body: 'لقد أكملتِ أهداف تغذيتك لهذا الأسبوع. عمل رائع!' },
];

function CircleProgress({ value, size = 60, stroke = 5, color = '#f43f5e' }) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
    </svg>
  );
}

export default function AdminNotificationsPage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [target, setTarget] = useState('جميع المريضات');
  const [type, setType] = useState('reminder');
  const [sent, setSent] = useState(false);
  const [scheduleMode, setScheduleMode] = useState(false);

  const handleSend = () => {
    if (!title || !body) return;
    setSent(true);
    setTimeout(() => { setSent(false); setTitle(''); setBody(''); }, 2500);
  };

  const applyTemplate = (t) => { setTitle(t.title); setBody(t.body); };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">مركز الإشعارات</h1>
        <p className="text-slate-500 text-sm mt-0.5">إرسال وإدارة الإشعارات للمريضات</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'إجمالي الإشعارات', value: '246', icon: Bell, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'معدل الفتح', value: '71%', icon: Eye, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'إشعارات هذا الأسبوع', value: '18', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'مستلمات', value: '498', icon: Users, color: 'text-rose-500', bg: 'bg-rose-50' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl ${s.bg} ${s.color} flex items-center justify-center shrink-0`}><s.icon size={22} /></div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{s.value}</p>
              <p className="text-xs text-slate-500 font-medium">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        {/* Compose Panel */}
        <div className="xl:col-span-3 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="font-bold text-slate-800 text-base mb-5 flex items-center gap-2">
              <Megaphone size={18} className="text-rose-500" />
              إنشاء إشعار جديد
            </h2>

            {/* Templates */}
            <div className="mb-5">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2.5">قوالب جاهزة</p>
              <div className="grid grid-cols-2 gap-2">
                {TEMPLATES.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => applyTemplate(t)}
                    className="text-right px-3 py-2.5 rounded-xl border border-slate-200 hover:border-rose-300 hover:bg-rose-50/30 transition text-xs font-semibold text-slate-600 hover:text-rose-700"
                  >
                    {t.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {/* Type */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-2">نوع الإشعار</label>
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(typeConfig).map(([k, v]) => (
                    <button
                      key={k}
                      onClick={() => setType(k)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${type === k ? 'bg-rose-500 text-white border-rose-500 shadow-sm' : `${v.color} hover:opacity-80`}`}
                    >
                      <v.icon size={13} /> {v.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-2">المستهدفات</label>
                <select
                  value={target}
                  onChange={e => setTarget(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-300 bg-slate-50 appearance-none cursor-pointer"
                >
                  {['جميع المريضات', 'مريضات نشطات', 'مريضات العلاج الكيماوي', 'مريضات التعافي', 'مريضات غير نشطات'].map(o => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-2">العنوان</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="عنوان الإشعار..."
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-300 bg-slate-50 transition"
                />
              </div>

              {/* Body */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-2">نص الإشعار</label>
                <textarea
                  value={body}
                  onChange={e => setBody(e.target.value)}
                  rows={4}
                  placeholder="اكتبي نص رسالة الإشعار هنا..."
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-300 bg-slate-50 resize-none transition"
                />
                <p className="text-xs text-slate-400 mt-1 text-left">{body.length} / 200 حرف</p>
              </div>

              {/* Schedule toggle */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Calendar size={16} className="text-slate-400" />
                  جدولة الإرسال لوقت لاحق
                </div>
                <button
                  onClick={() => setScheduleMode(!scheduleMode)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${scheduleMode ? 'bg-rose-500' : 'bg-slate-300'}`}
                >
                  <span className={`inline-block w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform ${scheduleMode ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </button>
              </div>

              {scheduleMode && (
                <input type="datetime-local" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-300 bg-slate-50 transition" />
              )}

              {/* preview */}
              {(title || body) && (
                <div className="p-4 bg-slate-900 rounded-2xl text-white">
                  <p className="text-xs text-slate-400 mb-2 font-semibold">معاينة الإشعار</p>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-rose-500 flex items-center justify-center shrink-0">
                      {React.createElement(typeConfig[type]?.icon || Bell, { size: 16 })}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{title || 'عنوان الإشعار'}</p>
                      <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{body || 'نص الإشعار...'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={handleSend}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition shadow-sm ${sent ? 'bg-emerald-500 text-white' : 'bg-rose-500 hover:bg-rose-600 text-white'}`}
                >
                  {sent ? <><CheckCircle size={18} /> تم الإرسال!</> : <><Send size={18} /> {scheduleMode ? 'جدولة الإشعار' : 'إرسال الآن'}</>}
                </button>
                <button
                  onClick={() => { setTitle(''); setBody(''); }}
                  className="px-5 py-3 border border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition"
                >
                  مسح
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* History */}
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h2 className="font-bold text-slate-800 text-base">سجل الإشعارات</h2>
              <p className="text-xs text-slate-400 mt-0.5">آخر الإشعارات المُرسلة</p>
            </div>
            <div className="divide-y divide-slate-50">
              {SENT_NOTIFICATIONS.map(notif => {
                const tc = typeConfig[notif.type] || typeConfig.system;
                const NotifIcon = tc.icon;
                return (
                  <div key={notif.id} className="p-5 hover:bg-slate-50 transition group">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${tc.color} shrink-0`}>
                          <NotifIcon size={15} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{notif.title}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{notif.sent} · {notif.target}</p>
                        </div>
                      </div>
                      <button className="p-1.5 rounded-lg text-slate-300 hover:bg-red-50 hover:text-red-400 transition opacity-0 group-hover:opacity-100">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 mb-3 line-clamp-2">{notif.body}</p>
                    {/* Open Rate */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-emerald-400" style={{ width: `${notif.openRate}%` }}></div>
                      </div>
                      <span className="text-xs font-bold text-emerald-600 shrink-0">{notif.openRate}% فتح</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{notif.opened} من {notif.reach} استلمت</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

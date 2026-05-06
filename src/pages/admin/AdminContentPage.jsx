import React, { useState } from 'react';
import {
  FileText, MessageSquare, Utensils, AlertTriangle,
  CheckCircle, XCircle, Eye, Trash2, Clock, ThumbsUp,
  Flag, Search, Filter
} from 'lucide-react';

const PENDING_RECIPES = [
  { id: 1, title: 'حساء العدس المقوي بالكركم', author: 'مريم خالد', date: '13 أبريل 2026', category: 'وجبة رئيسية', status: 'قيد المراجعة' },
  { id: 2, title: 'سلطة الأفوكادو بزيت الزيتون', author: 'سارة أحمد', date: '12 أبريل 2026', category: 'سلطات', status: 'قيد المراجعة' },
  { id: 3, title: 'عصير الجزر والزنجبيل المقوي للمناعة', author: 'زينب حسن', date: '11 أبريل 2026', category: 'مشروبات', status: 'قيد المراجعة' },
];

const COMMUNITY_REPORTS = [
  { id: 1, type: 'محتوى مسيء', reporter: 'عائشة نبيل', content: 'تعليق في منتدى الدعم يحتوي على معلومات طبية مضللة...', date: '14 أبريل 2026', severity: 'عالي' },
  { id: 2, type: 'سلوك غير لائق', reporter: 'فاطمة الزهراء', content: 'منشور يحتوي على إعلانات تجارية غير مأذون بها...', date: '13 أبريل 2026', severity: 'متوسط' },
  { id: 3, type: 'محتوى مزيف', reporter: 'خديجة علي', content: 'صورة منتج ادعاء بأنه يشفي من السرطان بدون دليل علمي...', date: '12 أبريل 2026', severity: 'عالي' },
];

const PUBLISHED_ADVICE = [
  { id: 1, title: 'أهمية التغذية خلال العلاج الكيماوي', author: 'د. نورة الشامي', views: 2840, likes: 412, date: '10 أبريل 2026', status: 'منشور' },
  { id: 2, title: 'الأطعمة المفيدة لتعزيز المناعة', author: 'د. رانيا فهمي', views: 1930, likes: 318, date: '8 أبريل 2026', status: 'منشور' },
  { id: 3, title: 'التوازن الغذائي في مرحلة التعافي', author: 'د. نورة الشامي', views: 1200, likes: 198, date: '5 أبريل 2026', status: 'منشور' },
  { id: 4, title: 'الترطيب وأهميته خلال العلاج الإشعاعي', author: 'د. أمل رشيد', views: 890, likes: 145, date: '1 أبريل 2026', status: 'أرشيف' },
];

const severityConfig = {
  'عالي': { bg: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' },
  'متوسط': { bg: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  'منخفض': { bg: 'bg-slate-50 text-slate-600 border-slate-200', dot: 'bg-slate-400' },
};

function ActionButton({ icon: Icon, label, color, onClick }) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`p-1.5 rounded-lg transition-colors ${color}`}
    >
      <Icon size={15} />
    </button>
  );
}

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState('recipes');

  const tabs = [
    { id: 'recipes', label: 'وصفات للمراجعة', icon: Utensils, count: PENDING_RECIPES.length },
    { id: 'reports', label: 'بلاغات المجتمع', icon: Flag, count: COMMUNITY_REPORTS.length },
    { id: 'advice', label: 'المقالات والنصائح', icon: FileText, count: PUBLISHED_ADVICE.length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">إدارة المحتوى</h1>
        <p className="text-slate-500 text-sm mt-0.5">مراجعة وإدارة جميع محتوى المنصة</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'وصفات بانتظار الموافقة', value: PENDING_RECIPES.length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'بلاغات تحتاج مراجعة', value: COMMUNITY_REPORTS.filter(r => r.severity === 'عالي').length, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'مقالات منشورة', value: PUBLISHED_ADVICE.filter(a => a.status === 'منشور').length, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
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

      {/* Tabs & Content */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Tab Bar */}
        <div className="flex border-b border-slate-100 bg-slate-50/50">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-6 py-4 text-sm font-semibold transition-all border-b-2 -mb-px ${
                activeTab === tab.id
                  ? 'border-rose-500 text-rose-600 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <tab.icon size={17} />
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === tab.id ? 'bg-rose-100 text-rose-600' : 'bg-slate-200 text-slate-500'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="p-5">
          {/* Pending Recipes Tab */}
          {activeTab === 'recipes' && (
            <div className="space-y-3">
              {PENDING_RECIPES.map(recipe => (
                <div key={recipe.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                      <Utensils size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm group-hover:text-rose-600 transition-colors">{recipe.title}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-slate-400">بقلم: {recipe.author}</span>
                        <span className="text-xs text-slate-300">•</span>
                        <span className="text-xs text-slate-400">{recipe.date}</span>
                        <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-medium">{recipe.category}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ActionButton icon={Eye} label="مراجعة" color="text-slate-500 hover:bg-slate-100 hover:text-slate-800" />
                    <ActionButton icon={CheckCircle} label="موافقة" color="text-emerald-600 hover:bg-emerald-50" />
                    <ActionButton icon={XCircle} label="رفض" color="text-red-500 hover:bg-red-50" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Community Reports Tab */}
          {activeTab === 'reports' && (
            <div className="space-y-3">
              {COMMUNITY_REPORTS.map(report => {
                const sev = severityConfig[report.severity] || severityConfig['منخفض'];
                return (
                  <div key={report.id} className="p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors group space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                          <Flag size={17} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-slate-800 text-sm">{report.type}</p>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold border ${sev.bg}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${sev.dot}`}></span>
                              {report.severity}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">بلاغ من: {report.reporter} — {report.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <ActionButton icon={Eye} label="مراجعة" color="text-slate-500 hover:bg-slate-100 hover:text-slate-800" />
                        <ActionButton icon={CheckCircle} label="تأكيد ومعالجة" color="text-emerald-600 hover:bg-emerald-50" />
                        <ActionButton icon={XCircle} label="رفض البلاغ" color="text-slate-400 hover:bg-slate-100" />
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100 line-clamp-2">{report.content}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Published Advice Tab */}
          {activeTab === 'advice' && (
            <div className="space-y-3">
              {PUBLISHED_ADVICE.map(article => (
                <div key={article.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm group-hover:text-rose-600 transition-colors">{article.title}</p>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <span className="text-xs text-slate-400">{article.author}</span>
                        <span className="text-xs text-slate-300">•</span>
                        <span className="flex items-center gap-1 text-xs text-slate-400"><Eye size={12} /> {article.views.toLocaleString()}</span>
                        <span className="flex items-center gap-1 text-xs text-slate-400"><ThumbsUp size={12} /> {article.likes}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${article.status === 'منشور' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                          {article.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ActionButton icon={Eye} label="عرض" color="text-slate-500 hover:bg-slate-100 hover:text-slate-800" />
                    <ActionButton icon={FileText} label="تعديل" color="text-blue-600 hover:bg-blue-50" />
                    <ActionButton icon={Trash2} label="حذف" color="text-red-500 hover:bg-red-50" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

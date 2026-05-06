import React, { useState } from 'react';
import {
  Bell, Globe, Shield, Database, Mail, Palette,
  Save, RefreshCw, ChevronRight, ToggleLeft, ToggleRight,
  Info, Sliders, Lock, AlertTriangle
} from 'lucide-react';

function Toggle({ enabled, onChange }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${enabled ? 'bg-rose-500' : 'bg-slate-200'}`}
    >
      <span
        className={`inline-block w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
      />
    </button>
  );
}

function SettingRow({ label, description, children }) {
  return (
    <div className="flex items-center justify-between py-4 gap-6">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-700">{label}</p>
        {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function SectionCard({ title, icon: Icon, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50/60">
        <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center">
          <Icon size={17} />
        </div>
        <h2 className="font-bold text-slate-800 text-sm">{title}</h2>
      </div>
      <div className="px-6 divide-y divide-slate-50">{children}</div>
    </div>
  );
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    newRegistrations: true,
    emailNotifications: true,
    pushNotifications: false,
    communityPosts: true,
    contentModeration: true,
    autoApproveRecipes: false,
    dataBackup: true,
    analyticsTracking: true,
    twoFactor: false,
  });

  const [platformName, setPlatformName] = useState('NutriCare');
  const [supportEmail, setSupportEmail] = useState('support@nutricare.dz');
  const [saved, setSaved] = useState(false);

  const toggle = key => setSettings(prev => ({ ...prev, [key]: !prev[key] }));

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">إعدادات المنصة</h1>
          <p className="text-slate-500 text-sm mt-0.5">إدارة الإعدادات العامة والتفضيلات</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm ${
            saved
              ? 'bg-emerald-500 text-white'
              : 'bg-rose-500 hover:bg-rose-600 text-white'
          }`}
        >
          <Save size={16} />
          {saved ? 'تم الحفظ ✓' : 'حفظ التغييرات'}
        </button>
      </div>

      {/* General Settings */}
      <SectionCard title="الإعدادات العامة" icon={Globe}>
        <SettingRow label="اسم المنصة" description="الاسم المعروض للمستخدمين">
          <input
            value={platformName}
            onChange={e => setPlatformName(e.target.value)}
            className="w-44 text-sm px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-400 text-slate-700 bg-slate-50/50 transition"
          />
        </SettingRow>
        <SettingRow label="البريد الإلكتروني للدعم" description="يُستخدم في رسائل التواصل مع المستخدمين">
          <input
            value={supportEmail}
            onChange={e => setSupportEmail(e.target.value)}
            className="w-56 text-sm px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-400 text-slate-700 bg-slate-50/50 transition"
            dir="ltr"
          />
        </SettingRow>
        <SettingRow label="وضع الصيانة" description="تعطيل المنصة مؤقتاً وعرض صفحة الصيانة">
          <Toggle enabled={settings.maintenanceMode} onChange={() => toggle('maintenanceMode')} />
        </SettingRow>
        <SettingRow label="السماح بالتسجيل الجديد" description="تمكين انضمام مريضات جدد إلى المنصة">
          <Toggle enabled={settings.newRegistrations} onChange={() => toggle('newRegistrations')} />
        </SettingRow>
      </SectionCard>

      {/* Notifications */}
      <SectionCard title="الإشعارات" icon={Bell}>
        <SettingRow label="إشعارات البريد الإلكتروني" description="إرسال تنبيهات للمريضات عبر البريد">
          <Toggle enabled={settings.emailNotifications} onChange={() => toggle('emailNotifications')} />
        </SettingRow>
        <SettingRow label="الإشعارات الآنية (Push)" description="إشعارات فورية عبر المتصفح والتطبيق">
          <Toggle enabled={settings.pushNotifications} onChange={() => toggle('pushNotifications')} />
        </SettingRow>
      </SectionCard>

      {/* Content Moderation */}
      <SectionCard title="إدارة المحتوى" icon={Sliders}>
        <SettingRow label="منشورات المجتمع" description="السماح للمستخدمين بمشاركة المحتوى في المجتمع">
          <Toggle enabled={settings.communityPosts} onChange={() => toggle('communityPosts')} />
        </SettingRow>
        <SettingRow label="الاعتدال التلقائي للمحتوى" description="تصفية المحتوى غير المناسب تلقائياً بالذكاء الاصطناعي">
          <Toggle enabled={settings.contentModeration} onChange={() => toggle('contentModeration')} />
        </SettingRow>
        <SettingRow label="الموافقة التلقائية على الوصفات" description="نشر الوصفات المرسلة دون مراجعة يدوية">
          <div className="flex items-center gap-2">
            {settings.autoApproveRecipes && (
              <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                <AlertTriangle size={12} /> غير موصى به
              </span>
            )}
            <Toggle enabled={settings.autoApproveRecipes} onChange={() => toggle('autoApproveRecipes')} />
          </div>
        </SettingRow>
      </SectionCard>

      {/* Data & Privacy */}
      <SectionCard title="البيانات والخصوصية" icon={Database}>
        <SettingRow label="النسخ الاحتياطي التلقائي" description="نسخ البيانات تلقائياً كل 24 ساعة">
          <Toggle enabled={settings.dataBackup} onChange={() => toggle('dataBackup')} />
        </SettingRow>
        <SettingRow label="تتبع التحليلات" description="جمع بيانات الاستخدام لتحسين تجربة المستخدم">
          <Toggle enabled={settings.analyticsTracking} onChange={() => toggle('analyticsTracking')} />
        </SettingRow>
      </SectionCard>

      {/* Security */}
      <SectionCard title="الأمان" icon={Shield}>
        <SettingRow label="المصادقة الثنائية للمشرفين" description="طبقة حماية إضافية عند تسجيل دخول المشرفين">
          <Toggle enabled={settings.twoFactor} onChange={() => toggle('twoFactor')} />
        </SettingRow>
        <div className="py-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-700">تغيير كلمة مرور المشرف</p>
            <p className="text-xs text-slate-400 mt-0.5">تحديث بيانات الدخول للحساب الإداري</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition">
            <Lock size={15} />
            <span>تغيير</span>
          </button>
        </div>
      </SectionCard>

      {/* Danger Zone */}
      <div className="bg-red-50 border border-red-200 rounded-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-red-200">
          <AlertTriangle size={17} className="text-red-500" />
          <h2 className="font-bold text-red-700 text-sm">منطقة الخطر</h2>
        </div>
        <div className="px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-red-700">إعادة تعيين جميع البيانات</p>
            <p className="text-xs text-red-500/80 mt-0.5">سيؤدي هذا إلى حذف كافة البيانات بشكل دائم ولا يمكن التراجع عنه</p>
          </div>
          <button className="px-4 py-2 bg-white border border-red-300 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-500 hover:text-white transition-colors shrink-0">
            إعادة التعيين
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Edit2, Settings, Target, Activity, User, Trash2, Bell } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export default function ProfilePage() {
  const { user, profile, updateProfile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('info');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [weightHistory, setWeightHistory] = useState([]);
  const [goals, setGoals] = useState({ hydration: 0, protein: 0, sleep: 0, activity: 0 });
  const [notifPrefs, setNotifPrefs] = useState({
    meals: true, meds: true, community: false, tips: true,
  });

  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    age: profile?.age || '',
    weight: profile?.weight || '',
    height: profile?.height || '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        age: profile.age || '',
        weight: profile.weight || '',
        height: profile.height || '',
      });
    }
  }, [profile]);

  useEffect(() => {
    if (!user) return;
    // Load weight history from journal entries
    supabase.from('journal_entries').select('entry_date, weight_kg')
      .eq('user_id', user.id).not('weight_kg', 'is', null)
      .order('entry_date').limit(6)
      .then(({ data }) => {
        setWeightHistory((data || []).map(j => ({ month: j.entry_date?.slice(5), weight: j.weight_kg })));
      });
    // Load today's goal progress
    const today = new Date().toISOString().split('T')[0];
    Promise.all([
      supabase.from('hydration_logs').select('amount_ml').eq('user_id', user.id).eq('logged_at', today),
      supabase.from('meal_logs').select('protein').eq('user_id', user.id).eq('logged_at', today),
      supabase.from('journal_entries').select('fatigue').eq('user_id', user.id).eq('entry_date', today).single(),
    ]).then(([hyd, meals, journal]) => {
      setGoals({
        hydration: (hyd.data || []).reduce((s, r) => s + r.amount_ml, 0),
        protein: (meals.data || []).reduce((s, m) => s + (m.protein || 0), 0),
        sleep: 7, // placeholder
        activity: journal.data ? Math.max(0, 10 - journal.data.fatigue) * 3 : 0,
      });
    });
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({
        full_name: formData.full_name,
        phone: formData.phone,
        age: parseInt(formData.age) || null,
        weight: parseFloat(formData.weight) || null,
        height: parseFloat(formData.height) || null,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const tabs = [
    { id: 'info', label: 'المعلومات', icon: User },
    { id: 'health', label: 'الصحة', icon: Activity },
    { id: 'goals', label: 'الأهداف', icon: Target },
    { id: 'settings', label: 'الإعدادات', icon: Settings },
  ];

  const treatmentPhaseLabel = {
    newly_diagnosed: 'تم التشخيص حديثاً',
    chemotherapy: 'العلاج الكيماوي',
    radiation: 'العلاج الإشعاعي',
    recovery: 'مرحلة التعافي',
    hormonal: 'العلاج الهرموني',
  };

  return (
    <div className="pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <Card variant="glass" className="mb-8 p-0 bg-white/60 relative overflow-visible shadow-glass border-white/50">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-primary to-accent rounded-t-[24px]" />
        <div className="relative pt-16 px-8 pb-8 flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-right">
          <div className="relative group z-10">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-white overflow-hidden shadow-2xl flex items-center justify-center bg-primary/10">
              <span className="text-5xl font-display font-bold text-primary">{profile?.full_name?.charAt(0) || '؟'}</span>
            </div>
            <button className="absolute bottom-2 right-2 rtl:left-2 rtl:right-auto w-10 h-10 bg-dark text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary transition-colors">
              <Camera size={18} />
            </button>
          </div>
          <div className="flex-1 pb-2 z-10">
            <h1 className="text-3xl font-display font-bold text-dark flex items-center justify-center md:justify-start gap-3 mb-1">
              {profile?.full_name || 'المستخدمة'}
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-sm font-semibold text-text-muted mt-2">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">
                {treatmentPhaseLabel[profile?.treatment_phase] || 'مرحلة التعافي'}
              </span>
              <span className="px-3 py-1 bg-neutral rounded-full text-text-dark">
                {user?.email}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-white/70 backdrop-blur-md rounded-2xl mb-8 overflow-x-auto no-scrollbar shadow-sm border border-white">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap outline-none ${activeTab === t.id ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-text-muted hover:text-dark hover:bg-white/80'}`}>
            <t.icon size={18} />{t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>

          {/* Info Tab */}
          {activeTab === 'info' && (
            <Card variant="glass" className="p-8 bg-white/70 border-white/50">
              <h2 className="text-2xl font-display font-bold text-dark mb-8">المعلومات الشخصية</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Input label="الاسم الكامل" value={formData.full_name} onChange={e => setFormData(p => ({ ...p, full_name: e.target.value }))} />
                <Input label="البريد الإلكتروني" type="email" value={user?.email} disabled />
                <Input label="رقم الهاتف" type="tel" value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} placeholder="+213 550 12 34 56" />
                <Input label="العمر" type="number" value={formData.age} onChange={e => setFormData(p => ({ ...p, age: e.target.value }))} />
                <Input label="الوزن (كغ)" type="number" value={formData.weight} onChange={e => setFormData(p => ({ ...p, weight: e.target.value }))} />
                <Input label="الطول (سم)" type="number" value={formData.height} onChange={e => setFormData(p => ({ ...p, height: e.target.value }))} />
                <div className="md:col-span-2">
                  <Input label="مرحلة التشخيص" value={treatmentPhaseLabel[profile?.treatment_phase] || ''} disabled />
                  <p className="text-xs text-text-muted mt-2 font-medium">لتحديث هذه المعلومات يرجى التواصل مع فريق الدعم الطبي.</p>
                </div>
              </div>
              <div className="mt-10 flex justify-end gap-4 pb-2">
                {saved && <span className="text-success font-bold flex items-center">✅ تم الحفظ</span>}
                <Button onClick={handleSave} disabled={saving} className="px-8 py-3 text-lg shadow-xl shadow-primary/20">
                  {saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                </Button>
              </div>
            </Card>
          )}

          {/* Health Tab */}
          {activeTab === 'health' && (
            <div className="space-y-6">
              <Card variant="solid" className="p-8 pb-4">
                <h2 className="text-2xl font-display font-bold text-dark mb-8">تاريخ الوزن</h2>
                {weightHistory.length === 0 ? (
                  <div className="text-center text-text-muted py-12 font-medium">سجلي وزنك في اليومية لعرض المسار</div>
                ) : (
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={weightHistory}>
                        <defs>
                          <linearGradient id="colorProfileWeight" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#C084FC" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#C084FC" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                        <Area type="monotone" dataKey="weight" stroke="#C084FC" strokeWidth={4} fillOpacity={1} fill="url(#colorProfileWeight)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </Card>
              <Card variant="glass" className="p-8 bg-white/70">
                <h2 className="text-2xl font-display font-bold text-dark mb-6">الأعراض والتأثيرات الجانبية</h2>
                <p className="text-sm text-text-muted font-medium mb-4">يمكنك تسجيل أعراضك من صفحة اليومية.</p>
              </Card>
            </div>
          )}

          {/* Goals Tab */}
          {activeTab === 'goals' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: 'الترطيب اليومي', current: goals.hydration, target: 2000, unit: 'مل', color: 'bg-blue-500' },
                { title: 'تناول البروتين', current: goals.protein, target: 60, unit: 'غ', color: 'bg-accent' },
                { title: 'جودة النوم', current: goals.sleep, target: 8, unit: 'ساعات', color: 'bg-primary' },
                { title: 'النشاط البدني', current: goals.activity, target: 30, unit: 'دقيقة', color: 'bg-success' },
              ].map((g, i) => (
                <Card key={i} variant="glass" className="p-6 bg-white/70 flex flex-col justify-between h-48 border-white/50">
                  <h3 className="font-bold text-xl text-dark mb-4">{g.title}</h3>
                  <div className="mt-auto">
                    <div className="flex justify-between text-sm font-bold mb-3 text-text-dark">
                      <span>الحالي: <span className="text-xl px-1">{Math.round(g.current)}</span> {g.unit}</span>
                      <span className="text-text-muted">الهدف: {g.target} {g.unit}</span>
                    </div>
                    <div className="w-full bg-neutral rounded-full h-3 mb-2 overflow-hidden shadow-inner">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((g.current / g.target) * 100, 100)}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className={`${g.color} h-3 rounded-full relative`}
                      >
                        <div className="absolute inset-0 bg-white/20" />
                      </motion.div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <Card variant="glass" className="p-8 space-y-10 bg-white/70">
              <div>
                <h3 className="font-bold text-xl mb-6 text-dark flex items-center gap-2"><Bell className="text-primary" /> تفضيلات الإشعارات</h3>
                <div className="space-y-4 max-w-lg bg-neutral/50 p-6 rounded-2xl border border-white">
                  {[
                    { key: 'meals', title: 'تذكير بالوجبات' },
                    { key: 'meds', title: 'تذكير بمواعيد الأدوية' },
                    { key: 'community', title: 'إشعارات المجتمع' },
                    { key: 'tips', title: 'نصائح أسبوعية مخصصة' },
                  ].map(t => (
                    <label key={t.key} className="flex items-center justify-between cursor-pointer group">
                      <span className="font-bold text-text-dark group-hover:text-primary transition-colors">{t.title}</span>
                      <div onClick={() => setNotifPrefs(p => ({ ...p, [t.key]: !p[t.key] }))}
                        className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${notifPrefs[t.key] ? 'bg-primary' : 'bg-gray-300'}`}>
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${notifPrefs[t.key] ? 'translate-x-6' : 'translate-x-0'}`} />
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-xl mb-4 text-dark flex items-center gap-2">تسجيل الخروج</h3>
                <Button variant="ghost" onClick={signOut} className="px-8">تسجيل الخروج</Button>
              </div>
              <div className="pt-8 border-t border-primary/10">
                <h3 className="font-bold text-xl mb-4 text-red-500 flex items-center gap-2"><Trash2 size={20} /> الملاذ الأخير</h3>
                <p className="text-text-dark font-medium mb-6">هذا الإجراء نهائي وسيحذف جميع بياناتك.</p>
                <Button variant="danger" className="font-bold px-8">حذف الحساب نهائياً</Button>
              </div>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

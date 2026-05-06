import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Edit2, Settings, Target, Activity, User, Trash2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

const weightData = [
  { month: 'Jan', weight: 68 }, { month: 'Feb', weight: 67 }, { month: 'Mar', weight: 66 }, 
  { month: 'Apr', weight: 65 }, { month: 'May', weight: 64.5 }, { month: 'Jun', weight: 64 }
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('info');
  const tabs = [
    { id: 'info', label: 'المعلومات', icon: User },
    { id: 'health', label: 'الصحة', icon: Activity },
    { id: 'goals', label: 'الأهداف', icon: Target },
    { id: 'settings', label: 'الإعدادات', icon: Settings },
  ];

  return (
    <div className="pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <Card variant="glass" className="mb-8 p-0 bg-white/60 relative overflow-visible shadow-glass border-white/50">
         <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-primary to-accent rounded-t-[24px]">
           {/* Abstract patterns in background */}
           <div className="w-full h-full opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxwYXRoIGQ9Ik0wIDBoMjB2MjBIMHoiIGZpbGw9Im5vbmUiLz4KPGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMiIgZmlsbD0iI2ZmZiIvPgo8L3N2Zz4=')]"></div>
         </div>
         <div className="relative pt-16 px-8 pb-8 flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-right">
            <div className="relative group z-10">
               <div className="w-32 h-32 rounded-full border-4 border-white bg-white overflow-hidden shadow-2xl">
                  <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&fit=crop" alt="Profile" className="w-full h-full object-cover" />
               </div>
               <button className="absolute bottom-2 right-2 rtl:left-2 rtl:right-auto w-10 h-10 bg-dark text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary transition-colors focus:ring-2 focus:ring-primary outline-none">
                 <Camera size={18} />
               </button>
            </div>
            <div className="flex-1 pb-2 z-10">
               <h1 className="text-3xl font-display font-bold text-dark flex items-center justify-center md:justify-start gap-3 mb-1">
                 سارة أحمد
                 <button className="text-text-muted hover:text-primary transition-colors"><Edit2 size={18} /></button>
               </h1>
               <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-sm font-semibold text-text-muted mt-2">
                 <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">مرحلة التعافي</span>
                 <span className="px-3 py-1 bg-neutral rounded-full text-text-dark">عضو منذ 2026</span>
               </div>
            </div>
         </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-white/70 backdrop-blur-md rounded-2xl mb-8 overflow-x-auto no-scrollbar shadow-sm border border-white">
        {tabs.map(t => (
          <button 
            key={t.id} 
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap outline-none focus:ring-2 focus:ring-primary/30 ${activeTab === t.id ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-text-muted hover:text-dark hover:bg-white/80'}`}
          >
            <t.icon size={18} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div 
           key={activeTab}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -10 }}
           transition={{ duration: 0.3 }}
        >
          {activeTab === 'info' && (
            <Card variant="glass" className="p-8 bg-white/70 border-white/50">
              <h2 className="text-2xl font-display font-bold text-dark mb-8">المعلومات الشخصية</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Input label="الاسم الكامل" defaultValue="سارة أحمد" />
                <Input label="البريد الإلكتروني" type="email" defaultValue="sara@example.com" />
                <Input label="رقم الهاتف الافتراضي" type="tel" defaultValue="+213 550 12 34 56" />
                <Input label="العمر" type="number" defaultValue="34" />
                <div className="md:col-span-2">
                   <Input label="نوع ومرحلة التشخيص" defaultValue="سرطان الثدي الإيجابي للهرمونات - مرحلة التعافي والمتابعة" disabled />
                   <p className="text-xs text-text-muted mt-2 font-medium">لتحديث هذه المعلومات يرجى التواصل مع فريق الدعم الطبي.</p>
                </div>
              </div>
              <div className="mt-10 flex justify-end pb-2">
                <Button className="px-8 py-3 text-lg shadow-xl shadow-primary/20">حفظ التعديلات</Button>
              </div>
            </Card>
          )}

          {activeTab === 'health' && (
            <div className="space-y-6">
              <Card variant="solid" className="p-8 pb-4">
                <h2 className="text-2xl font-display font-bold text-dark mb-8">تسجيل تاريخ الوزن</h2>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weightData}>
                      <defs>
                        <linearGradient id="colorProfileWeight" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#C084FC" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#C084FC" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                      <Area type="monotone" dataKey="weight" stroke="#C084FC" strokeWidth={4} fillOpacity={1} fill="url(#colorProfileWeight)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              <Card variant="glass" className="p-8 bg-white/70">
                <h2 className="text-2xl font-display font-bold text-dark mb-6">الأعراض والتأثيرات الجانبية</h2>
                <p className="text-sm text-text-muted font-medium mb-4">انقري على الأعراض التي تشعرين بها لتوثيقها في سجلك.</p>
                <div className="flex flex-wrap gap-3">
                  {[
                    {name: 'غثيان', active: true}, {name: 'إرهاق شديد', active: true}, 
                    {name: 'تساقط الشعر', active: false}, {name: 'ألم المفاصل', active: true},
                    {name: 'صعوبة النوم', active: false}, {name: 'فقدان الشهية', active: false}
                  ].map(s => (
                    <button key={s.name} className={`px-5 py-2.5 rounded-full font-bold transition-all border outline-none ${s.active ? 'bg-primary text-white border-primary shadow-md shadow-primary/30' : 'bg-white text-text-muted border-neutral hover:border-primary/30 hover:bg-neutral'}`}>
                      {s.name}
                    </button>
                  ))}
                  <button className="px-5 py-2.5 rounded-full font-bold transition-all border border-dashed border-text-muted text-text-muted hover:border-dark hover:text-dark">
                    + إضافة عرض آخر
                  </button>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'goals' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {[
                 { title: 'الترطيب اليومي', current: 1500, target: 2000, unit: 'مل', color: 'bg-blue-500' },
                 { title: 'تناول البروتين', current: 45, target: 60, unit: 'غ', color: 'bg-accent' },
                 { title: 'جودة النوم', current: 6.5, target: 8, unit: 'ساعات', color: 'bg-primary' },
                 { title: 'النشاط البدني', current: 15, target: 30, unit: 'دقيقة', color: 'bg-success' },
               ].map((g, i) => (
                 <Card key={i} variant="glass" className="p-6 bg-white/70 flex flex-col justify-between h-48 border-white/50">
                   <h3 className="font-bold text-xl text-dark mb-4">{g.title}</h3>
                   <div className="mt-auto">
                     <div className="flex justify-between text-sm font-bold mb-3 text-text-dark">
                       <span>الحالي: <span className="text-xl px-1">{g.current}</span> {g.unit}</span>
                       <span className="text-text-muted">الهدف: {g.target} {g.unit}</span>
                     </div>
                     <div className="w-full bg-neutral rounded-full h-3 mb-2 overflow-hidden shadow-inner">
                       <motion.div 
                         initial={{ width: 0 }} 
                         animate={{ width: `${Math.min((g.current/g.target)*100, 100)}%` }} 
                         transition={{ duration: 1, delay: i*0.1 }}
                         className={`${g.color} h-3 rounded-full relative`} 
                       >
                         <div className="absolute inset-0 bg-white/20"></div>
                       </motion.div>
                     </div>
                   </div>
                 </Card>
               ))}
            </div>
          )}

          {activeTab === 'settings' && (
            <Card variant="glass" className="p-8 space-y-10 bg-white/70">
               <div>
                  <h3 className="font-bold text-xl mb-6 text-dark flex items-center gap-2"><Bell className="text-primary"/> تفضيلات الإشعارات</h3>
                  <div className="space-y-4 max-w-lg bg-neutral/50 p-6 rounded-2xl border border-white">
                     {[
                        { title: 'تذكير بالوجبات', status: true },
                        { title: 'تذكير بمواعيد الأدوية', status: true },
                        { title: 'إشعارات المجتمع والتفاعلات', status: false },
                        { title: 'نصائح أسبوعية مخصصة', status: true }
                     ].map((t, i) => (
                       <label key={i} className="flex items-center justify-between cursor-pointer group">
                          <span className="font-bold text-text-dark group-hover:text-primary transition-colors">{t.title}</span>
                          <div className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${t.status ? 'bg-primary' : 'bg-gray-300'}`}>
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${t.status ? 'translate-x-6' : 'translate-x-0'}`}></div>
                          </div>
                       </label>
                     ))}
                  </div>
               </div>
               
               <div className="pt-8 border-t border-primary/10">
                  <h3 className="font-bold text-xl mb-4 text-red-500 flex items-center gap-2"><Trash2 size={20} /> الملاذ الأخير</h3>
                  <p className="text-text-dark font-medium mb-6">احذري، هذا الإجراء نهائي وسيؤدي إلى حذف جميع بياناتك وسجلاتك الموثقة نهائياً.</p>
                  <Button variant="danger" className="font-bold px-8">حذف الحساب نهائياً</Button>
               </div>
            </Card>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}

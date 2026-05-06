import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Bell, Heart, Apple, Droplet, Users, Settings, Trash2, CheckCircle2 } from 'lucide-react';

export default function NotificationsPage() {
  const { t } = useTranslation();
  
  const notifications = [
    { id: 1, type: 'reminder', icon: Droplet, color: 'text-blue-500', title: 'حان وقت الرشفة!', time: 'منذ 10 دقائق', desc: 'تذكري شرب كوب من الماء لتبقي ضمن هدفك اليومي.', isNew: true },
    { id: 2, type: 'nutrition', icon: Apple, color: 'text-primary', title: 'وجبة الغداء', time: 'منذ ساعتين', desc: 'لا تفوتي وجبتك المخصصة: سلطة كينوا مع خضار مشوية.', isNew: true },
    { id: 3, type: 'community', icon: Users, color: 'text-accent', title: 'دعم من المجتمع', time: 'أمس', desc: 'قامت آمال ومريم بالرد على مشاركتك في منتدى الطبخ.', isNew: false },
    { id: 4, type: 'system', icon: Heart, color: 'text-success', title: 'أسبوع رائع', time: 'منذ يومين', desc: 'تهانينا! لقد حققت أهدافك الغذائية لثلاثة أيام متتالية، أنت بطلة.', isNew: false }
  ];

  return (
    <div className="pb-12 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-dark mb-2 flex items-center gap-2">
            <Bell className="text-primary mt-1" /> مركز الإشعارات
          </h1>
          <p className="text-text-muted font-medium">تابعي كل التحديثات والتذكيرات المهمة لحالتك الخاصة.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button variant="ghost" className="text-sm px-4 py-2 border-primary/20 bg-white/50 w-full md:w-auto">
             <CheckCircle2 size={16} className="rtl:ml-2 ltr:mr-2 inline" /> تحديد الكل كمقروء
          </Button>
          <button className="p-2.5 rounded-full bg-white text-red-500 hover:bg-red-50 transition-colors shadow-sm outline-none focus:ring-2 focus:ring-red-200">
             <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
         {['الكل', 'غير المقروءة', 'التذكيرات', 'المجتمع', 'النظام'].map((tag, i) => (
           <button key={i} className={`px-5 py-2 rounded-full font-bold whitespace-nowrap transition-colors outline-none ${i===0 ? 'bg-dark text-white shadow-md' : 'bg-white/60 text-text-muted hover:bg-white/90 hover:text-dark border border-white'}`}>
             {tag}
           </button>
         ))}
      </div>

      <div className="space-y-4">
         <AnimatePresence>
            {notifications.map((n, i) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
              >
                <Card variant="glass" className={`p-5 flex items-start gap-4 transition-all duration-300 border-l-4 rtl:border-l-0 rtl:border-r-4 ${n.isNew ? 'bg-white/80 border-primary shadow-md' : 'bg-white/40 border-transparent opacity-80 hover:opacity-100'}`}>
                   <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-inner ${n.isNew ? 'bg-neutral' : 'bg-white'} ${n.color}`}>
                     <n.icon size={24} />
                   </div>
                   <div className="flex-1">
                     <div className="flex justify-between items-start mb-1">
                        <h4 className={`font-bold text-lg ${n.isNew ? 'text-dark' : 'text-text-dark'}`}>{n.title}</h4>
                        <span className="text-xs font-semibold text-text-muted bg-white/50 px-2 py-1 rounded-md">{n.time}</span>
                     </div>
                     <p className="text-text-muted max-w-2xl text-sm leading-relaxed font-medium">{n.desc}</p>
                   </div>
                   {n.isNew && (
                     <div className="w-3 h-3 rounded-full bg-primary mt-4 mr-2 shadow-sm shrink-0"></div>
                   )}
                </Card>
              </motion.div>
            ))}
         </AnimatePresence>
      </div>
    </div>
  );
}

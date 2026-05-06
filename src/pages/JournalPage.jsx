import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoonStar, Calendar, Save, CheckCircle2, AlertCircle, Server } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function JournalPage() {
  const [mood, setMood] = useState(null);
  const [fatigue, setFatigue] = useState(5);
  const [symptoms, setSymptoms] = useState(['غثيان']);
  const [isSaved, setIsSaved] = useState(false);
  
  const availableSymptoms = [
    'غثيان', 'إرهاق شديد', 'تساقط الشعر', 'ألم المفاصل', 'صداع', 'صعوبة النوم', 'تغير في الشهية', 'تنميل الأطراف', 'تقلب المزاج'
  ];

  const history = [
    { id: 1, date: '11 أكتوبر 2026', mood: '😊', preview: 'يوم جيد جداً، شعرت بطاقة أفضل وتمكنت من المشي لنصف ساعة...', symp: ['تغير في الشهية'] },
    { id: 2, date: '10 أكتوبر 2026', mood: '😐', preview: 'يوم عادي، بعض التعب بعد جلسة العلاج أمس لكن معنوياتي مستقرة.', symp: ['إرهاق شديد', 'غثيان'] },
    { id: 3, date: '9 أكتوبر 2026', mood: '😔', preview: 'صداع قوي اليوم وغثيان مستمر، قضيت أغلب اليوم في الفراش.', symp: ['صداع', 'غثيان'] },
  ];

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };
 
  const toggleSymptom = (s) => {
    if (symptoms.includes(s)) setSymptoms(symptoms.filter(x => x !== s));
    else setSymptoms([...symptoms, s]);
  };

  const currentBg = 'from-secondary to-neutral';

  return (
    <div className="pb-12 max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 items-start pt-6">
      
      {/* Left Column (Main Form) */}
      <motion.div className="flex-1 w-full space-y-6" animate={{ transition: { duration: 0.5 } }}>
         <Card variant="glass" className={`p-8 bg-gradient-to-br ${currentBg} transition-colors duration-500 border-white/50 shadow-glass`}>
            {/* Header */}
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/20">
               <div>
                  <h1 className="text-3xl font-display font-bold text-dark flex items-center gap-3">
                    يومياتك
                  </h1>
                  <p className="text-text-muted mt-2 font-bold flex items-center gap-2"><Calendar size={18}/> 12 أكتوبر 2026</p>
               </div>
               <div className="w-14 h-14 bg-white/40 rounded-full flex items-center justify-center text-primary shadow-sm backdrop-blur-sm border border-white">
                 <MoonStar size={28} />
               </div>
            </div>

            {/* Mood Picker */}
            <div className="mb-10 p-6 bg-white/80 rounded-xl shadow-sm border border-dark/5">
               <h3 className="font-bold text-sm text-text-muted uppercase tracking-widest mb-8 text-center">كيف هو شعورك اليوم؟</h3>
               <div className="flex justify-between items-center max-w-sm mx-auto">
                 {['😔', '😕', '😐', '🙂', '😊'].map((e, i) => (
                   <button 
                     key={i} 
                     onClick={() => setMood(i)}
                     className={`text-4xl transition-all duration-300 outline-none focus:ring-2 focus:ring-primary/20 rounded-lg ${mood === i ? 'scale-110 -translate-y-2' : 'grayscale opacity-30 hover:grayscale-0 hover:opacity-100 hover:scale-110'}`}
                   >
                     {e}
                   </button>
                 ))}
               </div>
               {mood === null && <p className="text-center text-[10px] text-primary/70 font-bold mt-4 uppercase tracking-widest">رجاءً اختاري شعورك للبدء</p>}
            </div>

            {/* Fatigue Slider */}
            <div className="mb-10">
               <div className="flex justify-between text-lg font-bold text-dark mb-4">
                 <span>مستوى التعب الجسدي</span>
                 <span className="bg-white/60 px-3 rounded-full">{fatigue} / 10</span>
               </div>
               <input 
                 type="range" 
                 min="1" max="10" 
                 value={fatigue} 
                 onChange={(e) => setFatigue(parseInt(e.target.value))}
                 className="w-full h-3 bg-white/50 rounded-full appearance-none outline-none focus:ring-2 focus:ring-primary/50 accent-primary shadow-inner"
               />
               <div className="flex justify-between text-sm text-text-muted font-bold mt-2">
                 <span>طاقة عالية</span>
                 <span>منهكة جداً</span>
               </div>
            </div>

            {/* Symptoms Tag Cloud */}
            <div className="mb-10">
               <h3 className="font-bold text-lg text-dark mb-4 flex items-center gap-2"><AlertCircle size={20} className="text-warning"/> الأعراض الجانبية الملحوظة</h3>
               <div className="flex flex-wrap gap-2">
                 {availableSymptoms.map(s => (
                   <button 
                     key={s}
                     onClick={() => toggleSymptom(s)}
                     className={`px-4 py-2 rounded-full font-bold transition-all text-sm outline-none focus:ring-2 focus:ring-primary/30 border ${symptoms.includes(s) ? 'bg-primary text-white border-primary shadow-md' : 'bg-white/50 text-text-muted border-transparent hover:bg-white/80 hover:text-dark hover:border-white'}`}
                   >
                     {s}
                   </button>
                 ))}
               </div>
            </div>

            {/* Free Text */}
            <div className="mb-8">
               <h3 className="font-bold text-lg text-dark mb-4">ملاحظات إضافية (فضفضي بحرية)</h3>
               <textarea 
                 rows="4" 
                 placeholder="اكتبي ما تشعرين به، أو أي أفكار تراودك... هذه المساحة آمنة وخاصة بكِ."
                 className="w-full bg-white/60 border border-white/80 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none shadow-inner text-dark placeholder:text-text-muted/60 font-medium"
               ></textarea>
               <div className="text-left mt-2 text-xs text-text-muted font-bold">0 / 500</div>
            </div>

            {/* Save Action */}
            <div className="flex justify-end pt-4 border-t border-white/20">
               <Button onClick={handleSave} className="w-full md:w-64 py-4 text-lg shadow-xl" disabled={mood === null}>
                 <AnimatePresence mode="wait">
                   {isSaved ? (
                     <motion.div key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-2">
                       <CheckCircle2 /> تم الحفظ بنجاح
                     </motion.div>
                   ) : (
                     <motion.div key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-2">
                       <Save size={20} /> حفظ اليومية
                     </motion.div>
                   )}
                 </AnimatePresence>
               </Button>
            </div>
         </Card>
      </motion.div>

      {/* Right Column (History Timeline) */}
      <div className="w-full lg:w-96 space-y-6">
         <Card variant="solid" className="p-6 bg-white/80 sticky top-28 border-white border">
            <h3 className="font-bold text-xl text-dark mb-8">سجل الأيام السابقة</h3>
            
            <div className="relative border-r-2 rtl:border-r-2 rtl:border-l-0 ltr:border-l-2 ltr:border-r-0 border-primary/20 rtl:pr-6 ltr:pl-6 space-y-8">
               {history.map((h, i) => (
                 <div key={h.id} className="relative cursor-pointer group">
                    <div className="absolute top-0 rtl:-right-[33px] ltr:-left-[33px] w-4 h-4 rounded-full bg-white border-2 border-primary group-hover:scale-125 transition-transform" />
                    <div className="bg-neutral/40 p-4 rounded-2xl border border-white group-hover:bg-primary/5 transition-colors group-hover:border-primary/20 shadow-sm">
                       <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-bold text-primary">{h.date}</span>
                          <span className="text-2xl">{h.mood}</span>
                       </div>
                       <p className="text-sm text-text-muted font-medium mb-3 line-clamp-2 leading-relaxed">{h.preview}</p>
                       <div className="flex gap-1 flex-wrap">
                          {h.symp.map(s => (
                            <span key={s} className="text-[10px] bg-white px-2 py-1 rounded-md text-text-muted font-bold border border-neutral shadow-sm">{s}</span>
                          ))}
                       </div>
                    </div>
                 </div>
               ))}
            </div>
            
            <Button variant="ghost" className="w-full mt-8 bg-neutral text-sm font-bold">عرض السجل كاملاً</Button>
         </Card>
      </div>

    </div>
  );
}

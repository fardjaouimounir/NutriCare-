import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Clock, Signal, Search, X } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';

const recipes = [
  { id: 1, title: 'حساء حريرة صحي', time: '40 دقيقة', diff: 'سهل', p: 15, c: 30, f: 5, tags: ['حساء', 'نباتي'], img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=400&fit=crop', liked: true },
  { id: 2, title: 'طاجين الخوخ بالدجاج', time: '60 دقيقة', diff: 'متوسط', p: 35, c: 20, f: 12, tags: ['طاجين', 'غني بالبروتين'], img: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=400&fit=crop', liked: false },
  { id: 3, title: 'سلطة مشوية بالباذنجان', time: '30 دقيقة', diff: 'سهل', p: 5, c: 15, f: 8, tags: ['سلطات', 'نباتي'], img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400&fit=crop', liked: false },
  { id: 4, title: 'عصير الشمندر والرمان', time: '10 دقائق', diff: 'سهل', p: 2, c: 25, f: 0, tags: ['عصائر', 'أقل من 30 دقيقة'], img: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?q=80&w=400&fit=crop', liked: true },
  { id: 5, title: 'طاجين زيتون صحي', time: '45 دقيقة', diff: 'متوسط', p: 25, c: 10, f: 15, tags: ['طاجين'], img: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?q=80&w=400&fit=crop', liked: false },
];

const categories = ['الكل', 'حساء', 'طاجين', 'سلطات', 'عصائر', 'أقل من 30 دقيقة', 'غني بالبروتين'];

export default function RecipesPage() {
  const [activeCat, setActiveCat] = useState('الكل');
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const filtered = activeCat === 'الكل' ? recipes : recipes.filter(r => r.tags.includes(activeCat) || (activeCat === 'أقل من 30 دقيقة' && parseInt(r.time) <= 30));

  return (
    <div className="pb-12 max-w-7xl mx-auto pt-4 relative">
      
      <div className="relative w-full h-[300px] mb-12 rounded-xl overflow-hidden flex items-center justify-center shadow-sm">
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=2000&fit=crop')] bg-cover bg-center grayscale opacity-80" />
         <div className="absolute inset-0 bg-dark/70" />
         <div className="relative z-10 text-center px-4 w-full flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-8 leading-tight italic">وصفات غنية بمذاق الأصالة</h1>
            <div className="w-full max-w-xl mx-auto opacity-95">
              <Input icon={Search} placeholder="ابحثي عن وصفة، مكون، أو تصنيف..." className="border-none h-12 text-base" />
            </div>
         </div>
      </div>

      <div className="flex gap-2 mb-12 overflow-x-auto no-scrollbar pb-2 px-2">
         {categories.map(c => (
           <button 
             key={c} 
             onClick={() => setActiveCat(c)}
             className={`px-6 py-2.5 rounded-lg font-bold whitespace-nowrap transition-all text-xs uppercase tracking-widest outline-none focus:ring-2 focus:ring-primary ${activeCat === c ? 'bg-primary text-white shadow-lg shadow-primary/10' : 'bg-white text-text-muted hover:text-dark hover:bg-secondary border border-dark/5'}`}
           >
             {c}
           </button>
         ))}
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8 px-2">
         <AnimatePresence>
           {filtered.map(r => (
             <motion.div 
               layout 
               initial={{ opacity: 0, y: 10 }} 
               animate={{ opacity: 1, y: 0 }} 
               exit={{ opacity: 0, y: 10 }} 
               key={r.id} 
               className="break-inside-avoid"
             >
               <Card variant="solid" className="overflow-hidden group cursor-pointer border border-dark/5 shadow-sm hover:shadow-xl transition-all duration-500 rounded-xl" onClick={() => setSelectedRecipe(r)}>
                  <div className="relative h-56 overflow-hidden">
                     <img src={r.img} alt={r.title} className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                     <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent" />
                     <div className="absolute top-3 right-3 rtl:left-3 rtl:right-auto flex gap-1.5 flex-wrap max-w-[80%]">
                        {r.tags.map(t => (
                          <span key={t} className="px-2 py-1 bg-white/20 backdrop-blur-md rounded-lg text-white text-[10px] font-bold uppercase tracking-widest">{t}</span>
                        ))}
                     </div>
                     <button className="absolute top-3 left-3 rtl:right-3 rtl:left-auto p-1.5 rounded-lg bg-white/20 backdrop-blur-md text-white hover:text-primary hover:bg-white transition-all outline-none h-8 w-8 flex items-center justify-center shrink-0">
                        <Heart size={16} fill={r.liked ? 'currentColor' : 'none'} className={r.liked ? 'text-primary' : ''} />
                     </button>
                  </div>
                  <div className="p-6 bg-white">
                     <h3 className="font-display font-bold text-xl text-dark mb-4 group-hover:text-primary transition-colors">{r.title}</h3>
                     <div className="flex justify-between items-center text-[10px] font-bold text-text-muted uppercase tracking-widest mb-6 border-b border-dark/5 pb-4">
                       <span className="flex items-center gap-1.5"><Clock size={14} className="text-primary/70" /> {r.time}</span>
                       <span className="flex items-center gap-1.5"><Signal size={14} className="text-primary/70" /> {r.diff}</span>
                     </div>
                     <div className="flex gap-1.5">
                       <span className="flex-1 text-center py-2 bg-secondary text-dark/70 rounded-lg text-[10px] font-bold">{r.p}غ بروتين</span>
                       <span className="flex-1 text-center py-2 bg-secondary text-dark/70 rounded-lg text-[10px] font-bold">{r.c}غ كارب</span>
                     </div>
                  </div>
               </Card>
             </motion.div>
           ))}
         </AnimatePresence>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedRecipe && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-dark/70 backdrop-blur-md">
             <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} className="w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl relative border border-dark/5 no-scrollbar">
                <button onClick={() => setSelectedRecipe(null)} className="absolute top-6 left-6 rtl:right-6 rtl:left-auto bg-dark/20 backdrop-blur-md text-white p-2 rounded-lg z-20 hover:bg-primary transition-colors outline-none h-10 w-10 flex items-center justify-center">
                  <X size={20} />
                </button>
                <div className="h-80 relative">
                   <img src={selectedRecipe.img} alt={selectedRecipe.title} className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent" />
                   <div className="absolute bottom-6 px-8 text-white w-full">
                     <div className="flex gap-1.5 mb-3">
                        {selectedRecipe.tags.map((t, i) => <span key={i} className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-[10px] font-bold uppercase tracking-widest">{t}</span>)}
                     </div>
                     <h2 className="text-3xl md:text-4xl font-display font-bold mb-3 italic">{selectedRecipe.title}</h2>
                     <div className="flex gap-4 text-xs font-bold opacity-80">
                       <span className="flex items-center gap-1.5"><Clock size={16} /> {selectedRecipe.time}</span>
                       <span className="flex items-center gap-1.5"><Signal size={16} /> {selectedRecipe.diff}</span>
                     </div>
                   </div>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-10 bg-white">
                   <div className="md:col-span-1 space-y-6">
                      <div className="border-b border-dark/5 pb-6">
                        <h3 className="text-xl font-bold mb-6 font-display text-dark italic">المقادير</h3>
                        <ul className="space-y-3">
                          {['2 صدر دجاج مسحب', '100غ كينوا', 'طماطم كرزية', 'معلقة صغيرة زيت زيتون', 'رشة ملح وفلفل أسود', 'بقدونس للتزيين'].map((ing, i) => (
                            <li key={i} className="flex items-center gap-3 text-xs font-bold text-text-muted">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary/30 flex-shrink-0" /> {ing}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-secondary/50 p-6 rounded-lg border border-dark/5">
                         <h4 className="text-xs uppercase tracking-widest font-bold text-primary mb-2">رأي أخصائية التغذية</h4>
                         <p className="text-xs text-text-muted font-medium leading-relaxed">هذه الوصفة ممتازة لتعزيز البروتين قليل الدسم في فترة التعافي. الكينوا مفيدة لتعويض المعادن المفقودة.</p>
                      </div>
                   </div>
                   <div className="md:col-span-2">
                      <h3 className="text-xl font-bold mb-6 font-display text-dark italic">خطوات التحضير</h3>
                      <div className="space-y-4">
                        {[
                          'اغسلي الكينوا جيداً واسلقيها في ماء مملح على نار هادئة لمدة 15 دقيقة أو حتى تمتص الماء بالكامل وتصبح طرية.',
                          'في هذه الأثناء، تبلي صدور الدجاج بالملح، الفلفل الأسود والقليل من بهارات الدجاج، ثم اشويها في مقلاة غير لاصقة مع مسحة زيت زيتون.',
                          'قطعي الطماطم الكرزية إلى أنصاف، وافرمي البقدونس فرماً ناعماً.',
                          'في وعاء كبير، امزجي الكينوا المطبوخة مع الطماطم، ثم أضيفي قطع الدجاج الدائفة فوقها.',
                          'قدمي الطبق مع عصرة خفيفة من الليمون الطازج.'
                        ].map((step, i) => (
                          <div key={i} className="flex gap-5 bg-white p-5 rounded-lg border border-dark/5 shadow-sm hover:border-primary/20 transition-all duration-300">
                             <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">{i+1}</div>
                             <p className="font-bold text-dark leading-relaxed text-sm pt-0.5">{step}</p>
                          </div>
                        ))}
                      </div>
                   </div>
                </div>
             </motion.div>
           </div>
        )}
      </AnimatePresence>
    </div>
  );
}

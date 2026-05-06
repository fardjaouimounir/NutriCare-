import React from 'react';
import { motion } from 'framer-motion';
import { Search, CheckCircle, BookOpen, Clock } from 'lucide-react';
import { Card } from '../components/ui/Card';

const articles = [
  { id: 1, title: 'التغذية السليمة أثناء العلاج الكيماوي', author: 'د. ليلى خليل', category: 'التغذية', excerpt: 'يعد الحفاظ على وزن صحي وتناول العناصر الغذائية الصحيحة أمراً بالغ الأهمية...', time: '5 دقائق', img: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?q=80&w=400&fit=crop' },
  { id: 2, title: 'كيفية التعامل مع التعب والإرهاق', author: 'د. سمير أحمد', category: 'الأعراض الجانبية', excerpt: 'الإرهاق المرتبط بالسرطان هو العرض الجانبي الأكثر شيوعاً، إليك طرق فعالة...', time: '8 دقائق', img: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=400&fit=crop' },
  { id: 3, title: 'تمارين رياضية خفيفة لمرحلة التعافي', author: 'ك. فاطمة بن علي', category: 'النشاط البدني', excerpt: 'تساعد الحركة الخفيفة في تقليل التوتر وتحسين الدورة الدموية، اكتشفي أهم التمارين.', time: '4 دقائق', img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=400&fit=crop' },
];

export default function AdvicePage() {
  const cats = ['الكل', 'التغذية', 'الأعراض الجانبية', 'الوصفات', 'النشاط البدني', 'الصحة النفسية'];

  return (
    <div className="pb-12 max-w-7xl mx-auto pt-4 relative">
      
      {/* Hero Search */}
      <Card variant="glass" className="mb-12 p-8 md:p-16 bg-white/70 overflow-hidden relative shadow-lg">
         <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-50 pointer-events-none" />
         <div className="relative z-10 text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-dark mb-6 leading-tight">معلومات مبنية على أسس طبية <br/> موثوقة</h1>
            <p className="text-lg text-text-muted mb-10 font-medium">نصائح وإرشادات من نخبة من الأطباء وأخصائيي التغذية لمرافقتك في رحلتك.</p>
            <div className="relative">
               <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-primary" size={24} />
               <input type="text" placeholder="ابحثي عن موضوع طبي، عرض جانبي، أو نصيحة..." className="w-full bg-white border border-white shadow-xl py-5 pr-16 pl-6 rounded-full focus:outline-none focus:ring-4 focus:ring-primary/20 text-dark font-bold text-lg transition-all" />
            </div>
         </div>
      </Card>

      {/* Category Pills */}
      <div className="flex gap-3 mb-12 overflow-x-auto no-scrollbar pb-2 px-2">
         {cats.map((c, i) => (
           <button key={c} className={`px-6 py-3 rounded-full font-bold whitespace-nowrap transition-all outline-none focus:ring-2 focus:ring-primary ${i === 0 ? 'bg-dark text-white' : 'bg-white hover:bg-neutral text-text-muted hover:text-dark shadow-sm border border-neutral'}`}>
             {c}
           </button>
         ))}
      </div>

      {/* Article Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-2">
         {articles.map((art, i) => (
           <motion.div key={art.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="h-full">
             <Card variant="solid" className="overflow-hidden group h-full flex flex-col cursor-pointer hover:shadow-2xl hover:shadow-primary/10 transition-shadow border-none shadow-sm">
                <div className="relative h-56 overflow-hidden">
                   <img src={art.img} alt={art.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                   <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md text-xs font-bold text-primary shadow-sm">{art.category}</div>
                </div>
                <div className="p-6 flex flex-col flex-1 bg-white">
                   <h3 className="font-display font-bold text-2xl text-dark mb-4 leading-snug group-hover:text-primary transition-colors">{art.title}</h3>
                   <p className="text-text-muted font-medium leading-relaxed mb-6 flex-1 line-clamp-3">{art.excerpt}</p>
                   <div className="pt-4 border-t border-neutral flex justify-between items-center mt-auto">
                      <div className="flex items-center gap-2">
                         <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent text-sm font-bold shadow-inner">D</div>
                         <div>
                            <div className="text-sm font-bold text-dark flex items-center gap-1">{art.author} <CheckCircle size={14} className="text-success" /></div>
                            <div className="text-[10px] bg-success/10 text-success px-1.5 rounded font-bold inline-block">موثق طبياً</div>
                         </div>
                      </div>
                      <div className="flex items-center gap-1 text-sm font-bold text-text-muted bg-neutral px-3 py-1.5 rounded-lg border border-white">
                         <Clock size={16} className="text-primary"/> {art.time}
                      </div>
                   </div>
                </div>
             </Card>
           </motion.div>
         ))}
      </div>
    </div>
  );
}

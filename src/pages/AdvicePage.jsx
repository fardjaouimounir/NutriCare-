import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, CheckCircle, Clock } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { supabase } from '../lib/supabase';

const CATEGORIES = ['الكل', 'التغذية', 'الأعراض الجانبية', 'الوصفات', 'النشاط البدني', 'الصحة النفسية'];

export default function AdvicePage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState('الكل');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      let query = supabase.from('articles').select('*').eq('is_published', true).order('created_at', { ascending: false });
      if (activeCat !== 'الكل') query = query.eq('category', activeCat);
      if (search) query = query.ilike('title', `%${search}%`);
      const { data } = await query;
      setArticles(data || []);
      setLoading(false);
    };
    fetch();
  }, [activeCat, search]);

  return (
    <div className="pb-12 max-w-7xl mx-auto pt-4 relative">
      {/* Hero Search */}
      <Card variant="glass" className="mb-12 p-8 md:p-16 bg-white/70 overflow-hidden relative shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-50 pointer-events-none" />
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-dark mb-6 leading-tight">معلومات مبنية على أسس طبية <br /> موثوقة</h1>
          <p className="text-lg text-text-muted mb-10 font-medium">نصائح وإرشادات من نخبة من الأطباء وأخصائيي التغذية.</p>
          <div className="relative">
            <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-primary" size={24} />
            <input type="text" placeholder="ابحثي عن موضوع طبي..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-white border border-white shadow-xl py-5 pr-16 pl-6 rounded-full focus:outline-none focus:ring-4 focus:ring-primary/20 text-dark font-bold text-lg" />
          </div>
        </div>
      </Card>

      {/* Categories */}
      <div className="flex gap-3 mb-12 overflow-x-auto no-scrollbar pb-2 px-2">
        {CATEGORIES.map((c, i) => (
          <button key={c} onClick={() => setActiveCat(c)}
            className={`px-6 py-3 rounded-full font-bold whitespace-nowrap transition-all outline-none focus:ring-2 focus:ring-primary
              ${activeCat === c ? 'bg-dark text-white' : 'bg-white hover:bg-neutral text-text-muted hover:text-dark shadow-sm border border-neutral'}`}>
            {c}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>
      ) : articles.length === 0 ? (
        <div className="text-center py-20 text-text-muted font-medium">لا توجد مقالات في هذا التصنيف</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-2">
          {articles.map((art, i) => (
            <motion.div key={art.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="h-full">
              <Card variant="solid" className="overflow-hidden group h-full flex flex-col cursor-pointer hover:shadow-2xl hover:shadow-primary/10 transition-shadow border-none shadow-sm">
                <div className="relative h-56 overflow-hidden">
                  <img src={art.image_url || 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?q=80&w=400&fit=crop'} alt={art.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md text-xs font-bold text-primary shadow-sm">{art.category}</div>
                </div>
                <div className="p-6 flex flex-col flex-1 bg-white">
                  <h3 className="font-display font-bold text-2xl text-dark mb-4 leading-snug group-hover:text-primary transition-colors">{art.title}</h3>
                  <p className="text-text-muted font-medium leading-relaxed mb-6 flex-1 line-clamp-3">{art.excerpt}</p>
                  <div className="pt-4 border-t border-neutral flex justify-between items-center mt-auto">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent text-sm font-bold shadow-inner">
                        {art.author_name?.charAt(0) || 'د'}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-dark flex items-center gap-1">
                          {art.author_name} <CheckCircle size={14} className="text-success" />
                        </div>
                        <div className="text-[10px] bg-success/10 text-success px-1.5 rounded font-bold inline-block">موثق طبياً</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-bold text-text-muted bg-neutral px-3 py-1.5 rounded-lg border border-white">
                      <Clock size={16} className="text-primary" /> {art.read_time}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

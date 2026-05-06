import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, MessageCircle, Share2, Plus, X, Users, Award, TrendingUp, Filter } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function CommunityPage() {
   const [showCompose, setShowCompose] = useState(false);
   const categories = ['الكل', 'قصص نجاح', 'أسئلة عامة', 'تغذية', 'دعم نفسي', 'تجارب علاجية'];
   const [activeCat, setActiveCat] = useState('الكل');

   const posts = [
      { id: 1, user: 'أمل جزائري', time: 'منذ ساعتين', body: 'أنهيت آخر جلسة علاج كيماوي اليوم! الممرضات كن رائعات وشعوري لا يوصف. لمن لا زالت في بداية الطريق: ابقي قوية، ستعبرين هذا أيضاً.', likes: 45, comments: 12, cat: 'قصص نجاح' },
      { id: 2, user: 'مريم (مجهول)', time: 'منذ 5 ساعات', body: 'كيف تتعاملن مع فقدان الشهية في الأيام الأولى بعد الجرعة؟ أجد صعوبة كبيرة في تناول الطعام.', likes: 12, comments: 8, cat: 'أسئلة عامة' },
      { id: 3, user: 'سارة', time: 'أمس', body: 'طاجين الخضار الذي وجدته في قسم الوصفات هنا كان رائعاً وسهل الهضم جداً. أنصح به الجميع!', likes: 30, comments: 4, cat: 'تغذية' },
   ];

   return (
      <div className="pb-12 max-w-7xl mx-auto pt-6 flex flex-col lg:flex-row gap-8">
         {/* Left Panel Sidebar */}
         <div className="w-full lg:w-72 flex-shrink-0 space-y-6">
            <Card variant="glass" className="p-6 bg-white/70 shadow-sm border-white">
               <h3 className="font-display font-bold text-2xl text-dark mb-6 flex items-center gap-2"><Filter size={24} className="text-primary" /> التصنيفات</h3>
               <div className="space-y-3">
                  {categories.map(c => (
                     <button
                        key={c}
                        onClick={() => setActiveCat(c)}
                        className={`w-full text-right px-5 py-3.5 rounded-2xl font-bold transition-all outline-none ${activeCat === c ? 'bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]' : 'bg-white/50 text-text-muted hover:bg-white hover:text-dark border border-neutral'}`}
                     >
                        {c}
                     </button>
                  ))}
               </div>
            </Card>
            <Card variant="glass" className="p-6 bg-primary/5 border-primary/20 shadow-sm">
               <h3 className="font-bold text-primary mb-4 text-lg">قوانين مجتمعنا الآمن</h3>
               <ul className="text-sm font-semibold text-text-dark space-y-3">
                  <li className="flex gap-2 items-start"><span className="text-primary">•</span> الاحترام المتبادل والدعم الإيجابي.</li>
                  <li className="flex gap-2 items-start"><span className="text-primary">•</span> لا لمشاركة نصائح طبية غير موثقة (استشيري طبيبك دائماً).</li>
                  <li className="flex gap-2 items-start"><span className="text-primary">•</span> الحفاظ على سرية المشاركات.</li>
               </ul>
            </Card>
         </div>

         {/* Main Feed */}
         <div className="flex-1 space-y-6 relative h-[calc(100vh-120px)] overflow-y-auto no-scrollbar scroll-smooth pr-1 md:pr-0 pb-20">
            <div className="sticky top-0 z-30 bg-neutral/80 backdrop-blur-md pt-2 pb-4">
               <div className="flex justify-between items-center bg-white/90 p-4 rounded-3xl shadow-sm border border-white">
                  <div className="relative flex-1 max-w-xl mx-auto">
                     <Search className="absolute right-4 rtl:left-4 rtl:right-auto top-1/2 -translate-y-1/2 text-primary" size={24} />
                     <input type="text" placeholder="ابحثي في المناقشات والتجارب..." className="w-full bg-neutral border-none py-3.5 pr-14 pl-4 rtl:pl-14 rtl:pr-4 rounded-2xl focus:shadow-inner outline-none text-dark font-bold text-lg transition-all" />
                  </div>
               </div>
            </div>

            <AnimatePresence>
               {posts.filter(p => activeCat === 'الكل' || p.cat === activeCat).map((post, i) => (
                  <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                     <Card variant="glass" className="p-8 bg-white/80 shadow-sm hover:shadow-lg transition-all duration-300 border-white">
                        <div className="flex items-center justify-between mb-6">
                           <div className="flex items-center gap-4">
                              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center font-bold text-2xl shadow-inner border-2 border-white">
                                 {post.user.charAt(0)}
                              </div>
                              <div>
                                 <h4 className="font-bold text-dark text-xl">{post.user}</h4>
                                 <div className="text-sm font-semibold text-text-muted mt-0.5">{post.time}</div>
                              </div>
                           </div>
                           <div className="px-3 py-1 bg-neutral rounded-lg text-xs font-bold text-text-dark border border-white/50">{post.cat}</div>
                        </div>
                        <p className="text-dark font-medium leading-relaxed mb-8 text-xl text-justify">{post.body}</p>
                        <div className="flex gap-8 border-t border-neutral pt-5">
                           <button className="flex items-center gap-2 text-text-muted hover:text-primary font-bold transition-colors group">
                              <Heart size={22} className="group-hover:fill-primary" /> {post.likes} <span className="hidden sm:inline">إعجاب</span>
                           </button>
                           <button className="flex items-center gap-2 text-text-muted hover:text-accent font-bold transition-colors">
                              <MessageCircle size={22} /> {post.comments} <span className="hidden sm:inline">ردود</span>
                           </button>
                           <button className="flex items-center gap-2 text-text-muted hover:text-blue-500 font-bold transition-colors mt-0 mr-auto rtl:ml-auto rtl:mr-0">
                              <Share2 size={22} />
                           </button>
                        </div>
                     </Card>
                  </motion.div>
               ))}
            </AnimatePresence>
         </div>

         {/* Floating compose button */}
         <button onClick={() => setShowCompose(true)} className="fixed bottom-10 left-10 rtl:right-10 rtl:left-auto z-40 w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-accent text-white flex items-center justify-center shadow-2xl hover:scale-110 hover:shadow-primary/40 transition-all outline-none focus:ring-4 focus:ring-primary/50">
            <Plus size={36} />
         </button>

         {/* Right Panel */}
         <div className="hidden lg:block w-80 space-y-6">
            <Card variant="solid" className="p-6 border-none shadow-sm bg-white">
               <h3 className="font-bold text-xl text-dark mb-6 flex items-center gap-2"><Award className="text-warning" size={24} /> العضوات الأنشط</h3>
               <div className="space-y-4">
                  {[
                     { n: 'خديجة ب.', pts: 450 },
                     { n: 'آمال (مجهول)', pts: 320 },
                     { n: 'ليلى ك.', pts: 290 }
                  ].map((u, i) => (
                     <div key={i} className="flex items-center gap-4 bg-neutral/80 p-3 rounded-2xl hover:bg-neutral transition-colors">
                        <div className="w-12 h-12 rounded-full bg-white text-dark font-display font-bold flex items-center justify-center shadow-sm text-lg">
                           #{i + 1}
                        </div>
                        <div className="flex-1 font-bold text-dark">{u.n}</div>
                        <div className="text-xs font-bold text-accent px-2 bg-accent/10 rounded-md py-1 whitespace-nowrap">{u.pts} نقطة</div>
                     </div>
                  ))}
               </div>
            </Card>
            <Card variant="glass" className="p-6 bg-white/70 shadow-sm border-white">
               <h3 className="font-bold text-xl text-dark mb-6 flex items-center gap-2"><TrendingUp className="text-blue-500" size={24} /> وسوم شائعة</h3>
               <div className="flex flex-wrap gap-2">
                  {['#العلاج_الكيماوي', '#تغذية_صحية', '#تساقط_الشعر', '#الأمل', '#قصتي', '#يوميات_التعافي'].map(t => (
                     <span key={t} className="px-4 py-2 bg-white rounded-xl text-sm font-bold text-text-muted hover:text-primary hover:shadow-sm cursor-pointer transition-all border border-neutral/50">{t}</span>
                  ))}
               </div>
            </Card>
         </div>

         {/* Compose Modal */}
         <AnimatePresence>
            {showCompose && (
               <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-dark/70 backdrop-blur-md">
                  <motion.div initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50, scale: 0.95 }} className="w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl relative overflow-hidden">
                     <div className="p-6 md:p-8 border-b border-neutral flex justify-between items-center bg-neutral/30">
                        <h2 className="text-3xl font-display font-bold text-dark">مشاركة جديدة</h2>
                        <button onClick={() => setShowCompose(false)} className="p-2.5 rounded-full hover:bg-white text-text-muted transition-colors outline-none focus:ring-2 focus:ring-primary"><X size={24} /></button>
                     </div>
                     <div className="p-6 md:p-8">
                        <div className="mb-6 relative">
                           <select className="w-full bg-neutral border border-white focus:border-primary/50  py-4 px-5 rounded-2xl font-bold text-dark outline-none transition-colors appearance-none shadow-inner">
                              <option>اختاري تصنيفاً لمشاركتك...</option>
                              {categories.filter(c => c !== 'الكل').map(c => <option key={c}>{c}</option>)}
                           </select>
                        </div>
                        <textarea
                           rows="6"
                           placeholder="شاركينا ما تفكرين فيه، اطرحي سؤالاً، أو اكتبي قصة نجاحك..."
                           className="w-full bg-white border border-neutral rounded-2xl p-5 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-dark font-medium resize-none text-xl leading-relaxed"
                        ></textarea>
                        <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
                           <label className="flex items-center gap-3 cursor-pointer group">
                              <input type="checkbox" className="w-5 h-5 rounded text-primary focus:ring-primary border-gray-300" />
                              <span className="font-bold text-text-muted group-hover:text-dark transition-colors">نشر كمجهول الهوية للحفاظ على الخصوصية</span>
                           </label>
                           <Button className="w-full sm:w-auto px-10 text-xl py-4 shadow-xl shadow-primary/20">انشري الآن</Button>
                        </div>
                     </div>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>
      </div>
   );
}

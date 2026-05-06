import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, MessageCircle, Share2, Plus, X, Filter, Award, TrendingUp } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const CATEGORIES = ['الكل', 'قصص نجاح', 'أسئلة عامة', 'تغذية', 'دعم نفسي', 'تجارب علاجية'];

export default function CommunityPage() {
  const { user, profile } = useAuth();
  const [showCompose, setShowCompose] = useState(false);
  const [activeCat, setActiveCat] = useState('الكل');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [newPost, setNewPost] = useState({ body: '', category: 'أسئلة عامة', is_anonymous: false });
  const [posting, setPosting] = useState(false);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [topUsers, setTopUsers] = useState([]);

  const fetchPosts = async () => {
    setLoading(true);
    let query = supabase
      .from('community_posts')
      .select('*, profiles(full_name)')
      .order('created_at', { ascending: false })
      .limit(20);
    if (activeCat !== 'الكل') query = query.eq('category', activeCat);
    if (search) query = query.ilike('body', `%${search}%`);
    const { data } = await query;
    setPosts(data || []);

    // Fetch liked posts for this user
    if (user) {
      const { data: likes } = await supabase
        .from('post_likes')
        .select('post_id')
        .eq('user_id', user.id);
      setLikedPosts(new Set((likes || []).map(l => l.post_id)));
    }
    setLoading(false);
  };

  const fetchTopUsers = async () => {
    const { data } = await supabase
      .from('community_posts')
      .select('user_id, profiles(full_name), is_anonymous')
      .eq('is_anonymous', false)
      .limit(50);
    const counts = {};
    (data || []).forEach(p => {
      if (p.user_id && p.profiles?.full_name) {
        counts[p.user_id] = { name: p.profiles.full_name, count: (counts[p.user_id]?.count || 0) + 1 };
      }
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1].count - a[1].count).slice(0, 3);
    setTopUsers(sorted.map(([id, v]) => ({ name: v.name, pts: v.count * 50 })));
  };

  useEffect(() => { fetchPosts(); fetchTopUsers(); }, [activeCat, search]);

  const toggleLike = async (post) => {
    if (!user) return;
    const isLiked = likedPosts.has(post.id);
    if (isLiked) {
      await supabase.from('post_likes').delete().eq('user_id', user.id).eq('post_id', post.id);
      await supabase.from('community_posts').update({ likes_count: Math.max(post.likes_count - 1, 0) }).eq('id', post.id);
      setLikedPosts(prev => { const s = new Set(prev); s.delete(post.id); return s; });
    } else {
      await supabase.from('post_likes').insert({ user_id: user.id, post_id: post.id });
      await supabase.from('community_posts').update({ likes_count: post.likes_count + 1 }).eq('id', post.id);
      setLikedPosts(prev => new Set([...prev, post.id]));
    }
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, likes_count: isLiked ? p.likes_count - 1 : p.likes_count + 1 } : p));
  };

  const submitPost = async () => {
    if (!newPost.body.trim() || posting) return;
    setPosting(true);
    await supabase.from('community_posts').insert({
      user_id: user.id,
      body: newPost.body,
      category: newPost.category,
      is_anonymous: newPost.is_anonymous,
      likes_count: 0,
    });
    setNewPost({ body: '', category: 'أسئلة عامة', is_anonymous: false });
    setShowCompose(false);
    setPosting(false);
    fetchPosts();
  };

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `منذ ${mins} دقيقة`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `منذ ${hrs} ساعة`;
    return `منذ ${Math.floor(hrs / 24)} يوم`;
  };

  return (
    <div className="pb-12 max-w-7xl mx-auto pt-6 flex flex-col lg:flex-row gap-8">
      {/* Sidebar */}
      <div className="w-full lg:w-72 flex-shrink-0 space-y-6">
        <Card variant="glass" className="p-6 bg-white/70 shadow-sm border-white">
          <h3 className="font-display font-bold text-2xl text-dark mb-6 flex items-center gap-2"><Filter size={24} className="text-primary" /> التصنيفات</h3>
          <div className="space-y-3">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setActiveCat(c)}
                className={`w-full text-right px-5 py-3.5 rounded-2xl font-bold transition-all outline-none ${activeCat === c ? 'bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]' : 'bg-white/50 text-text-muted hover:bg-white hover:text-dark border border-neutral'}`}>
                {c}
              </button>
            ))}
          </div>
        </Card>
        <Card variant="glass" className="p-6 bg-primary/5 border-primary/20 shadow-sm">
          <h3 className="font-bold text-primary mb-4 text-lg">قوانين مجتمعنا</h3>
          <ul className="text-sm font-semibold text-text-dark space-y-3">
            <li className="flex gap-2 items-start"><span className="text-primary">•</span> الاحترام المتبادل.</li>
            <li className="flex gap-2 items-start"><span className="text-primary">•</span> لا لنصائح طبية غير موثقة.</li>
            <li className="flex gap-2 items-start"><span className="text-primary">•</span> الحفاظ على سرية المشاركات.</li>
          </ul>
        </Card>
      </div>

      {/* Feed */}
      <div className="flex-1 space-y-6 relative h-[calc(100vh-120px)] overflow-y-auto no-scrollbar scroll-smooth pr-1 pb-20">
        <div className="sticky top-0 z-30 bg-neutral/80 backdrop-blur-md pt-2 pb-4">
          <div className="flex justify-between items-center bg-white/90 p-4 rounded-3xl shadow-sm border border-white">
            <div className="relative flex-1 max-w-xl mx-auto">
              <Search className="absolute right-4 rtl:left-4 rtl:right-auto top-1/2 -translate-y-1/2 text-primary" size={24} />
              <input type="text" placeholder="ابحثي في المناقشات..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full bg-neutral border-none py-3.5 pr-14 pl-4 rtl:pl-14 rtl:pr-4 rounded-2xl focus:shadow-inner outline-none text-dark font-bold text-lg" />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-text-muted font-medium">لا توجد مشاركات في هذا التصنيف</div>
        ) : (
          <AnimatePresence>
            {posts.map((post, i) => (
              <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card variant="glass" className="p-8 bg-white/80 shadow-sm hover:shadow-lg transition-all border-white">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center font-bold text-2xl shadow-inner border-2 border-white">
                        {post.is_anonymous ? '?' : (post.profiles?.full_name?.charAt(0) || '؟')}
                      </div>
                      <div>
                        <h4 className="font-bold text-dark text-xl">
                          {post.is_anonymous ? 'مجهول الهوية' : post.profiles?.full_name || 'مستخدمة'}
                        </h4>
                        <div className="text-sm font-semibold text-text-muted mt-0.5">{timeAgo(post.created_at)}</div>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-neutral rounded-lg text-xs font-bold text-text-dark border border-white/50">{post.category}</div>
                  </div>
                  <p className="text-dark font-medium leading-relaxed mb-8 text-xl text-justify">{post.body}</p>
                  <div className="flex gap-8 border-t border-neutral pt-5">
                    <button onClick={() => toggleLike(post)} className={`flex items-center gap-2 font-bold transition-colors group ${likedPosts.has(post.id) ? 'text-primary' : 'text-text-muted hover:text-primary'}`}>
                      <Heart size={22} className={likedPosts.has(post.id) ? 'fill-primary' : 'group-hover:fill-primary'} />
                      {post.likes_count}
                    </button>
                    <button className="flex items-center gap-2 text-text-muted hover:text-accent font-bold transition-colors">
                      <MessageCircle size={22} />
                    </button>
                    <button className="flex items-center gap-2 text-text-muted hover:text-blue-500 font-bold transition-colors mt-0 mr-auto rtl:ml-auto rtl:mr-0">
                      <Share2 size={22} />
                    </button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Right Panel */}
      <div className="hidden lg:block w-80 space-y-6">
        <Card variant="solid" className="p-6 border-none shadow-sm bg-white">
          <h3 className="font-bold text-xl text-dark mb-6 flex items-center gap-2"><Award className="text-warning" size={24} /> العضوات الأنشط</h3>
          <div className="space-y-4">
            {topUsers.length === 0 ? <p className="text-text-muted text-sm">لا توجد بيانات بعد</p> : topUsers.map((u, i) => (
              <div key={i} className="flex items-center gap-4 bg-neutral/80 p-3 rounded-2xl hover:bg-neutral transition-colors">
                <div className="w-12 h-12 rounded-full bg-white text-dark font-display font-bold flex items-center justify-center shadow-sm text-lg">#{i + 1}</div>
                <div className="flex-1 font-bold text-dark">{u.name}</div>
                <div className="text-xs font-bold text-accent px-2 bg-accent/10 rounded-md py-1">{u.pts} نقطة</div>
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

      {/* FAB */}
      <button onClick={() => setShowCompose(true)} className="fixed bottom-10 left-10 rtl:right-10 rtl:left-auto z-40 w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-accent text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-all outline-none">
        <Plus size={36} />
      </button>

      {/* Compose Modal */}
      <AnimatePresence>
        {showCompose && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-dark/70 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl relative overflow-hidden">
              <div className="p-6 md:p-8 border-b border-neutral flex justify-between items-center bg-neutral/30">
                <h2 className="text-3xl font-display font-bold text-dark">مشاركة جديدة</h2>
                <button onClick={() => setShowCompose(false)} className="p-2.5 rounded-full hover:bg-white text-text-muted transition-colors"><X size={24} /></button>
              </div>
              <div className="p-6 md:p-8">
                <div className="mb-6 relative">
                  <select value={newPost.category} onChange={e => setNewPost(p => ({ ...p, category: e.target.value }))}
                    className="w-full bg-neutral border border-white py-4 px-5 rounded-2xl font-bold text-dark outline-none appearance-none shadow-inner">
                    {CATEGORIES.filter(c => c !== 'الكل').map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <textarea rows="6" placeholder="شاركينا ما تفكرين فيه..." value={newPost.body}
                  onChange={e => setNewPost(p => ({ ...p, body: e.target.value }))}
                  className="w-full bg-white border border-neutral rounded-2xl p-5 outline-none focus:ring-2 focus:ring-primary/20 text-dark font-medium resize-none text-xl leading-relaxed" />
                <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={newPost.is_anonymous} onChange={e => setNewPost(p => ({ ...p, is_anonymous: e.target.checked }))}
                      className="w-5 h-5 rounded text-primary focus:ring-primary border-gray-300" />
                    <span className="font-bold text-text-muted group-hover:text-dark transition-colors">نشر كمجهول الهوية</span>
                  </label>
                  <Button onClick={submitPost} disabled={!newPost.body.trim() || posting}
                    className="w-full sm:w-auto px-10 text-xl py-4 shadow-xl shadow-primary/20">
                    {posting ? 'جاري النشر...' : 'انشري الآن'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Trash2, Eye, EyeOff, MessageSquare, Flag, Search, Pin } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AdminCommunityPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all | pinned | flagged | anonymous

  const fetchPosts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('community_posts')
      .select('*, profiles(full_name)')
      .order('created_at', { ascending: false })
      .limit(100);
    setPosts(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const deletePost = async (id) => {
    if (!window.confirm('حذف هذا المنشور؟')) return;
    await supabase.from('community_posts').delete().eq('id', id);
    fetchPosts();
  };

  const togglePin = async (post) => {
    await supabase.from('community_posts').update({ is_pinned: !post.is_pinned }).eq('id', post.id);
    fetchPosts();
  };

  const toggleHide = async (post) => {
    await supabase.from('community_posts').update({ is_hidden: !post.is_hidden }).eq('id', post.id);
    fetchPosts();
  };

  const filtered = posts.filter(p => {
    if (search && !p.body?.includes(search) && !p.profiles?.full_name?.includes(search)) return false;
    if (filter === 'pinned' && !p.is_pinned) return false;
    if (filter === 'anonymous' && !p.is_anonymous) return false;
    return true;
  });

  const moodEmoji = { happy: '😊', neutral: '😐', tired: '😔', anxious: '😟', hopeful: '✨' };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">إدارة مجتمع الدعم</h1>
          <p className="text-slate-500 text-sm mt-0.5">{posts.length} منشور</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث في المنشورات..."
            className="pr-9 pl-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white w-64" />
        </div>
        <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
          {[{ id: 'all', label: 'الكل' }, { id: 'pinned', label: '📌 المثبتة' }, { id: 'anonymous', label: '🎭 مجهولة' }].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === f.id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-3">
        {loading ? <div className="text-center py-12 text-slate-400">جاري التحميل...</div>
          : filtered.length === 0 ? <div className="text-center py-12 text-slate-400 bg-white rounded-2xl border border-slate-100">لا توجد منشورات</div>
            : filtered.map(post => (
              <div key={post.id} className={`bg-white rounded-2xl border shadow-sm p-5 transition-all ${post.is_hidden ? 'opacity-50 border-dashed border-slate-200' : 'border-slate-100'} ${post.is_pinned ? 'ring-2 ring-rose-200' : ''}`}>
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                        {post.is_anonymous ? '🎭' : (post.profiles?.full_name?.charAt(0) || '؟')}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {post.is_anonymous ? 'مجهولة الهوية' : (post.profiles?.full_name || 'مستخدمة')}
                          {post.is_pinned && <span className="mr-2 text-xs bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full font-semibold">📌 مثبت</span>}
                          {post.is_hidden && <span className="mr-2 text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-semibold">مخفي</span>}
                        </p>
                        <p className="text-xs text-slate-400">{new Date(post.created_at).toLocaleString('ar-DZ')}</p>
                      </div>
                      {post.mood && <span className="text-lg" title={post.mood}>{moodEmoji[post.mood] || ''}</span>}
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed line-clamp-3">{post.body}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><MessageSquare size={12} /> {post.likes_count || 0} تفاعل</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => togglePin(post)} title="تثبيت/إلغاء تثبيت"
                      className={`p-2 rounded-xl transition-colors ${post.is_pinned ? 'bg-rose-100 text-rose-600' : 'text-slate-400 hover:bg-slate-100'}`}><Pin size={15} /></button>
                    <button onClick={() => toggleHide(post)} title="إخفاء/إظهار"
                      className={`p-2 rounded-xl transition-colors ${post.is_hidden ? 'bg-amber-100 text-amber-600' : 'text-slate-400 hover:bg-slate-100'}`}>
                      {post.is_hidden ? <Eye size={15} /> : <EyeOff size={15} />}
                    </button>
                    <button onClick={() => deletePost(post.id)} title="حذف"
                      className="p-2 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"><Trash2 size={15} /></button>
                  </div>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}

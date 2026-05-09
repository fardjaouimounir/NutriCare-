import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Eye, EyeOff, Search, X, ChevronDown } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const CATEGORIES = ['التغذية', 'الأعراض الجانبية', 'الوصفات', 'النشاط البدني', 'الصحة النفسية', 'علاجات كيماوية'];

const emptyForm = { title: '', excerpt: '', content: '', category: 'التغذية', author_name: '', image_url: '', read_time: '5 دقائق', is_published: false };

export default function AdminContentPage() {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('articles'); // articles | recipes

  // ── Recipes state ──
  const [recipes, setRecipes] = useState([]);
  const [recipeForm, setRecipeForm] = useState({
    title: '', description: '', prep_time: '30 دقيقة', difficulty: 'سهل',
    tags: '', calories: '', protein: '', carbs: '', fat: '', image_url: '', is_approved: false,
    ingredients: '', steps: '',
  });
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [showRecipeForm, setShowRecipeForm] = useState(false);

  const fetchArticles = async () => {
    const { data } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
    setArticles(data || []);
    setLoading(false);
  };

  const fetchRecipes = async () => {
    const { data } = await supabase.from('recipes').select('*').order('created_at', { ascending: false });
    setRecipes(data || []);
  };

  useEffect(() => { fetchArticles(); fetchRecipes(); }, []);

  // ── Article CRUD ──
  const saveArticle = async () => {
    if (!form.title || saving) return;
    setSaving(true);
    if (editing) {
      await supabase.from('articles').update({ ...form, author_id: user.id }).eq('id', editing);
    } else {
      await supabase.from('articles').insert({ ...form, author_id: user.id });
    }
    setForm(emptyForm); setEditing(null); setShowForm(false);
    setSaving(false); fetchArticles();
  };

  const togglePublish = async (article) => {
    await supabase.from('articles').update({ is_published: !article.is_published }).eq('id', article.id);
    fetchArticles();
  };

  const deleteArticle = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المقال؟')) return;
    await supabase.from('articles').delete().eq('id', id);
    fetchArticles();
  };

  const openEdit = (article) => {
    setForm({ title: article.title, excerpt: article.excerpt || '', content: article.content || '', category: article.category, author_name: article.author_name || '', image_url: article.image_url || '', read_time: article.read_time || '5 دقائق', is_published: article.is_published });
    setEditing(article.id); setShowForm(true);
  };

  // ── Recipe CRUD ──
  const saveRecipe = async () => {
    if (!recipeForm.title || saving) return;
    setSaving(true);
    const payload = {
      ...recipeForm,
      calories: parseInt(recipeForm.calories) || 0,
      protein: parseFloat(recipeForm.protein) || 0,
      carbs: parseFloat(recipeForm.carbs) || 0,
      fat: parseFloat(recipeForm.fat) || 0,
      tags: recipeForm.tags ? recipeForm.tags.split(',').map(t => t.trim()) : [],
      ingredients: recipeForm.ingredients ? recipeForm.ingredients.split('\n').filter(Boolean) : [],
      steps: recipeForm.steps ? recipeForm.steps.split('\n').filter(Boolean) : [],
      author_id: user.id,
    };
    if (editingRecipe) {
      await supabase.from('recipes').update(payload).eq('id', editingRecipe);
    } else {
      await supabase.from('recipes').insert(payload);
    }
    setRecipeForm({ title: '', description: '', prep_time: '30 دقيقة', difficulty: 'سهل', tags: '', calories: '', protein: '', carbs: '', fat: '', image_url: '', is_approved: false, ingredients: '', steps: '' });
    setEditingRecipe(null); setShowRecipeForm(false);
    setSaving(false); fetchRecipes();
  };

  const toggleApprove = async (recipe) => {
    await supabase.from('recipes').update({ is_approved: !recipe.is_approved }).eq('id', recipe.id);
    fetchRecipes();
  };

  const deleteRecipe = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الوصفة؟')) return;
    await supabase.from('recipes').delete().eq('id', id);
    fetchRecipes();
  };

  const openEditRecipe = (r) => {
    setRecipeForm({
      title: r.title, description: r.description || '', prep_time: r.prep_time, difficulty: r.difficulty,
      tags: (r.tags || []).join(', '), calories: r.calories, protein: r.protein, carbs: r.carbs, fat: r.fat,
      image_url: r.image_url || '', is_approved: r.is_approved,
      ingredients: (r.ingredients || []).join('\n'), steps: (r.steps || []).join('\n'),
    });
    setEditingRecipe(r.id); setShowRecipeForm(true);
  };

  const filteredArticles = articles.filter(a => !search || a.title?.toLowerCase().includes(search.toLowerCase()));
  const filteredRecipes = recipes.filter(r => !search || r.title?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">إدارة المحتوى</h1>
          <p className="text-slate-500 text-sm mt-0.5">إضافة وتعديل المقالات والوصفات</p>
        </div>
        <button onClick={() => tab === 'articles' ? setShowForm(true) : setShowRecipeForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm">
          <Plus size={16} /> {tab === 'articles' ? 'مقال جديد' : 'وصفة جديدة'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-slate-100 p-1 rounded-xl w-fit">
        {[{ id: 'articles', label: `المقالات (${articles.length})` }, { id: 'recipes', label: `الوصفات (${recipes.length})` }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t.id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="بحث..." className="w-full pr-9 pl-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white" />
      </div>

      {/* ── Articles Table ── */}
      {tab === 'articles' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead><tr className="border-b border-slate-100">
              {['العنوان', 'التصنيف', 'الكاتب', 'وقت القراءة', 'الحالة', 'إجراءات'].map(h => (
                <th key={h} className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-12 text-slate-400">جاري التحميل...</td></tr>
              ) : filteredArticles.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-slate-400">لا توجد مقالات</td></tr>
              ) : filteredArticles.map(a => (
                <tr key={a.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {a.image_url && <img src={a.image_url} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                      <div>
                        <p className="text-sm font-semibold text-slate-800 line-clamp-1">{a.title}</p>
                        <p className="text-xs text-slate-400 line-clamp-1">{a.excerpt}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold">{a.category}</span></td>
                  <td className="px-4 py-3 text-sm text-slate-600">{a.author_name || '—'}</td>
                  <td className="px-4 py-3 text-sm text-slate-500">{a.read_time}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => togglePublish(a)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${a.is_published ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                      {a.is_published ? <><Eye size={12} /> منشور</> : <><EyeOff size={12} /> مسودة</>}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(a)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit3 size={15} /></button>
                      <button onClick={() => deleteArticle(a.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Recipes Table ── */}
      {tab === 'recipes' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead><tr className="border-b border-slate-100">
              {['الوصفة', 'الوقت / الصعوبة', 'القيم الغذائية', 'الحالة', 'إجراءات'].map(h => (
                <th key={h} className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-slate-50">
              {filteredRecipes.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-slate-400">لا توجد وصفات</td></tr>
              ) : filteredRecipes.map(r => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {r.image_url && <img src={r.image_url} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{r.title}</p>
                        <div className="flex gap-1 mt-1">{(r.tags || []).slice(0, 2).map(t => <span key={t} className="text-xs bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded">{t}</span>)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{r.prep_time} · {r.difficulty}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{r.calories} سعرة · {r.protein}غ بروتين</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleApprove(r)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${r.is_approved ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {r.is_approved ? '✅ موافق عليها' : '⏳ قيد المراجعة'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEditRecipe(r)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit3 size={15} /></button>
                      <button onClick={() => deleteRecipe(r.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Article Form Modal ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">{editing ? 'تعديل المقال' : 'مقال جديد'}</h2>
              <button onClick={() => { setShowForm(false); setEditing(null); setForm(emptyForm); }} className="p-2 hover:bg-slate-100 rounded-lg"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <input placeholder="عنوان المقال *" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
              <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none bg-white">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="اسم الكاتب" value={form.author_name} onChange={e => setForm(p => ({ ...p, author_name: e.target.value }))}
                  className="border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
                <input placeholder="وقت القراءة (مثال: 5 دقائق)" value={form.read_time} onChange={e => setForm(p => ({ ...p, read_time: e.target.value }))}
                  className="border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
              </div>
              <input placeholder="رابط الصورة" value={form.image_url} onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
              <textarea rows={2} placeholder="مقتطف قصير..." value={form.excerpt} onChange={e => setForm(p => ({ ...p, excerpt: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none" />
              <textarea rows={6} placeholder="محتوى المقال الكامل..." value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none" />
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_published} onChange={e => setForm(p => ({ ...p, is_published: e.target.checked }))} className="w-4 h-4 accent-rose-500" />
                <span className="text-sm font-medium text-slate-700">نشر المقال مباشرةً</span>
              </label>
              <button onClick={saveArticle} disabled={!form.title || saving}
                className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-semibold transition-colors disabled:opacity-50">
                {saving ? 'جاري الحفظ...' : editing ? 'حفظ التعديلات' : 'إضافة المقال'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Recipe Form Modal ── */}
      {showRecipeForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">{editingRecipe ? 'تعديل الوصفة' : 'وصفة جديدة'}</h2>
              <button onClick={() => { setShowRecipeForm(false); setEditingRecipe(null); }} className="p-2 hover:bg-slate-100 rounded-lg"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <input placeholder="اسم الوصفة *" value={recipeForm.title} onChange={e => setRecipeForm(p => ({ ...p, title: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="وقت التحضير" value={recipeForm.prep_time} onChange={e => setRecipeForm(p => ({ ...p, prep_time: e.target.value }))}
                  className="border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
                <select value={recipeForm.difficulty} onChange={e => setRecipeForm(p => ({ ...p, difficulty: e.target.value }))}
                  className="border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none bg-white">
                  {['سهل', 'متوسط', 'صعب'].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <input placeholder="الوسوم (مفصولة بفاصلة: حساء, نباتي, ...)" value={recipeForm.tags} onChange={e => setRecipeForm(p => ({ ...p, tags: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
              <input placeholder="رابط الصورة" value={recipeForm.image_url} onChange={e => setRecipeForm(p => ({ ...p, image_url: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
              <div className="grid grid-cols-4 gap-3">
                {[['calories', 'سعرات'], ['protein', 'بروتين'], ['carbs', 'كارب'], ['fat', 'دهون']].map(([k, l]) => (
                  <input key={k} type="number" placeholder={l} value={recipeForm[k]} onChange={e => setRecipeForm(p => ({ ...p, [k]: e.target.value }))}
                    className="border border-slate-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
                ))}
              </div>
              <textarea rows={4} placeholder={"المكونات (كل مكون في سطر):\nكوب دقيق\n200 غ زبدة..."} value={recipeForm.ingredients} onChange={e => setRecipeForm(p => ({ ...p, ingredients: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none font-mono text-xs" />
              <textarea rows={4} placeholder={"خطوات التحضير (كل خطوة في سطر):\nاخلطي المواد الجافة\nأضيفي الزبدة..."} value={recipeForm.steps} onChange={e => setRecipeForm(p => ({ ...p, steps: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none font-mono text-xs" />
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={recipeForm.is_approved} onChange={e => setRecipeForm(p => ({ ...p, is_approved: e.target.checked }))} className="w-4 h-4 accent-rose-500" />
                <span className="text-sm font-medium text-slate-700">نشر الوصفة مباشرةً</span>
              </label>
              <button onClick={saveRecipe} disabled={!recipeForm.title || saving}
                className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-semibold transition-colors disabled:opacity-50">
                {saving ? 'جاري الحفظ...' : editingRecipe ? 'حفظ التعديلات' : 'إضافة الوصفة'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

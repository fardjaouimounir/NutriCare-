import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoonStar, Calendar, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const SYMPTOMS = ['غثيان', 'إرهاق شديد', 'تساقط الشعر', 'ألم المفاصل', 'صداع', 'صعوبة النوم', 'تغير في الشهية', 'تنميل الأطراف', 'تقلب المزاج'];

export default function JournalPage() {
  const { user } = useAuth();
  const [mood, setMood] = useState(null);
  const [fatigue, setFatigue] = useState(5);
  const [symptoms, setSymptoms] = useState([]);
  const [notes, setNotes] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [history, setHistory] = useState([]);
  const [saving, setSaving] = useState(false);
  const today = new Date().toISOString().split('T')[0];

  const fetchHistory = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('entry_date', { ascending: false })
      .limit(5);
    setHistory(data || []);

    // Load today's entry if exists
    const todayEntry = (data || []).find(e => e.entry_date === today);
    if (todayEntry) {
      setMood(todayEntry.mood);
      setFatigue(todayEntry.fatigue);
      setSymptoms(todayEntry.symptoms || []);
      setNotes(todayEntry.notes || '');
      setWeightKg(todayEntry.weight_kg || '');
    }
  };

  useEffect(() => { fetchHistory(); }, [user, today]);

  const toggleSymptom = (s) => {
    setSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const handleSave = async () => {
    if (mood === null || saving) return;
    setSaving(true);
    try {
      // Upsert (insert or update) today's entry
      await supabase.from('journal_entries').upsert({
        user_id: user.id,
        entry_date: today,
        mood,
        fatigue,
        symptoms,
        notes,
        weight_kg: weightKg ? parseFloat(weightKg) : null,
      }, { onConflict: 'user_id,entry_date' });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
      fetchHistory();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const moodEmojis = ['😔', '😕', '😐', '🙂', '😊'];

  return (
    <div className="pb-12 max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 items-start pt-6">
      {/* Left: Form */}
      <motion.div className="flex-1 w-full space-y-6">
        <Card variant="glass" className="p-8 bg-gradient-to-br from-secondary to-neutral border-white/50 shadow-glass">
          <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/20">
            <div>
              <h1 className="text-3xl font-display font-bold text-dark flex items-center gap-3">يومياتك</h1>
              <p className="text-text-muted mt-2 font-bold flex items-center gap-2">
                <Calendar size={18} /> {new Date().toLocaleDateString('ar-DZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="w-14 h-14 bg-white/40 rounded-full flex items-center justify-center text-primary shadow-sm backdrop-blur-sm border border-white">
              <MoonStar size={28} />
            </div>
          </div>

          {/* Mood */}
          <div className="mb-10 p-6 bg-white/80 rounded-xl shadow-sm border border-dark/5">
            <h3 className="font-bold text-sm text-text-muted uppercase tracking-widest mb-8 text-center">كيف هو شعورك اليوم؟</h3>
            <div className="flex justify-between items-center max-w-sm mx-auto">
              {moodEmojis.map((e, i) => (
                <button key={i} onClick={() => setMood(i)}
                  className={`text-4xl transition-all duration-300 outline-none rounded-lg ${mood === i ? 'scale-110 -translate-y-2' : 'grayscale opacity-30 hover:grayscale-0 hover:opacity-100 hover:scale-110'}`}>
                  {e}
                </button>
              ))}
            </div>
            {mood === null && <p className="text-center text-[10px] text-primary/70 font-bold mt-4 uppercase tracking-widest">رجاءً اختاري شعورك للبدء</p>}
          </div>

          {/* Fatigue */}
          <div className="mb-10">
            <div className="flex justify-between text-lg font-bold text-dark mb-4">
              <span>مستوى التعب الجسدي</span>
              <span className="bg-white/60 px-3 rounded-full">{fatigue} / 10</span>
            </div>
            <input type="range" min="1" max="10" value={fatigue} onChange={e => setFatigue(parseInt(e.target.value))}
              className="w-full h-3 bg-white/50 rounded-full appearance-none outline-none accent-primary shadow-inner" />
            <div className="flex justify-between text-sm text-text-muted font-bold mt-2">
              <span>طاقة عالية</span><span>منهكة جداً</span>
            </div>
          </div>

          {/* Weight */}
          <div className="mb-10">
            <div className="flex justify-between text-lg font-bold text-dark mb-4">
              <span>الوزن اليوم (كغ) — اختياري</span>
            </div>
            <input type="number" placeholder="مثال: 64.5" value={weightKg} onChange={e => setWeightKg(e.target.value)}
              className="w-full max-w-xs bg-white/60 border border-white/80 rounded-2xl p-3 outline-none focus:ring-2 focus:ring-primary/30 text-dark font-bold" />
          </div>

          {/* Symptoms */}
          <div className="mb-10">
            <h3 className="font-bold text-lg text-dark mb-4 flex items-center gap-2"><AlertCircle size={20} className="text-warning" /> الأعراض الجانبية</h3>
            <div className="flex flex-wrap gap-2">
              {SYMPTOMS.map(s => (
                <button key={s} onClick={() => toggleSymptom(s)}
                  className={`px-4 py-2 rounded-full font-bold transition-all text-sm outline-none border ${symptoms.includes(s) ? 'bg-primary text-white border-primary shadow-md' : 'bg-white/50 text-text-muted border-transparent hover:bg-white/80 hover:text-dark'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="mb-8">
            <h3 className="font-bold text-lg text-dark mb-4">ملاحظات إضافية</h3>
            <textarea rows="4" placeholder="اكتبي ما تشعرين به... هذه المساحة آمنة وخاصة بكِ."
              value={notes} onChange={e => setNotes(e.target.value)}
              className="w-full bg-white/60 border border-white/80 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary/30 resize-none text-dark placeholder:text-text-muted/60 font-medium"
              maxLength={500} />
            <div className="text-left mt-2 text-xs text-text-muted font-bold">{notes.length} / 500</div>
          </div>

          {/* Save */}
          <div className="flex justify-end pt-4 border-t border-white/20">
            <Button onClick={handleSave} className="w-full md:w-64 py-4 text-lg shadow-xl" disabled={mood === null || saving}>
              <AnimatePresence mode="wait">
                {isSaved ? (
                  <motion.div key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-2">
                    <CheckCircle2 /> تم الحفظ بنجاح
                  </motion.div>
                ) : (
                  <motion.div key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-2">
                    <Save size={20} /> {saving ? 'جاري الحفظ...' : 'حفظ اليومية'}
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Right: History */}
      <div className="w-full lg:w-96 space-y-6">
        <Card variant="solid" className="p-6 bg-white/80 sticky top-28 border-white border">
          <h3 className="font-bold text-xl text-dark mb-8">سجل الأيام السابقة</h3>
          {history.length === 0 ? (
            <p className="text-center text-text-muted font-medium py-6">لا توجد سجلات سابقة</p>
          ) : (
            <div className="relative border-r-2 rtl:border-r-2 border-primary/20 rtl:pr-6 space-y-8">
              {history.map((h) => (
                <div key={h.id} className="relative cursor-pointer group">
                  <div className="absolute top-0 rtl:-right-[33px] w-4 h-4 rounded-full bg-white border-2 border-primary group-hover:scale-125 transition-transform" />
                  <div className="bg-neutral/40 p-4 rounded-2xl border border-white group-hover:bg-primary/5 transition-colors shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-primary">{new Date(h.entry_date).toLocaleDateString('ar-DZ', { day: 'numeric', month: 'long' })}</span>
                      <span className="text-2xl">{moodEmojis[h.mood] || '😐'}</span>
                    </div>
                    {h.notes && <p className="text-sm text-text-muted font-medium mb-3 line-clamp-2 leading-relaxed">{h.notes}</p>}
                    <div className="flex gap-1 flex-wrap">
                      {(h.symptoms || []).slice(0, 3).map(s => (
                        <span key={s} className="text-[10px] bg-white px-2 py-1 rounded-md text-text-muted font-bold border border-neutral shadow-sm">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

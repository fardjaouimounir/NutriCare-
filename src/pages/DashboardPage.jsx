import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RadialBarChart, RadialBar, ResponsiveContainer, AreaChart, Area, Tooltip as RechartsTooltip } from 'recharts';
import { Card } from '../components/ui/Card';
import { Bell, Plus, CheckCircle2, Circle, Flame, Droplet } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const [mood, setMood] = useState(null);
  const [water, setWater] = useState(0);
  const [reminders, setReminders] = useState([]);
  const [mealSummary, setMealSummary] = useState({ calories: 0, protein: 0 });
  const [weightData, setWeightData] = useState([]);
  const [loading, setLoading] = useState(true);
  const today = new Date().toISOString().split('T')[0];

  // Fetch all dashboard data
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      try {
        // Hydration today
        const { data: hydration } = await supabase
          .from('hydration_logs')
          .select('amount_ml')
          .eq('user_id', user.id)
          .eq('logged_at', today);
        const totalWater = (hydration || []).reduce((sum, r) => sum + r.amount_ml, 0);
        setWater(totalWater);

        // Meals today
        const { data: meals } = await supabase
          .from('meal_logs')
          .select('calories, protein')
          .eq('user_id', user.id)
          .eq('logged_at', today);
        const totalCal = (meals || []).reduce((s, m) => s + (m.calories || 0), 0);
        const totalProt = (meals || []).reduce((s, m) => s + (m.protein || 0), 0);
        setMealSummary({ calories: totalCal, protein: totalProt });

        // Reminders today
        const { data: rem } = await supabase
          .from('reminders')
          .select('*')
          .eq('user_id', user.id)
          .eq('reminder_date', today)
          .order('time');
        setReminders(rem || []);

        // Journal weight (last 6 entries)
        const { data: journals } = await supabase
          .from('journal_entries')
          .select('entry_date, weight_kg')
          .eq('user_id', user.id)
          .not('weight_kg', 'is', null)
          .order('entry_date', { ascending: true })
          .limit(6);
        setWeightData((journals || []).map(j => ({ day: j.entry_date?.slice(5), weight: j.weight_kg })));

        // Today's mood — use maybeSingle() to avoid 406 when no entry exists
        const { data: todayJournal } = await supabase
          .from('journal_entries')
          .select('mood')
          .eq('user_id', user.id)
          .eq('entry_date', today)
          .maybeSingle();
        if (todayJournal) setMood(todayJournal.mood);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, today]);

  const addWater = async (ml) => {
    const newTotal = water + ml;
    setWater(newTotal);
    await supabase.from('hydration_logs').insert({ user_id: user.id, amount_ml: ml, logged_at: today });
  };

  const toggleReminder = async (id, done) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, is_done: !done } : r));
    await supabase.from('reminders').update({ is_done: !done }).eq('id', id);
  };

  const caloriesGoal = 1800;
  const waterGoal = 2000;
  const proteinGoal = 60;

  const macroData = [
    { name: 'سعرات', value: Math.min(Math.round((mealSummary.calories / caloriesGoal) * 100), 100), fill: '#A64B62' },
    { name: 'بروتين', value: Math.min(Math.round((mealSummary.protein / proteinGoal) * 100), 100), fill: '#7C6A96' },
    { name: 'ماء', value: Math.min(Math.round((water / waterGoal) * 100), 100), fill: '#5C8BAD' },
  ];

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'صباح الخير';
    if (h < 18) return 'مساء الخير';
    return 'مساء النور';
  };

  const dateStr = new Date().toLocaleDateString('ar-DZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="pb-24 lg:pb-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-6 bg-white p-6 rounded-xl shadow-sm border border-dark/5">
        <div>
          <h1 className="text-2xl font-display font-bold text-dark mb-1">
            {greeting()} يا {profile?.full_name?.split(' ')[0] || 'بشرى'}
          </h1>
          <p className="text-text-muted font-bold tracking-widest uppercase text-[10px] opacity-70">
            <span className="force-ltr inline-block">{dateStr}</span>
          </p>
        </div>
        <button className="relative w-10 h-10 flex items-center justify-center bg-secondary rounded-lg text-dark hover:text-primary transition-colors">
          <Bell size={18} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
        </button>
      </header>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Macros */}
        <Card variant="glass" className="p-6 bg-white/70 h-[380px] flex flex-col">
          <h3 className="font-bold mb-4 flex items-center gap-2 text-dark text-xl"><Flame className="text-accent" /> ملخص اليوم</h3>
          <div className="flex-1 -mx-4 -mt-4 relative">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="40%" outerRadius="100%" barSize={16} data={macroData} startAngle={90} endAngle={-270}>
                <RadialBar minAngle={15} background clockWise dataKey="value" cornerRadius={10} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
              <span className="text-3xl font-bold text-dark">{macroData[0].value}%</span>
              <span className="text-sm font-semibold text-text-muted">مكتمل</span>
            </div>
          </div>
          <div className="flex justify-between mt-2 pt-4 border-t border-primary/10 text-xs font-bold">
            <span className="text-primary flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary" />سعرات {macroData[0].value}%</span>
            <span className="text-accent flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent" />بروتين {macroData[1].value}%</span>
            <span className="text-blue-500 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" />ماء {macroData[2].value}%</span>
          </div>
        </Card>

        {/* Mood */}
        <Card variant="glass" className="p-6 bg-white/70 flex flex-col justify-between h-[380px]">
          <h3 className="font-bold mb-4 text-xl text-dark">حالتك اليوم</h3>
          <div className="bg-neutral/80 p-6 rounded-3xl mb-6 shadow-inner text-center">
            <div className="text-sm font-bold text-text-muted mb-4">كيف تشعرين الآن؟</div>
            <div className="flex justify-between items-center bg-white p-3 rounded-2xl shadow-sm">
              {['😔', '😕', '😐', '🙂', '😊'].map((emoji, i) => (
                <button
                  key={i}
                  onClick={() => setMood(i)}
                  className={`text-3xl md:text-4xl transition-all duration-300 outline-none ${mood === i ? 'scale-125 drop-shadow-lg -translate-y-2' : 'grayscale opacity-40 hover:grayscale-0 hover:opacity-100 hover:scale-110'}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Hydration */}
        <Card variant="glass" className="p-6 bg-white/70 flex flex-col items-center justify-between h-[380px]">
          <div className="w-full flex justify-between items-center mb-2">
            <h3 className="font-bold text-xl text-dark flex items-center gap-2"><Droplet size={24} className="text-blue-500" /> هدف الترطيب</h3>
          </div>
          <div className="relative w-32 h-48 mt-4 border-4 border-blue-100 rounded-b-3xl rounded-t-lg overflow-hidden shadow-inner bg-white/50">
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 to-blue-300 opacity-80"
              initial={{ height: 0 }}
              animate={{ height: `${Math.min((water / waterGoal) * 100, 100)}%` }}
              transition={{ duration: 1.5, type: 'spring' }}
            />
          </div>
          <div className="text-center mt-4">
            <p className="font-display font-bold text-2xl text-blue-600">{water} <span className="text-sm text-text-muted">/ {waterGoal} مل</span></p>
          </div>
          <div className="flex gap-2 mt-4 w-full justify-center flex-wrap">
            {[150, 250, 500].map(ml => (
              <button key={ml} onClick={() => addWater(ml)} className="flex items-center gap-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full font-semibold transition-colors text-sm outline-none">
                <Plus size={14} /> {ml} مل
              </button>
            ))}
          </div>
        </Card>

        {/* Weight Trend */}
        <Card variant="glass" className="p-6 h-[280px] flex flex-col">
          <h3 className="font-bold mb-6 flex items-center gap-2 text-xl text-dark italic font-display">مسار الوزن مؤخراً</h3>
          {weightData.length > 0 ? (
            <div className="flex-1 -mx-4 -mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weightData}>
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#A64B62" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#A64B62" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <RechartsTooltip contentStyle={{ borderRadius: '16px', border: 'none' }} />
                  <Area type="monotone" dataKey="weight" stroke="#A64B62" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-text-muted text-sm font-medium">سجلي وزنك في اليومية لعرض المسار</div>
          )}
        </Card>

        {/* Reminders */}
        <Card variant="glass" className="p-6 bg-white/70 h-[280px] flex flex-col md:col-span-2 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-xl text-dark">تذكيراتك اليوم</h3>
          </div>
          <div className="space-y-3 overflow-y-auto pr-1 no-scrollbar flex-1">
            {reminders.length === 0 ? (
              <div className="text-center text-text-muted font-medium py-6">لا توجد تذكيرات لليوم</div>
            ) : reminders.map(r => (
              <div key={r.id} className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-neutral/50 group hover:border-primary/30 transition-colors">
                <button onClick={() => toggleReminder(r.id, r.is_done)} className="outline-none focus:ring-2 focus:ring-primary rounded-full">
                  {r.is_done ? <CheckCircle2 className="text-success" /> : <Circle className="text-text-muted group-hover:text-primary" />}
                </button>
                <div className={`flex-1 overflow-hidden text-ellipsis whitespace-nowrap ${r.is_done ? 'line-through text-text-muted' : 'text-dark font-semibold'}`}>
                  {r.text}
                </div>
                <div className="text-xs font-bold text-text-muted bg-neutral px-2 py-1 rounded-md">{r.time}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* FAB */}
      <div className="fixed bottom-6 rtl:left-6 ltr:right-6 z-40">
        <button className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center shadow-xl shadow-primary/20 hover:scale-105 transition-all">
          <Plus size={24} />
        </button>
      </div>
    </div>
  );
}

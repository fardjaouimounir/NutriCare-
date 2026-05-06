import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Droplet, Plus, History } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export default function HydrationPage() {
  const { user } = useAuth();
  const target = 2000;
  const [current, setCurrent] = useState(0);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const today = new Date().toISOString().split('T')[0];

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);

    // Today's total
    const { data: todayLogs } = await supabase
      .from('hydration_logs')
      .select('amount_ml')
      .eq('user_id', user.id)
      .eq('logged_at', today);
    setCurrent((todayLogs || []).reduce((s, r) => s + r.amount_ml, 0));

    // Last 7 days
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - 6 + i);
      return d.toISOString().split('T')[0];
    });
    const { data: logs } = await supabase
      .from('hydration_logs')
      .select('logged_at, amount_ml')
      .eq('user_id', user.id)
      .in('logged_at', days);

    setHistoryData(days.map(day => {
      const d = new Date(day);
      const amount = (logs || []).filter(l => l.logged_at === day).reduce((s, l) => s + l.amount_ml, 0);
      return { day: d.toLocaleDateString('en', { weekday: 'short' }), amount };
    }));

    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [user, today]);

  const addWater = async (ml) => {
    const newTotal = current + ml;
    setCurrent(newTotal);
    await supabase.from('hydration_logs').insert({ user_id: user.id, amount_ml: ml, logged_at: today });
    // Update history
    setHistoryData(prev => prev.map((d, i) => i === prev.length - 1 ? { ...d, amount: newTotal } : d));
  };

  const fillPercentage = Math.min((current / target) * 100, 100);

  return (
    <div className="pb-12 max-w-5xl mx-auto flex flex-col md:flex-row gap-8 items-center md:items-start pt-10">
      {/* Left: Visualizer */}
      <div className="flex-1 w-full flex flex-col items-center">
        <h1 className="text-4xl font-display font-bold text-dark mb-2 text-center md:text-right w-full">تتبع الترطيب</h1>
        <p className="text-text-muted font-bold text-center md:text-right w-full mb-12">
          حافظي على رطوبة جسمك خلال مراحل العلاج المختلفة.
        </p>

        <div className="relative mb-12">
          <svg width="200" height="400" viewBox="0 0 200 400" className="drop-shadow-2xl z-20 relative mix-blend-multiply opacity-30">
            <path d="M60,0 C60,0 80,0 80,20 L80,50 L50,80 C30,100 20,150 20,200 L20,360 C20,380 40,400 60,400 L140,400 C160,400 180,380 180,360 L180,200 C180,150 170,100 150,80 L120,50 L120,20 C120,0 140,0 140,0 Z" fill="none" stroke="#2563eb" strokeWidth="8" strokeLinejoin="round" />
          </svg>
          <div className="absolute inset-0 z-10 overflow-hidden" style={{ clipPath: 'path("M60,0 C60,0 80,0 80,20 L80,50 L50,80 C30,100 20,150 20,200 L20,360 C20,380 40,400 60,400 L140,400 C160,400 180,380 180,360 L180,200 C180,150 170,100 150,80 L120,50 L120,20 C120,0 140,0 140,0 Z")' }}>
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-600 to-blue-300"
              initial={{ height: 0 }}
              animate={{ height: `${fillPercentage}%` }}
              transition={{ type: 'spring', damping: 20 }}
            />
          </div>
          <div className="absolute inset-0 z-30 flex items-center justify-center flex-col pointer-events-none mt-20">
            <motion.span key={current} initial={{ scale: 1.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="text-4xl font-display font-bold text-dark drop-shadow-md">
              {current} <span className="text-lg">مل</span>
            </motion.span>
            <span className="text-sm font-bold text-dark/70 bg-white/40 px-2 rounded-full backdrop-blur-md">الهدف: {target} مل</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-xs mb-6">
          <div className="h-3 bg-blue-100 rounded-full overflow-hidden">
            <motion.div animate={{ width: `${fillPercentage}%` }} className="h-full bg-blue-500 rounded-full" />
          </div>
          <div className="flex justify-between text-xs font-bold text-text-muted mt-1">
            <span>0 مل</span>
            <span className={fillPercentage >= 100 ? 'text-success font-bold' : ''}>{fillPercentage >= 100 ? '✅ هدف مكتمل!' : `${Math.round(fillPercentage)}%`}</span>
            <span>{target} مل</span>
          </div>
        </div>

        <div className="text-center bg-white/60 p-4 rounded-2xl shadow-sm border border-white w-full max-w-xs">
          <h3 className="font-bold text-dark mb-4 text-lg">إضافة سريعة</h3>
          <div className="grid grid-cols-3 gap-3">
            {[{ val: 150, label: 'كوب صغير' }, { val: 250, label: 'كوب كبير' }, { val: 500, label: 'قارورة' }].map(b => (
              <button key={b.val} onClick={() => addWater(b.val)}
                className="flex flex-col items-center justify-center bg-blue-50 text-blue-600 p-3 rounded-xl border border-blue-100 hover:bg-blue-600 hover:text-white transition-colors shadow-sm outline-none">
                <Plus size={20} className="mb-1" />
                <span className="font-bold text-xs">{b.val}</span>
                <span className="text-[10px] opacity-70">{b.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Charts */}
      <div className="w-full md:w-96 space-y-6 pt-12 md:pt-0">
        <Card variant="glass" className="p-6 bg-white/80">
          <h3 className="font-bold text-xl text-dark mb-6 flex items-center gap-2"><History className="text-blue-500" /> الأيام السبعة الماضية</h3>
          <div className="h-64 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={historyData}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9E7A85', fontWeight: 'bold' }} />
                <Tooltip cursor={{ fill: 'rgba(59,130,246,0.1)' }} contentStyle={{ borderRadius: '12px', border: 'none' }} formatter={v => [`${v} مل`, 'الكمية']} />
                <ReferenceLine y={target} stroke="#3b82f6" strokeDasharray="4 4" />
                <Bar dataKey="amount" fill="#3b82f6" radius={[6, 6, 6, 6]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 pt-4 border-t border-neutral text-center text-sm font-bold text-text-muted">
            <span className="text-blue-600 mr-2 inline-block">●</span>الهدف اليومي: {target} مل
          </div>
        </Card>

        <Card variant="solid" className="p-6 bg-gradient-to-r from-blue-500 to-blue-400 text-white border-none text-center">
          <Droplet size={32} className="mx-auto mb-3 opacity-80" />
          <h3 className="font-display font-bold text-xl mb-2">نصيحة اليوم</h3>
          <p className="font-medium text-white/90 leading-relaxed text-sm">
            شرب الماء بكميات كافية يساعد في تقليل الآثار الجانبية للعلاج الكيميائي ويطرد السموم من جسمك.
          </p>
        </Card>
      </div>
    </div>
  );
}

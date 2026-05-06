import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus, Search, Sun, Coffee, Moon, Apple } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { RadialBarChart, RadialBar, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const MEAL_TYPES = [
  { id: 'breakfast', name: 'الإفطار', icon: Sun },
  { id: 'lunch', name: 'الغداء', icon: Coffee },
  { id: 'dinner', name: 'العشاء', icon: Moon },
  { id: 'snacks', name: 'وجبات خفيفة', icon: Apple },
];

export default function NutritionPage() {
  const { user } = useAuth();
  const [expanded, setExpanded] = useState('lunch');
  const [showModal, setShowModal] = useState(false);
  const [activeMealType, setActiveMealType] = useState('lunch');
  const [meals, setMeals] = useState({ breakfast: [], lunch: [], dinner: [], snacks: [] });
  const [weeklyData, setWeeklyData] = useState([]);
  const [search, setSearch] = useState('');
  const [newFood, setNewFood] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '' });
  const [saving, setSaving] = useState(false);
  const today = new Date().toISOString().split('T')[0];

  const fetchMeals = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('meal_logs')
      .select('*')
      .eq('user_id', user.id)
      .eq('logged_at', today);
    const grouped = { breakfast: [], lunch: [], dinner: [], snacks: [] };
    (data || []).forEach(m => { if (grouped[m.meal_type]) grouped[m.meal_type].push(m); });
    setMeals(grouped);
  };

  const fetchWeekly = async () => {
    if (!user) return;
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - 6 + i);
      return d.toISOString().split('T')[0];
    });
    const { data } = await supabase
      .from('meal_logs')
      .select('logged_at, protein, carbs, fat')
      .eq('user_id', user.id)
      .in('logged_at', days);
    setWeeklyData(days.map(day => {
      const dayMeals = (data || []).filter(m => m.logged_at === day);
      const d = new Date(day);
      return {
        name: d.toLocaleDateString('en', { weekday: 'short' }).charAt(0),
        p: dayMeals.reduce((s, m) => s + (m.protein || 0), 0),
        c: dayMeals.reduce((s, m) => s + (m.carbs || 0), 0),
        f: dayMeals.reduce((s, m) => s + (m.fat || 0), 0),
      };
    }));
  };

  useEffect(() => { fetchMeals(); fetchWeekly(); }, [user, today]);

  const addFood = async () => {
    if (!newFood.name || saving) return;
    setSaving(true);
    await supabase.from('meal_logs').insert({
      user_id: user.id,
      meal_type: activeMealType,
      food_name: newFood.name,
      calories: parseInt(newFood.calories) || 0,
      protein: parseFloat(newFood.protein) || 0,
      carbs: parseFloat(newFood.carbs) || 0,
      fat: parseFloat(newFood.fat) || 0,
      logged_at: today,
    });
    setNewFood({ name: '', calories: '', protein: '', carbs: '', fat: '' });
    setShowModal(false);
    setSaving(false);
    fetchMeals(); fetchWeekly();
  };

  const allMeals = Object.values(meals).flat();
  const totalCal = allMeals.reduce((s, m) => s + (m.calories || 0), 0);
  const totalProt = allMeals.reduce((s, m) => s + (m.protein || 0), 0);
  const totalCarbs = allMeals.reduce((s, m) => s + (m.carbs || 0), 0);
  const totalFat = allMeals.reduce((s, m) => s + (m.fat || 0), 0);

  const caloriesGoal = 1800;
  const radialData = [
    { name: 'كارب', value: Math.min(Math.round((totalCarbs / 200) * 100), 100), fill: '#A64B62' },
    { name: 'دهون', value: Math.min(Math.round((totalFat / 60) * 100), 100), fill: '#C68B59' },
    { name: 'بروتين', value: Math.min(Math.round((totalProt / 60) * 100), 100), fill: '#7C6A96' },
  ];

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - 3 + i);
    return { dayName: d.toLocaleDateString('ar-DZ', { weekday: 'short' }), date: d.getDate(), isToday: i === 3 };
  });

  return (
    <div className="pb-12 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
      <div className="flex-1 space-y-8">
        {/* Date Strip */}
        <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-dark/5">
          {days.map((d, i) => (
            <div key={i} className={`flex flex-col items-center justify-center w-12 h-16 rounded-lg cursor-pointer transition-all ${d.isToday ? 'bg-primary text-white shadow-md' : 'hover:bg-secondary text-text-muted hover:text-dark'}`}>
              <span className="text-[10px] font-bold mb-0.5 opacity-70 uppercase tracking-tighter">{d.dayName}</span>
              <span className={`text-lg font-bold ${d.isToday ? 'text-white' : 'text-dark'}`}>{d.date}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-display font-bold text-dark mb-2">وجبات اليوم</h1>
            <p className="text-text-muted font-bold">سجّلتِ {allMeals.length} أطعمة بمجموع {totalCal} سعرة</p>
          </div>
        </div>

        {/* Meals Accordion */}
        <div className="space-y-4">
          {MEAL_TYPES.map(meal => (
            <Card key={meal.id} variant="solid" className="overflow-hidden border-none shadow-sm">
              <div
                className={`p-6 flex justify-between items-center cursor-pointer transition-colors ${expanded === meal.id ? 'bg-primary/5' : 'bg-white hover:bg-neutral/50'}`}
                onClick={() => setExpanded(expanded === meal.id ? null : meal.id)}
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-white shadow-sm border border-neutral text-primary rounded-2xl flex items-center justify-center">
                    <meal.icon size={26} />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-dark mb-1">{meal.name}</h3>
                    <p className="text-sm text-text-muted font-bold">
                      {meals[meal.id].reduce((s, m) => s + (m.calories || 0), 0)} سعرة
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={e => { e.stopPropagation(); setActiveMealType(meal.id); setShowModal(true); }}
                    className="p-3 bg-white shadow-sm border border-neutral text-primary rounded-full hover:bg-primary hover:text-white transition-all outline-none"
                  >
                    <Plus size={20} />
                  </button>
                  <ChevronDown size={24} className={`text-text-muted transition-transform duration-300 ${expanded === meal.id ? 'rotate-180 text-primary' : ''}`} />
                </div>
              </div>
              <AnimatePresence>
                {expanded === meal.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-neutral/20 border-t border-primary/5">
                    <div className="p-6 space-y-3">
                      {meals[meal.id].length === 0 ? (
                        <p className="text-center text-text-muted font-medium py-4">لم تسجلي طعاماً بعد</p>
                      ) : meals[meal.id].map(item => (
                        <div key={item.id} className="flex justify-between items-center p-4 bg-white rounded-2xl shadow-sm border border-neutral/50 group hover:border-primary/20 transition-colors">
                          <div>
                            <h4 className="font-bold text-dark text-lg">{item.food_name}</h4>
                            <div className="text-xs text-text-muted mt-1 font-bold">
                              {item.protein}غ بروتين / {item.carbs}غ كارب / {item.fat}غ دهون
                            </div>
                          </div>
                          <div className="font-display font-bold text-primary text-xl">{item.calories} <span className="text-sm text-text-muted">سعرة</span></div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          ))}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-full lg:w-[350px] space-y-6 lg:mt-24">
        <Card variant="glass" className="p-8 bg-white/80 border-white/80 sticky top-28 shadow-xl shadow-primary/5">
          <h3 className="font-bold text-xl text-dark mb-8 text-center">ملخص المغذيات</h3>
          <div className="relative w-56 h-56 mx-auto mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart innerRadius="65%" outerRadius="100%" barSize={10} data={radialData} startAngle={90} endAngle={-270}>
                <RadialBar background={{ fill: '#F2EBE9' }} clockWise dataKey="value" cornerRadius={10} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] text-text-muted font-bold mb-0.5 uppercase tracking-widest">متبقي</span>
              <span className="text-4xl font-display font-bold text-dark">{Math.max(caloriesGoal - totalCal, 0)}</span>
            </div>
          </div>
          <div className="space-y-5">
            {[
              { n: 'كربوهيدرات', curr: totalCarbs, max: 200, col: 'bg-primary' },
              { n: 'بروتين', curr: totalProt, max: 60, col: 'bg-accent' },
              { n: 'دهون صحية', curr: totalFat, max: 60, col: 'bg-warning' },
            ].map(m => (
              <div key={m.n}>
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span className="text-dark">{m.n}</span>
                  <span className="text-text-muted">{m.curr} / <span className="text-dark">{m.max}غ</span></span>
                </div>
                <div className="h-2 w-full bg-neutral rounded-full overflow-hidden shadow-inner">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((m.curr / m.max) * 100, 100)}%` }} transition={{ duration: 1 }} className={`h-full rounded-full ${m.col}`} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card variant="solid" className="p-6 border-none shadow-sm">
          <h3 className="font-bold mb-6 text-dark text-lg">تحليل الأسبوع</h3>
          <div className="h-48 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} stackOffset="sign">
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#7A6F70', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'rgba(31,26,27,0.03)' }} contentStyle={{ borderRadius: '16px', border: 'none' }} />
                <Bar dataKey="p" stackId="a" fill="#7C6A96" radius={[0, 0, 4, 4]} />
                <Bar dataKey="f" stackId="a" fill="#C68B59" />
                <Bar dataKey="c" stackId="a" fill="#A64B62" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Add Food Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/40 backdrop-blur-sm"
            onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()} className="w-full max-w-xl">
              <Card variant="solid" className="p-8 bg-white border-white">
                <h2 className="text-3xl font-display font-bold text-dark mb-6">إضافة طعام</h2>
                <div className="space-y-4">
                  <Input icon={Search} placeholder="اسم الطعام..." value={newFood.name}
                    onChange={e => setNewFood(p => ({ ...p, name: e.target.value }))} />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="سعرات حرارية" type="number" placeholder="0"
                      value={newFood.calories} onChange={e => setNewFood(p => ({ ...p, calories: e.target.value }))} />
                    <Input label="بروتين (غ)" type="number" placeholder="0"
                      value={newFood.protein} onChange={e => setNewFood(p => ({ ...p, protein: e.target.value }))} />
                    <Input label="كربوهيدرات (غ)" type="number" placeholder="0"
                      value={newFood.carbs} onChange={e => setNewFood(p => ({ ...p, carbs: e.target.value }))} />
                    <Input label="دهون (غ)" type="number" placeholder="0"
                      value={newFood.fat} onChange={e => setNewFood(p => ({ ...p, fat: e.target.value }))} />
                  </div>
                  <button onClick={addFood} disabled={!newFood.name || saving}
                    className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary/90 transition-colors disabled:opacity-50">
                    {saving ? 'جاري الحفظ...' : 'إضافة الطعام'}
                  </button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

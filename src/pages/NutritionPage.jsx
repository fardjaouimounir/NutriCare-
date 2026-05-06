import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus, Info, Apple, Coffee, Moon, Sun, Search } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { RadialBarChart, RadialBar, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';

export default function NutritionPage() {
  const [expanded, setExpanded] = useState('lunch');
  const [showModal, setShowModal] = useState(false);

  const days = Array.from({length: 7}, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 3 + i);
    return { 
       dayName: d.toLocaleDateString('ar-DZ', { weekday: 'short' }), 
       date: d.getDate(), 
       isToday: i === 3 
    };
  });

  const meals = [
    { id: 'breakfast', name: 'الإفطار', icon: Sun, calories: 350, items: [
      { name: 'شوفان بالحليب والمكسرات', cal: 350, macros: '15p / 45c / 12f' }
    ]},
    { id: 'lunch', name: 'الغداء', icon: Coffee, calories: 520, items: [
      { name: 'سلطة كينوا', cal: 210, macros: '12p / 25c / 8f' },
      { name: 'دجاج مشوي 150غ', cal: 240, macros: '45p / 0c / 5f' },
      { name: 'عصير برتقال', cal: 70, macros: '1p / 15c / 0f' },
    ]},
    { id: 'dinner', name: 'العشاء', icon: Moon, calories: 0 },
    { id: 'snacks', name: 'وجبات خفيفة', icon: Apple, calories: 120, items: [
      { name: 'حفنة لوز', cal: 120, macros: '4p / 4c / 10f' }
    ]},
  ];

  const chartData = [
    { name: 'M', p: 45, c: 120, f: 30 }, { name: 'T', p: 50, c: 130, f: 35 }, 
    { name: 'W', p: 60, c: 110, f: 40 }, { name: 'T', p: 55, c: 140, f: 32 }, 
    { name: 'F', p: 50, c: 125, f: 30 }, { name: 'S', p: 65, c: 110, f: 45 }, { name: 'S', p: 0, c: 0, f: 0 }
  ];

  return (
    <div className="pb-12 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
      {/* Left Column (Main) */}
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

        {/* Header */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-display font-bold text-dark mb-2">وجبات اليوم</h1>
            <p className="text-text-muted font-bold">سجلت {4} أطعمة اليوم بمجموع 990 سعرة</p>
          </div>
        </div>

        {/* Meals Accordion */}
        <div className="space-y-4 relative z-10">
          {meals.map(meal => (
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
                     <p className="text-sm text-text-muted font-bold">{meal.calories} سعرة حرارية</p>
                   </div>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={(e) => { e.stopPropagation(); setShowModal(true); }} className="p-3 bg-white shadow-sm border border-neutral text-primary rounded-full hover:bg-primary hover:text-white transition-all outline-none">
                    <Plus size={20} />
                  </button>
                  <ChevronDown size={24} className={`text-text-muted transition-transform duration-300 ${expanded === meal.id ? 'rotate-180 text-primary' : ''}`} />
                </div>
              </div>
              
              <AnimatePresence>
                {expanded === meal.id && meal.items && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-neutral/20 border-t border-primary/5">
                     <div className="p-6 space-y-3">
                       {meal.items.map((item, idx) => (
                         <div key={idx} className="flex justify-between items-center p-4 bg-white rounded-2xl shadow-sm border border-neutral/50 group hover:border-primary/20 transition-colors">
                            <div>
                               <h4 className="font-bold text-dark text-lg group-hover:text-primary transition-colors">{item.name}</h4>
                               <div className="text-xs text-text-muted mt-1 font-bold">{item.macros}</div>
                            </div>
                            <div className="font-display font-bold text-primary text-xl">{item.cal} <span className="text-sm font-ui text-text-muted">سعرة</span></div>
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

      {/* Right Column (Sidebar) */}
      <div className="w-full lg:w-[350px] space-y-6 lg:mt-24">
        {/* Daily Summary */}
        <Card variant="glass" className="p-8 bg-white/80 border-white/80 sticky top-28 shadow-xl shadow-primary/5">
           <h3 className="font-bold text-xl text-dark mb-8 text-center">ملخص المغذيات</h3>
           
           <div className="relative w-56 h-56 mx-auto mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart innerRadius="65%" outerRadius="100%" barSize={10} data={[
                  {name: 'Carbs', value: 120, fill: '#A64B62'},
                  {name: 'Fat', value: 45, fill: '#C68B59'},
                  {name: 'Protein', value: 90, fill: '#7C6A96'}
                ]} startAngle={90} endAngle={-270}>
                  <RadialBar background={{ fill: '#F2EBE9' }} clockWise dataKey="value" cornerRadius={10} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <span className="text-[10px] text-text-muted font-bold mb-0.5 uppercase tracking-widest">متبقي</span>
                 <span className="text-4xl font-display font-bold text-dark">810</span>
              </div>
           </div>

           <div className="space-y-5">
              {[
                { n: 'كربوهيدرات', curr: 120, max: 200, col: 'bg-primary' },
                { n: 'بروتين', curr: 90, max: 120, col: 'bg-accent' },
                { n: 'دهون صحية', curr: 45, max: 60, col: 'bg-warning' },
              ].map(m => (
                <div key={m.n}>
                  <div className="flex justify-between text-sm font-bold mb-2">
                    <span className="text-dark">{m.n}</span>
                    <span className="text-text-muted">{m.curr} / <span className="text-dark">{m.max}غ</span></span>
                  </div>
                  <div className="h-2 w-full bg-neutral rounded-full overflow-hidden shadow-inner">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(m.curr/m.max)*100}%` }} transition={{ duration: 1 }} className={`h-full rounded-full ${m.col}`}></motion.div>
                  </div>
                </div>
              ))}
           </div>
        </Card>

        {/* Weekly Chart */}
        <Card variant="solid" className="p-6 border-none shadow-sm">
          <h3 className="font-bold mb-6 text-dark text-lg">تحليل الأسبوع</h3>
          <div className="h-48 -mx-2">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={chartData} stackOffset="sign">
                  <XAxis dataKey="name" tick={{fontSize: 12, fill: '#7A6F70', fontWeight: 'bold'}} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: 'rgba(31, 26, 27, 0.03)'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 8px 32px rgba(31, 26, 27, 0.08)'}} />
                  <Bar dataKey="p" stackId="a" fill="#7C6A96" radius={[0,0,4,4]} />
                  <Bar dataKey="f" stackId="a" fill="#C68B59" />
                  <Bar dataKey="c" stackId="a" fill="#A64B62" radius={[4,4,0,0]} />
               </BarChart>
             </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Add Food Modal placeholder */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/40 backdrop-blur-sm" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} onClick={e => e.stopPropagation()} className="w-full max-w-xl">
               <Card variant="solid" className="p-8 bg-white border-white">
                 <h2 className="text-3xl font-display font-bold text-dark mb-6">إضافة طعام</h2>
                 <Input icon={Search} placeholder="ابحثي عن طعام أو وصفة جزائرية..." className="mb-6" />
                 <div className="bg-neutral/50 rounded-2xl p-8 text-center">
                    <Search size={48} className="mx-auto text-text-muted/50 mb-4" />
                    <p className="text-text-muted font-bold text-lg mb-2">ماذا أكلتِ اليوم؟</p>
                    <p className="text-sm font-medium text-text-muted">ابدئي الكتابة للبحث في قاعدة البيانات المخصصة لدينا.</p>
                 </div>
               </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RadialBarChart, RadialBar, ResponsiveContainer, AreaChart, Area, Tooltip as RechartsTooltip } from 'recharts';
import { Card } from '../components/ui/Card';
import { Bell, Plus, CheckCircle2, Circle, Flame, Droplet, Dumbbell, ArrowLeft } from 'lucide-react';

const macroData = [
  { name: 'Calories', value: 45, fill: '#A64B62' }, // Primary Rose
  { name: 'Protein', value: 65, fill: '#7C6A96' },  // Accent Lavender
  { name: 'Water', value: 80, fill: '#5C8BAD' },    // Muted Blue
];

const weightData = [
  { day: '1', weight: 65 }, { day: '2', weight: 64.8 }, { day: '3', weight: 64.9 }, 
  { day: '4', weight: 64.5 }, { day: '5', weight: 64.2 }, { day: '6', weight: 64.0 },
];

const reminders = [
  { id: 1, text: 'موعد دواء الغدة', time: '08:00 AM', done: true },
  { id: 2, text: 'شرب كوب ماء', time: '10:30 AM', done: false },
  { id: 3, text: 'استراحة قصيرة للتنفس', time: '02:00 PM', done: false },
];

export default function DashboardPage() {
  const [mood, setMood] = useState(null);
  const [remindersList, setRemindersList] = useState(reminders);
  const [water, setWater] = useState(60); 

  const toggleReminder = (id) => {
    setRemindersList(prev => prev.map(r => r.id === id ? { ...r, done: !r.done } : r));
  };

  return (
    <div className="pb-24 lg:pb-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-6 bg-white p-6 rounded-xl shadow-sm border border-dark/5">
        <div>
          <h1 className="text-2xl font-display font-bold text-dark mb-1 ml-2">صباح الخير يا بشرى</h1>
          <p className="text-text-muted font-bold tracking-widest uppercase text-[10px] opacity-70">
            {document.documentElement.lang === 'ar' 
              ? <span className="force-ltr inline-block">الاحد 12 افريل 2026</span> 
              : <span className="force-ltr inline-block">Sunday, April 12, 2026</span>}
          </p>
        </div>
        <button className="relative w-10 h-10 flex items-center justify-center bg-secondary rounded-lg text-dark hover:text-primary transition-colors focus:ring-2 focus:ring-primary/10">
          <Bell size={18} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
        </button>
      </header>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Macros */}
        <Card variant="glass" className="p-6 bg-white/70 h-[380px] flex flex-col">
          <h3 className="font-bold mb-4 flex items-center gap-2 text-dark text-xl"><Flame className="text-accent" /> ملخص اليوم</h3>
          <div className="flex-1 -mx-4 -mt-4 relative">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="40%" outerRadius="100%" barSize={16} data={macroData} startAngle={90} endAngle={-270}>
                <RadialBar minAngle={15} background clockWise dataKey="value" cornerRadius={10} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
              <span className="text-3xl font-bold text-dark">45%</span>
              <span className="text-sm font-semibold text-text-muted">مكتمل</span>
            </div>
          </div>
          <div className="flex justify-between mt-2 pt-4 border-t border-primary/10 text-sm font-bold">
            <span className="text-primary flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary" />سعرات 45%</span>
            <span className="text-accent flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent" />بروتين 65%</span>
            <span className="text-blue-500 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" />ماء 80%</span>
          </div>
        </Card>

        {/* Card 2: Mood */}
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
          <div>
            <div className="flex justify-between text-sm font-bold text-text-dark mb-3">
              <span>مستوى التعب</span>
              <span className="text-primary">متوسط</span>
            </div>
            <input type="range" className="w-full accent-primary h-2 bg-neutral rounded-full appearance-none" min="1" max="10" defaultValue="4" />
          </div>
        </Card>

        {/* Card 3: Hydration */}
        <Card variant="glass" className="p-6 bg-white/70 flex flex-col items-center justify-between h-[380px]">
           <div className="w-full flex justify-between items-center mb-2">
             <h3 className="font-bold text-xl text-dark flex items-center gap-2"><Droplet size={24} className="text-blue-500" /> هدف الترطيب</h3>
           </div>
           
           <div className="relative w-32 h-48 mt-4 border-4 border-blue-100 rounded-b-3xl rounded-t-lg overflow-hidden shadow-inner bg-white/50">
              <div className="absolute top-0 left-[25%] right-[25%] h-5 bg-white border-b-4 border-l-4 border-r-4 border-blue-100 rounded-b-lg shadow-sm z-10" />
              {/* Background fill */}
              <motion.div 
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 to-blue-300 opacity-80"
                initial={{ height: 0 }}
                animate={{ height: `${water}%` }}
                transition={{ duration: 1.5, type: 'spring' }}
              />
              {/* Animated wave effect (visual) */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNDQwIDMyMCI+CjxwYXRoIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4yIiBkPSJNMCAyMjRMMDQwIDE5MkM4MCAxNjAgMTYwIDk2IDI0MCA2NEMzMjAgMzIgNDAwIDMyIDQ4MCA4QzU2MCAtMTYgNjQwIC0xNiA3MjAgMTZDODAwIDQ4IDg4MCAxMTIgOTYwIDE2MEMxMDQwIDIwOCAxMTIwIDI0MCAxMjAwIDI1NkMxMjgwIDI3MiAxMzYwIDI4OCAxNDAwIDE5MkwxNDQwIDk2TDE0NDAgMzIwTDE0MDAgMzIwQzEzNjAgMzIwIDEyODAgMzIwIDEyMDAgMzIwQzExMjAgMzIwIDEwNDAgMzIwIDk2MCAzMjBDODgwIDMyMCA4MDAgMzIwIDcyMCAzMjBDNjQwIDMyMCA1NjAgMzIwIDQ4MCAzMjBDNDAwIDMyMCAzMjAgMzIwIDI0MCAzMjBDMTYwIDMyMCA4MCAzMjAgNDAgMzIwTDAgMzIwWiI+PC9wYXRoPgo8L3N2Zz4=')] bg-cover opacity-30 animate-pulse mix-blend-overlay pointer-events-none" style={{ backgroundPosition: `0 ${100-water}%` }} />
           </div>
           
           <div className="text-center mt-4">
             <p className="font-display font-bold text-2xl text-blue-600">{water * 20} <span className="text-sm text-text-muted">/ 2000 مل</span></p>
           </div>
           
           <div className="flex gap-3 mt-4 w-full justify-center">
             <button onClick={() => setWater(w => Math.min(w + 12.5, 100))} className="flex items-center gap-1 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full font-semibold transition-colors outline-none focus:ring-2 focus:ring-blue-300">
               <Plus size={18} /> 250 مل
             </button>
           </div>
        </Card>

        {/* Card 4: Next Meal */}
        <Card variant="solid" className="overflow-hidden md:col-span-2 lg:col-span-1 h-[280px] group cursor-pointer">
          <div className="relative h-40 bg-[url('https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=600&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent" />
            <div className="absolute bottom-4 right-4 text-white font-bold text-lg">الغداء</div>
            <div className="absolute top-4 left-4 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold font-display">بعد ساعتين</div>
          </div>
          <div className="p-5 flex flex-col justify-between flex-1 bg-white">
            <h3 className="font-bold text-lg text-dark mb-1 group-hover:text-primary transition-colors">سلطة كينوا مع خضار مشوية</h3>
            <div className="flex gap-2 mt-auto pt-4 border-t border-dark/5">
              <span className="px-2 py-1 bg-secondary text-dark/70 rounded text-[10px] font-bold">450 سعرة</span>
              <span className="px-2 py-1 bg-secondary text-dark/70 rounded text-[10px] font-bold">30غ بروتين</span>
            </div>
          </div>
        </Card>

        {/* Card 5: Weight Trend */}
        <Card variant="glass" className="p-6 h-[280px] flex flex-col">
          <h3 className="font-bold mb-6 flex items-center gap-2 text-xl text-dark italic font-display">مسار الوزن مؤخراً</h3>
          <div className="flex-1 -mx-4 -mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weightData}>
                <defs>
                   <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#A64B62" stopOpacity={0.1}/>
                     <stop offset="95%" stopColor="#A64B62" stopOpacity={0}/>
                   </linearGradient>
                </defs>
                <RechartsTooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 8px 32px rgba(31, 26, 27, 0.08)' }} />
                <Area type="monotone" dataKey="weight" stroke="#A64B62" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Card 6: Reminders */}
        <Card variant="glass" className="p-6 bg-white/70 h-[280px] flex flex-col">
          <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-xl text-dark">تذكيراتك اليوم</h3>
             <button className="text-sm font-bold text-primary hover:underline">عرض الكل</button>
          </div>
          <div className="space-y-3 overflow-y-auto pr-1 no-scrollbar flex-1">
            {remindersList.map(r => (
              <div key={r.id} className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-neutral/50 group hover:border-primary/30 transition-colors">
                <button onClick={() => toggleReminder(r.id)} className="outline-none focus:ring-2 focus:ring-primary rounded-full">
                  {r.done ? <CheckCircle2 className="text-success" /> : <Circle className="text-text-muted group-hover:text-primary" />}
                </button>
                <div className={`flex-1 overflow-hidden text-ellipsis whitespace-nowrap ${r.done ? 'line-through text-text-muted' : 'text-dark font-semibold'}`}>
                  {r.text}
                </div>
                <div className="text-xs font-bold text-text-muted bg-neutral px-2 py-1 rounded-md">{r.time}</div>
              </div>
            ))}
          </div>
        </Card>

      </div>

      {/* FAB */}
      <div className="fixed bottom-6 rtl:left-6 ltr:right-6 lg:rtl:left-12 lg:ltr:right-12 z-40">
         <button className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center shadow-xl shadow-primary/20 hover:scale-105 transition-all focus:ring-2 focus:ring-primary/30">
           <Plus size={24} />
         </button>
      </div>
    </div>
  );
}

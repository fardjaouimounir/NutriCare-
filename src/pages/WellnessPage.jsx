import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, CartesianGrid } from 'recharts';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LineChart as ChartIcon, Calendar, ArrowUpRight, ArrowDownRight, Target } from 'lucide-react';

// Mock Data
const weeklyTrend = [
  { day: 'Mon', active: 30, mood: 2, weight: 64.9, fatigue: 4 },
  { day: 'Tue', active: 45, mood: 3, weight: 64.7, fatigue: 3 },
  { day: 'Wed', active: 20, mood: 1, weight: 64.8, fatigue: 6 },
  { day: 'Thu', active: 60, mood: 4, weight: 64.5, fatigue: 2 },
  { day: 'Fri', active: 30, mood: 2, weight: 64.4, fatigue: 5 },
  { day: 'Sat', active: 50, mood: 3, weight: 64.3, fatigue: 4 },
  { day: 'Sun', active: 40, mood: 3, weight: 64.2, fatigue: 3 }
];

const adherenceData = [
  { name: 'Calories', val: 85, fill: '#A64B62' },
  { name: 'Protein', val: 90, fill: '#7C6A96' },
  { name: 'Hydration', val: 75, fill: '#5E6D7E' },
  { name: 'Meds', val: 100, fill: '#4A7C59' },
];

export default function WellnessPage() {
  const [filter, setFilter] = useState('1W');

  return (
    <div className="pb-12 max-w-7xl mx-auto pt-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold text-dark mb-2 flex items-center gap-3">
            <ChartIcon className="text-primary mt-1" size={32} /> تطورك عبر الزمن
          </h1>
          <p className="text-text-muted font-bold text-lg">تحليلات مفصلة لصحتك ونشاطك.</p>
        </div>
        <div className="flex bg-white/60 p-1 rounded-full shadow-sm border border-white">
          {['1W', '1M', '3M', '6M'].map(f => (
            <button 
              key={f} 
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-full font-bold text-sm transition-all outline-none ${filter === f ? 'bg-primary text-white shadow-md' : 'text-text-muted hover:text-dark hover:bg-white'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'متوسط الوزن', val: '64.5 كغ', trend: -0.4, good: true },
          { label: 'متوسط المزاج', val: 'جيد (3.5)', trend: 0.5, good: true },
          { label: 'الالتزام الغذائي', val: '87%', trend: 2.1, good: true },
          { label: 'معدل التعب', val: '3.8 / 10', trend: -1.2, good: true },
        ].map((s, i) => (
          <Card key={i} variant="glass" className="p-6 bg-white/80 border-white">
            <div className="text-sm font-bold text-text-muted mb-2">{s.label}</div>
            <div className="text-3xl font-display font-bold text-dark mb-4">{s.val}</div>
            <div className={`text-sm font-bold flex items-center gap-1 ${s.good ? 'text-success' : 'text-warning'}`}>
               {s.trend > 0 ? <ArrowUpRight size={16}/> : <ArrowDownRight size={16}/>}
               {Math.abs(s.trend)}% مقارنة بالفترة السابقة
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart - Weight Area */}
        <Card variant="glass" className="p-8 bg-white/80 border-white lg:col-span-2 shadow-glass">
           <h3 className="font-bold text-xl text-dark mb-6">مسار الوزن</h3>
           <div className="h-80 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={weeklyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                 <defs>
                   <linearGradient id="curveColor" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#A64B62" stopOpacity={0.2}/>
                     <stop offset="95%" stopColor="#A64B62" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(26, 28, 30, 0.04)" />
                 <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#6C757D', fontWeight: 'bold'}} />
                 <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }} />
                 <Area type="monotone" dataKey="weight" stroke="#A64B62" strokeWidth={3} fillOpacity={1} fill="url(#curveColor)" />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </Card>

        {/* Adherence Radial Bar */}
        <Card variant="glass" className="p-8 bg-white/80 border-white flex flex-col shadow-glass">
            <h3 className="font-bold text-xl text-dark mb-8 text-center flex items-center justify-center gap-2"><Target size={20} className="text-success"/> الالتزام بالأهداف</h3>
            <div className="flex-1 flex flex-col justify-center gap-6">
               {adherenceData.map(d => (
                 <div key={d.name}>
                    <div className="flex justify-between text-sm font-bold mb-2">
                       <span className="text-dark">{d.name}</span>
                       <span className="text-text-muted">{d.val}%</span>
                    </div>
                    <div className="h-3 w-full bg-neutral rounded-full overflow-hidden shadow-inner">
                       <motion.div initial={{ width: 0 }} animate={{ width: `${d.val}%` }} transition={{ duration: 1 }} className="h-full rounded-full" style={{ backgroundColor: d.fill }} />
                    </div>
                 </div>
               ))}
            </div>
            <Button variant="ghost" className="w-full mt-8">تصدير التقرير (PDF)</Button>
        </Card>

        {/* Fatigue Bar Chart */}
        <Card variant="solid" className="p-6 border-none shadow-sm lg:col-span-1">
           <h3 className="font-bold text-lg text-dark mb-6">مستويات التعب الجسدي</h3>
           <div className="h-56 -mx-2">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={weeklyTrend}>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6C757D', fontWeight: 'bold'}} />
                    <Tooltip cursor={{fill: 'rgba(26, 28, 30, 0.04)'}} />
                    <Bar dataKey="fatigue" fill="#7C6A96" radius={[4, 4, 4, 4]} barSize={30} />
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </Card>

        {/* Mood Step Line Chart */}
        <Card variant="solid" className="p-6 border-none shadow-sm lg:col-span-2">
           <h3 className="font-bold text-lg text-dark mb-6">تقلبات المزاج</h3>
           <div className="h-56 -mx-2">
              <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={weeklyTrend}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(26, 28, 30, 0.04)" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6C757D', fontWeight: 'bold'}} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }} />
                    <Line type="stepAfter" dataKey="mood" stroke="#C68B59" strokeWidth={3} dot={{ r: 4, fill: '#C68B59', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                 </LineChart>
              </ResponsiveContainer>
           </div>
           <div className="flex justify-between text-xs text-text-muted font-bold px-6 border-t border-dark/5 pt-4">
              <span>😔 سيء جداً (0)</span>
              <span>😐 عادي (2)</span>
              <span>😊 ممتاز (4)</span>
           </div>
        </Card>

      </div>
    </div>
  );
}

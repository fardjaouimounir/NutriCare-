import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Droplet, Plus, History } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const historyData = [
  { day: 'Sat', amount: 1500 }, { day: 'Sun', amount: 1800 }, 
  { day: 'Mon', amount: 2000 }, { day: 'Tue', amount: 1200 }, 
  { day: 'Wed', amount: 1600 }, { day: 'Thu', amount: 2100 }, 
  { day: 'Fri', amount: 800 } // current day
];

export default function HydrationPage() {
  const target = 2000;
  const [current, setCurrent] = useState(800);

  const addWater = (amount) => {
    setCurrent(prev => Math.min(prev + amount, target * 1.5));
  };

  const fillPercentage = Math.min((current / target) * 100, 100);

  return (
    <div className="pb-12 max-w-5xl mx-auto flex flex-col md:flex-row gap-8 items-center md:items-start pt-10">
      
      {/* Left side: Visualizer */}
      <div className="flex-1 w-full flex flex-col items-center">
         <h1 className="text-4xl font-display font-bold text-dark mb-2 text-center md:text-right w-full">تتبع الترطيب</h1>
         <p className="text-text-muted font-bold text-center md:text-right w-full mb-12">حافظي على رطوبة جسمك خلال مراحل العلاج المختلفة.</p>
         
         <div className="relative mb-12">
            {/* The SVG Bottle outline */}
            <svg width="200" height="400" viewBox="0 0 200 400" className="drop-shadow-2xl z-20 relative mix-blend-multiply opacity-30">
               <path d="M60,0 C60,0 80,0 80,20 L80,50 L50,80 C30,100 20,150 20,200 L20,360 C20,380 40,400 60,400 L140,400 C160,400 180,380 180,360 L180,200 C180,150 170,100 150,80 L120,50 L120,20 C120,0 140,0 140,0 Z" fill="none" stroke="#2563eb" strokeWidth="8" strokeLinejoin="round"/>
            </svg>
            
            {/* The clipping mask to shape the fill */}
            <div className="absolute inset-0 z-10 overflow-hidden" style={{ clipPath: 'path("M60,0 C60,0 80,0 80,20 L80,50 L50,80 C30,100 20,150 20,200 L20,360 C20,380 40,400 60,400 L140,400 C160,400 180,380 180,360 L180,200 C180,150 170,100 150,80 L120,50 L120,20 C120,0 140,0 140,0 Z")' }}>
               <motion.div 
                 className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-600 to-blue-300"
                 initial={{ height: 0 }}
                 animate={{ height: `${fillPercentage}%` }}
                 transition={{ type: 'spring', damping: 20 }}
               >
                 {/* Internal wave graphic */}
                 <div className="absolute top-0 left-0 right-0 h-10 -mt-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNDQwIDMyMCI+CjxwYXRoIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC40KSIgZmlsbC1vcGFjaXR5PSIxIiBkPSJNMCAyMjRMMDQwIDE5MkM4MCAxNjAgMTYwIDk2IDI0MCA2NEMzMjAgMzIgNDAwIDMyIDQ4MCA4QzU2MCAtMTYgNjQwIC0xNiA3MjAgMTZDODAwIDQ4IDg4MCAxMTIgOTYwIDE2MEMxMDQwIDIwOCAxMTIwIDI0MCAxMjAwIDI1NkMxMjgwIDI3MiAxMzYwIDI4OCAxNDAwIDE5MkwxNDQwIDk2TDE0NDAgMzIwTDE0MDAgMzIwQzEzNjAgMzIwIDEyODAgMzIwIDEyMDAgMzIwQzExMjAgMzIwIDEwNDAgMzIwIDk2MCAzMjBDODgwIDMyMCA4MDAgMzIwIDcyMCAzMjBDNjQwIDMyMCA1NjAgMzIwIDQ4MCAzMjBDNDAwIDMyMCAzMjAgMzIwIDI0MCAzMjBDMTYwIDMyMCA4MCAzMjAgNDAgMzIwTDAgMzIwWiI+PC9wYXRoPgo8L3N2Zz4=')] animate-[float_4s_ease-in-out_infinite] bg-cover opacity-80" />
               </motion.div>
            </div>
            
            {/* The Text Overlay */}
            <div className="absolute inset-0 z-30 flex items-center justify-center flex-col pointer-events-none mt-20">
               <motion.span 
                 key={current}
                 initial={{ scale: 1.5, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 className="text-4xl font-display font-bold text-dark drop-shadow-md mix-blend-overlay"
               >
                 {current} <span className="text-lg">مل</span>
               </motion.span>
               <span className="text-sm font-bold text-dark/70 bg-white/40 px-2 rounded-full backdrop-blur-md">الهدف: {target} مل</span>
            </div>
         </div>

         <div className="text-center bg-white/60 p-4 rounded-2xl shadow-sm border border-white">
            <h3 className="font-bold text-dark mb-4 text-lg">إضافة سريعة</h3>
            <div className="grid grid-cols-3 gap-3">
               {[
                 { val: 150, label: 'كوب صغير' },
                 { val: 250, label: 'كوب كبير' },
                 { val: 500, label: 'قارورة' }
               ].map((b, i) => (
                 <button 
                   key={b.val} 
                   onClick={() => addWater(b.val)}
                   className="flex flex-col items-center justify-center bg-blue-50 text-blue-600 p-3 rounded-xl border border-blue-100 hover:bg-blue-600 hover:text-white transition-colors group shadow-sm outline-none focus:ring-2 focus:ring-blue-300"
                 >
                    <Plus size={20} className="mb-1" />
                    <span className="font-bold">{b.val}</span>
                 </button>
               ))}
            </div>
         </div>
      </div>

      {/* Right side: Charts and History */}
      <div className="w-full md:w-96 space-y-6 pt-12 md:pt-0">
         <Card variant="glass" className="p-6 bg-white/80">
            <h3 className="font-bold text-xl text-dark mb-6 flex items-center gap-2"><History className="text-blue-500" /> الأيام السبعة الماضية</h3>
            <div className="h-64 -mx-2">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={historyData}>
                   <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#9E7A85', fontWeight: 'bold'}} />
                   <Tooltip cursor={{fill: 'rgba(59, 130, 246, 0.1)'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)'}} />
                   {/* Reference Line for goal target could be added, but manual shape works too */}
                   <Bar dataKey="amount" fill="#3b82f6" radius={[6, 6, 6, 6]} barSize={24} />
                 </BarChart>
               </ResponsiveContainer>
            </div>
            <div className="mt-4 pt-4 border-t border-neutral text-center text-sm font-bold text-text-muted">
               <span className="text-blue-600 mr-2 inline-block">●</span>الهدف اليومي: 2000 مل
            </div>
         </Card>

         <Card variant="solid" className="p-6 bg-gradient-to-r from-blue-500 to-blue-400 text-white border-none text-center">
            <Droplet size={32} className="mx-auto mb-3 opacity-80" />
            <h3 className="font-display font-bold text-xl mb-2">نصيحة اليوم</h3>
            <p className="font-medium text-white/90 leading-relaxed text-sm">شرب الماء بكميات كافية يساعد في تقليل الآثار الجانبية للعلاج الكيميائي ويطرد السموم من جسمك. استمري هكذا!</p>
         </Card>
      </div>

    </div>
  );
}

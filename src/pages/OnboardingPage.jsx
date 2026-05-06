import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const screens = [
    {
      title: "أهدافك في مكان واحد",
      desc: "حددنا لك أهدافاً دقيقة تتناسب مع حالتك، يمكنك متابعتها خطوة بخطوة للوصول للتعافي.",
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=600&auto=format&fit=crop"
    },
    {
      title: "متابعة يومية لمشاعرك",
      desc: "صحتك النفسية لا تقل أهمية عن الجسدية، تتبعي حالتك باستمرار وسجلي أعراضك بسهولة.",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&auto=format&fit=crop"
    },
    {
      title: "وصفات جزائرية صحية",
      desc: "مئات الوصفات التي تحبينها، معدلة من قبل خبرائنا لتلائم متطلباتك الغذائية وفترة علاجك.",
      image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=600&auto=format&fit=crop"
    }
  ];

  const handleNext = () => {
    if (step < screens.length - 1) setStep(step + 1);
    else navigate('/dashboard');
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-neutral/95 backdrop-blur-xl">
      <div className="absolute top-8 right-8 rtl:left-8 rtl:right-auto cursor-pointer text-text-muted hover:text-primary font-bold z-20 text-sm transition-colors flex items-center gap-2" onClick={() => navigate('/dashboard')}>
        تخطي التعارف
      </div>
      
      <div className="w-full max-w-5xl p-6 relative z-10 flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.div 
            key={step}
            initial={{ opacity: 0, x: document.documentElement.dir === 'rtl' ? -50 : 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: document.documentElement.dir === 'rtl' ? 50 : -50, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center text-center w-full"
          >
             <div className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-[40px] overflow-hidden mb-12 border-8 border-white shadow-xl relative ring-1 ring-dark/5">
                <img src={screens[step].image} alt={screens[step].title} className="w-full h-full object-cover" />
             </div>
             <h2 className="text-3xl md:text-5xl font-display font-bold text-dark mb-6 tracking-tight">{screens[step].title}</h2>
             <p className="text-xl md:text-2xl text-text-muted max-w-2xl leading-relaxed">{screens[step].desc}</p>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center gap-6 mt-16 w-full justify-between max-w-2xl px-6">
          <div className="flex gap-2">
             {screens.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${step === i ? 'w-12 bg-primary' : 'w-4 bg-primary/10'}`} />
             ))}
          </div>
          <Button onClick={handleNext} className="w-40 lg:w-48 text-lg py-4 shadow-lg shadow-primary/20">
            {step === screens.length - 1 ? 'ابدئي الآن' : 'التالي'}
          </Button>
        </div>
      </div>
    </div>
  );
}

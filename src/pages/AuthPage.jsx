import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, User, Mail, Lock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const StepOne = ({ next }) => (
  <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} className="space-y-4">
    <Input label="الاسم الكامل" icon={User} placeholder="مثال: سارة أحمد" />
    <Input label="البريد الإلكتروني" type="email" icon={Mail} placeholder="sara@example.com" />
    <Input label="كلمة المرور" type="password" icon={Lock} placeholder="••••••••" />
    <div className="pt-4">
      <Button fullWidth onClick={next}>متابعة</Button>
    </div>
  </motion.div>
);

const StepTwo = ({ next, prev }) => (
  <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} className="space-y-6">
    <div>
      <label className="text-sm font-semibold mb-2 block text-text-dark">مرحلة العلاج الحالية</label>
      <div className="grid grid-cols-2 gap-3 mt-2">
        {['تم التشخيص حديثاً', 'العلاج الكيماوي', 'العلاج الإشعاعي', 'التعافي'].map((t, i) => (
          <div key={t} className={`border ${i===0 ? 'border-primary bg-primary/5 text-primary' : 'border-primary/20 text-text-muted'} rounded-xl p-3 text-center text-sm font-bold hover:bg-primary/5 cursor-pointer transition-all`}>
            {t}
          </div>
        ))}
      </div>
    </div>
    <div className="flex gap-4 pt-4">
      <Button variant="ghost" className="flex-1" onClick={prev}>رجوع</Button>
      <Button variant="primary" className="flex-1" onClick={next}>متابعة</Button>
    </div>
  </motion.div>
);

const StepThree = ({ next, prev }) => (
  <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} className="space-y-6">
    <div className="grid grid-cols-2 gap-4">
      <Input label="الوزن (كغ)" type="number" placeholder="65" />
      <Input label="الطول (سم)" type="number" placeholder="160" />
    </div>
    <div>
      <label className="text-sm font-semibold mb-2 block text-text-dark">حساسية أو قيود غذائية</label>
      <div className="flex flex-wrap gap-2 mt-2">
        {['خالي من الغلوتين', 'نباتي', 'بدون لاكتوز', 'بدون سكر'].map((t, i) => (
          <span key={t} className={`px-4 py-2 rounded-full text-sm font-semibold cursor-pointer transition-colors border ${i===1?'bg-primary/10 border-primary text-primary' : 'bg-neutral text-text-muted border-primary/10 hover:bg-primary/5'}`}>
            {t}
          </span>
        ))}
      </div>
    </div>
    <div className="flex gap-4 pt-4">
      <Button variant="ghost" className="flex-1" onClick={prev}>رجوع</Button>
      <Button variant="primary" className="flex-1" onClick={next}>إتمام التسجيل</Button>
    </div>
  </motion.div>
);

const StepFour = ({ onFinish }) => (
  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-8">
    <div className="w-12 h-12 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6">
      <CheckCircle2 size={32} />
    </div>
    <h3 className="text-3xl font-display font-bold mb-3 text-dark italic">أهلاً بكِ في عائلتنا</h3>
    <p className="text-text-muted mb-10 text-lg font-medium">تم إعداد حسابك بنجاح. نحن جاهزون للبدء معاً بخصوصية تامة.</p>
    <Button fullWidth onClick={onFinish} className="py-4 text-lg">استمري إلى الواجهة</Button>
  </motion.div>
);

export default function AuthPage({ type = 'login' }) {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleFinish = () => {
    navigate('/onboarding');
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] w-full">
      {/* Visual Side */}
      <div className="hidden lg:flex w-1/2 bg-secondary relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-multiply opacity-20 filter grayscale" />
        
        <div className="relative z-10 p-12 max-w-xl text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm border border-primary/5">
            <Heart size={40} className="text-primary" fill="currentColor" />
          </div>
          <h2 className="text-5xl font-display font-bold text-dark mb-6 tracking-tight">نرافقكِ لتكوني <br/><span className="text-primary italic">أقوى</span></h2>
          <p className="text-lg text-text-muted leading-relaxed font-medium">اكتشفي الوصفات الصحّية، تتبعي حالتك، وكوني جزءاً من مجتمع يدعمك دائماً في رحلة تعافيكِ.</p>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-display font-bold text-dark mb-3">
              {type === 'login' ? 'مرحباً بعودتك' : 'إنشاء حساب جديد'}
            </h1>
            <p className="text-text-muted text-lg">
              {type === 'login' ? 'أدخلي بياناتك للوصول إلى حسابك' : 'خبراء التغذية والصحة بانتظارك'}
            </p>
          </div>

          {type === 'signup' && step < 4 && (
            <div className="mb-10">
              <div className="flex items-center justify-between space-x-2 rtl:space-x-reverse mb-3">
                {[1, 2, 3].map(s => (
                  <div key={s} className={`h-2 flex-1 rounded-full transition-colors duration-500 ${step >= s ? 'bg-primary' : 'bg-neutral'}`} />
                ))}
              </div>
              <div className="text-sm font-bold text-text-muted text-center pt-2">الخطوة {step} من 3</div>
            </div>
          )}

          <div className="bg-white">
            <AnimatePresence mode="wait">
              {type === 'login' ? (
                 <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                   <Input label="البريد الإلكتروني" type="email" icon={Mail} placeholder="sara@example.com" />
                   <Input label="كلمة المرور" type="password" icon={Lock} placeholder="••••••••" />
                   <div className="flex justify-between items-center py-2">
                     <label className="flex items-center gap-2 cursor-pointer">
                       <input type="checkbox" className="rounded text-primary focus:ring-primary h-4 w-4 border-gray-300" />
                       <span className="text-sm font-semibold text-text-muted">تذكرني</span>
                     </label>
                     <a href="#" className="text-sm text-primary font-bold hover:underline">نسيت كلمة المرور؟</a>
                   </div>
                   <Button fullWidth onClick={() => navigate('/dashboard')} className="py-4 text-lg shadow-xl shadow-primary/20 mt-4">تسجيل الدخول</Button>
                   <div className="text-center pt-6">
                     <span className="text-text-muted font-medium">ليس لديك حساب؟ </span>
                     <Link to="/signup" className="text-primary font-bold hover:underline">سجلي مجاناً</Link>
                   </div>
                 </motion.div>
              ) : (
                <div key={`signup-step-${step}`}>
                  {step === 1 && <StepOne next={() => setStep(2)} />}
                  {step === 2 && <StepTwo next={() => setStep(3)} prev={() => setStep(1)} />}
                  {step === 3 && <StepThree next={() => setStep(4)} prev={() => setStep(2)} />}
                  {step === 4 && <StepFour onFinish={handleFinish} />}
                </div>
              )}
            </AnimatePresence>
          </div>

          {type === 'signup' && step === 1 && (
            <div className="text-center pt-8 mt-8 border-t border-gray-100">
               <span className="text-text-muted font-medium">لديك حساب بالفعل؟ </span>
               <Link to="/login" className="text-primary font-bold hover:underline">تسجيل الدخول</Link>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}

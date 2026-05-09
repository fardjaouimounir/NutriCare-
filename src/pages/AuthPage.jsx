import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, User, Mail, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';

// ── Step 1: Basic Info ──────────────────────────────────────────────────────
const StepOne = ({ data, setData, next }) => (
  <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} className="space-y-4">
    <Input label="الاسم الكامل" icon={User} placeholder="مثال: سارة أحمد"
      value={data.fullName} onChange={e => setData(p => ({ ...p, fullName: e.target.value }))} />
    <Input label="البريد الإلكتروني" type="email" icon={Mail} placeholder="sara@example.com"
      value={data.email} onChange={e => setData(p => ({ ...p, email: e.target.value }))} />
    <Input label="كلمة المرور" type="password" icon={Lock} placeholder="••••••••"
      value={data.password} onChange={e => setData(p => ({ ...p, password: e.target.value }))} />
    <div className="pt-4">
      <Button fullWidth onClick={next} disabled={!data.fullName || !data.email || !data.password}>متابعة</Button>
    </div>
  </motion.div>
);

// ── Step 2: Treatment Phase ─────────────────────────────────────────────────
const phases = [
  { label: 'تم التشخيص حديثاً', value: 'newly_diagnosed' },
  { label: 'العلاج الكيماوي', value: 'chemotherapy' },
  { label: 'العلاج الإشعاعي', value: 'radiation' },
  { label: 'التعافي', value: 'recovery' },
];

const StepTwo = ({ data, setData, next, prev }) => (
  <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} className="space-y-6">
    <div>
      <label className="text-sm font-semibold mb-2 block text-text-dark">مرحلة العلاج الحالية</label>
      <div className="grid grid-cols-2 gap-3 mt-2">
        {phases.map(p => (
          <div
            key={p.value}
            onClick={() => setData(prev => ({ ...prev, treatmentPhase: p.value }))}
            className={`border rounded-xl p-3 text-center text-sm font-bold cursor-pointer transition-all
              ${data.treatmentPhase === p.value
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-primary/20 text-text-muted hover:bg-primary/5'}`}
          >
            {p.label}
          </div>
        ))}
      </div>
    </div>
    <div className="flex gap-4 pt-4">
      <Button variant="ghost" className="flex-1" onClick={prev}>رجوع</Button>
      <Button variant="primary" className="flex-1" onClick={next} disabled={!data.treatmentPhase}>متابعة</Button>
    </div>
  </motion.div>
);

// ── Step 3: Body & Dietary Restrictions ────────────────────────────────────
const restrictions = ['خالي من الغلوتين', 'نباتي', 'بدون لاكتوز', 'بدون سكر'];

const StepThree = ({ data, setData, onSubmit, prev, loading }) => {
  const toggleRestriction = (r) => {
    const list = data.dietaryRestrictions || [];
    setData(p => ({
      ...p,
      dietaryRestrictions: list.includes(r) ? list.filter(x => x !== r) : [...list, r],
    }));
  };

  return (
    <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Input label="الوزن (كغ)" type="number" placeholder="65"
          value={data.weight} onChange={e => setData(p => ({ ...p, weight: e.target.value }))} />
        <Input label="الطول (سم)" type="number" placeholder="160"
          value={data.height} onChange={e => setData(p => ({ ...p, height: e.target.value }))} />
      </div>
      <div>
        <label className="text-sm font-semibold mb-2 block text-text-dark">قيود غذائية</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {restrictions.map(r => (
            <span
              key={r}
              onClick={() => toggleRestriction(r)}
              className={`px-4 py-2 rounded-full text-sm font-semibold cursor-pointer transition-colors border
                ${(data.dietaryRestrictions || []).includes(r)
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'bg-neutral text-text-muted border-primary/10 hover:bg-primary/5'}`}
            >
              {r}
            </span>
          ))}
        </div>
      </div>
      <div className="flex gap-4 pt-4">
        <Button variant="ghost" className="flex-1" onClick={prev} disabled={loading}>رجوع</Button>
        <Button variant="primary" className="flex-1" onClick={onSubmit} disabled={loading}>
          {loading ? 'جاري التسجيل...' : 'إتمام التسجيل'}
        </Button>
      </div>
    </motion.div>
  );
};

// ── Step 4: Success ─────────────────────────────────────────────────────────
const StepFour = ({ onFinish }) => (
  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-8">
    <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6">
      <CheckCircle2 size={32} />
    </div>
    <h3 className="text-3xl font-display font-bold mb-3 text-dark italic">أهلاً بكِ في عائلتنا</h3>
    <p className="text-text-muted mb-10 text-lg font-medium">تم إعداد حسابك بنجاح. نحن جاهزون للبدء معاً.</p>
    <Button fullWidth onClick={onFinish} className="py-4 text-lg">استمري إلى الواجهة</Button>
  </motion.div>
);

// ── Main Component ──────────────────────────────────────────────────────────
export default function AuthPage({ type = 'login' }) {
  const { signIn, signUp, user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({
    fullName: '', email: '', password: '',
    treatmentPhase: '', weight: '', height: '',
    dietaryRestrictions: [],
  });

  const handleLogin = async () => {
    setError('');
    setSubmitting(true);
    try {
      const result = await signIn({ email: loginData.email, password: loginData.password });
      // Navigate based on role returned directly from signIn
      if (result.profile?.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignup = async () => {
    setError('');
    setSubmitting(true);
    try {
      await signUp({
        email: signupData.email,
        password: signupData.password,
        fullName: signupData.fullName,
        treatmentPhase: signupData.treatmentPhase,
        weight: parseFloat(signupData.weight) || null,
        height: parseFloat(signupData.height) || null,
        dietaryRestrictions: signupData.dietaryRestrictions,
      });
      setStep(4);
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء التسجيل. حاولي مرة أخرى.');
    } finally {
      setSubmitting(false);
    }
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
          <h2 className="text-5xl font-display font-bold text-dark mb-6 tracking-tight">نرافقكِ لتكوني <br /><span className="text-primary italic">أقوى</span></h2>
          <p className="text-lg text-text-muted leading-relaxed font-medium">اكتشفي الوصفات الصحّية، تتبعي حالتك، وكوني جزءاً من مجتمع يدعمك دائماً.</p>
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

          {/* Progress bar (signup only) */}
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

          {/* Error message */}
          {error && (
            <div className="mb-6 flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-semibold">
              <AlertCircle size={18} className="shrink-0" />
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {type === 'login' ? (
              <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                <Input label="البريد الإلكتروني" type="email" icon={Mail} placeholder="sara@example.com"
                  value={loginData.email} onChange={e => setLoginData(p => ({ ...p, email: e.target.value }))} />
                <Input label="كلمة المرور" type="password" icon={Lock} placeholder="••••••••"
                  value={loginData.password} onChange={e => setLoginData(p => ({ ...p, password: e.target.value }))} />
                <Button fullWidth onClick={handleLogin} disabled={submitting} className="py-4 text-lg shadow-xl shadow-primary/20 mt-4">
                  {submitting ? 'جاري الدخول...' : 'تسجيل الدخول'}
                </Button>
                <div className="text-center pt-6">
                  <span className="text-text-muted font-medium">ليس لديك حساب؟ </span>
                  <Link to="/signup" className="text-primary font-bold hover:underline">سجلي مجاناً</Link>
                </div>
              </motion.div>
            ) : (
              <div key={`signup-step-${step}`}>
                {step === 1 && <StepOne data={signupData} setData={setSignupData} next={() => setStep(2)} />}
                {step === 2 && <StepTwo data={signupData} setData={setSignupData} next={() => setStep(3)} prev={() => setStep(1)} />}
                {step === 3 && <StepThree data={signupData} setData={setSignupData} onSubmit={handleSignup} prev={() => setStep(2)} loading={submitting} />}
                {step === 4 && <StepFour onFinish={() => navigate('/dashboard')} />}
              </div>
            )}
          </AnimatePresence>

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

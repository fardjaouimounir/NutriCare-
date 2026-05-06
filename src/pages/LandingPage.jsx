import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Apple, BookHeart, Users, Bell, HeartPulse, ChefHat, CheckCircle } from 'lucide-react';

import mainHeroImg from '../assets/img.png';

export default function LandingPage() {
  const { t } = useTranslation();

  const features = [
    { icon: Apple, title: t('nutrition_personal'), desc: 'Crafted specifically for your treatment phase.' },
    { icon: ChefHat, title: t('algerian_recipes'), desc: 'Local dishes adapted for your health needs.' },
    { icon: BookHeart, title: t('emotional_journal'), desc: 'Track your mood, symptoms, and feelings.' },
    { icon: Users, title: 'المجتمع', desc: 'Connect with a supportive community of women.' },
    { icon: Bell, title: 'التذكيرات', desc: 'Never miss a meal, pill, or hydration goal.' },
    { icon: HeartPulse, title: 'النصائح', desc: 'Medically-validated advice and articles.' },
  ];

  return (
    <div className="w-full bg-neutral overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative w-full min-h-[90vh] flex items-center py-20">
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 text-primary font-bold text-xs uppercase tracking-widest mb-8 border border-primary/10">
                <CheckCircle size={14} />
                <span>مرافقتك في رحلة التعافي</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-display font-bold text-dark mb-8 leading-[1.1]">
                تغذيـتـك، <br />
                <span className="italic text-primary">قــــوّتــــك</span>
              </h1>

              <p className="text-lg md:text-xl text-text-muted mb-12 max-w-xl leading-relaxed font-medium">
                {document.documentElement.lang === 'ar'
                  ? 'أول منصة جزائرية متكاملة تدمج بين التغذية العلاجية، الدعم النفسي، والمعرفة الطبية لدعمك في كل خطوة من رحلة علاج سرطان الثدي.'
                  : <span className="force-ltr block">The first comprehensive Algerian platform integrating clinical nutrition, psychological support, and medical knowledge.</span>}
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Link to="/signup">
                  <Button variant="primary" className="text-lg px-10 py-4 shadow-xl shadow-primary/20">
                    {t('start_journey')}
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="ghost" className="text-lg px-10 py-4">
                    {t('learn_more')}
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative lg:block hidden"
            >
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-xl border-8 border-white ring-1 ring-dark/5 aspect-[4/5]">
                <img src={mainHeroImg} alt="Healing" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/20 to-transparent" />
              </div>

              <div className="absolute -bottom-8 -left-8 glass p-5 rounded-xl shadow-xl border-white z-20 max-w-[220px]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center">
                    <Apple size={16} />
                  </div>
                  <div className="font-bold text-dark text-sm">خطة اليوم</div>
                </div>
                <div className="space-y-1.5">
                  <div className="h-1 w-full bg-dark/5 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-primary" />
                  </div>
                  <div className="text-[10px] font-bold text-text-muted">75% مكتمل</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="bg-white border-y border-dark/5 py-16 relative z-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            {[
              { val: '500+', label: 'مريضة مستفيدة' },
              { val: '200+', label: 'وصفة مقننة' },
              { val: '50+', label: 'خبير وأخصائي' },
              { val: '98%', label: 'نسبة الالتزام' }
            ].map((s, i) => (
              <div key={i} className="space-y-1">
                <div className="text-4xl font-display font-bold text-dark">{s.val}</div>
                <div className="text-text-muted font-bold text-xs uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 relative z-10 overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-dark mb-6 leading-tight">حلول شاملة مصممة <br /> لاحتياجاتك الخاصة</h2>
              <p className="text-text-muted text-lg font-medium leading-relaxed">كل ميزة في نيوتريكير تم تطويرها بالتعاون مع خبراء التغذية والأطباء لضمان أعلى مستويات الدعم خلال رحلة علاجك.</p>
            </div>
            <Link to="/signup">
              <Button variant="secondary" className="px-8 py-3">اكتشفي المزيد عن خدماتنا</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feat, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                key={idx}
              >
                <Card variant="solid" className="p-8 h-full border-dark/5 hover:border-primary/30 transition-all group rounded-xl">
                  <div className="w-12 h-12 rounded-lg bg-neutral border border-dark/5 flex items-center justify-center text-dark/70 mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <feat.icon size={22} />
                  </div>
                  <h3 className="text-xl font-bold text-dark mb-3 leading-tight">{feat.title}</h3>
                  <p className="text-text-muted font-medium text-sm leading-relaxed">{feat.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Content Section */}
      <section className="py-24 bg-white relative z-10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1 order-2 lg:order-1">
              <div className="space-y-12">
                {[
                  { step: '01', title: 'التشخيص والتقييم', desc: 'نبدأ رحلتنا بفهم دقيق لحالتك، نوع علاجك، واحتياجاتك الغذائية الفورية.' },
                  { step: '02', title: 'خطة مخصصة بالكامل', desc: 'نظام غذائي مصمم ليشمل الأطعمة المحلية الجزائرية التي تحبينها، ومعدلة طبياً لتناسب حالتك.' },
                  { step: '03', title: 'الدعم والمتابعة المستمرة', desc: 'لستِ وحدك، نحن نتابع تطورك يومياً ونوفر لكِ الدعم النفسي والمجتمعي اللازم للتعافي.' },
                ].map((s, i) => (
                  <div key={i} className="flex gap-8 group">
                    <div className="text-4xl font-display font-bold text-primary/20 group-hover:text-primary transition-colors duration-500">{s.step}</div>
                    <div>
                      <h4 className="text-2xl font-bold mb-3 text-dark">{s.title}</h4>
                      <p className="text-text-muted font-medium leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 order-1 lg:order-2">
              <div className="relative p-4">
                <div className="absolute top-0 right-0 w-full h-full border border-dark/10 rounded-2xl translate-x-3 translate-y-3" />
                <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&fit=crop" alt="Support" className="relative z-10 rounded-2xl shadow-lg grayscale hover:grayscale-0 transition-all duration-700" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-32 bg-neutral/50">
        <div className="container mx-auto px-4 text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-dark">نحن هنا لأجلك</h2>
        </div>
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <Card variant="solid" className="p-12 md:p-16 text-center relative overflow-hidden bg-white border-none shadow-xl">
            <p className="text-2xl md:text-3xl font-display font-medium text-dark leading-relaxed mb-8 italic">
              "وجدت في نيوتريكير أكثر من مجرد تطبيق غذائي، وجدت مجتمعاً يفهمني، وأدوات علمية جعلت رحلة علاجي الكيماوي أقل وطأة وأكثر أماناً."
            </p>
            <div className="font-bold text-primary text-lg">— أمينة، محاربة من الجزائر</div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden bg-primary">
        <div className="container relative z-10 mx-auto px-4 text-center text-white">
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-8 italic">ابدئي رحلة تعافيكِ اليوم</h2>
          <p className="text-lg md:text-xl mb-12 opacity-90 max-w-2xl mx-auto font-medium leading-relaxed">
            انضمي إلى مئات المنيات اللواتي يستخدمن نيوتريكير للاعتناء بتغذيتهن وصحتهن النفسية بأمان كامل.
          </p>
          <Link to="/signup">
            <Button className="bg-white text-primary hover:bg-neutral text-xl px-12 py-5 rounded-full shadow-2xl font-bold">
              إنشاء حسابكِ المجاني
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

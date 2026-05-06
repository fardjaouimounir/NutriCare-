import React from 'react';
import { Card } from '../components/ui/Card';
import { Heart, ShieldCheck, Stars, Target } from 'lucide-react';

export default function AboutPage() {
  const team = [
    { name: 'يوسري خ.', role: 'المؤسس ومطور الواجهات', img: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=200&fit=crop' },
    { name: 'د. ليلى مسعودي', role: 'أخصائية تغذية علاجية', img: 'https://images.unsplash.com/photo-1594824436002-0545331f4961?q=80&w=200&fit=crop' },
    { name: 'آسيا ب.', role: 'أخصائية علم نفس إكلينيكي', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&fit=crop' },
  ];

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="bg-primary/5 py-24 text-center rounded-[3rem] mb-20 shadow-glass border border-white mt-4 relative overflow-hidden max-w-7xl mx-auto">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay opacity-10" />
         <div className="relative z-10 px-4 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-display font-bold text-dark mb-8 leading-tight">مهمتنا هي تمكينك من خلال <span className="text-primary bg-white/50 px-2 rounded-xl">المعرفة والتغذية</span></h1>
            <p className="text-xl md:text-2xl text-text-muted font-medium leading-relaxed">
              تأسست "نيوتريكير" استجابة للحاجة الماسة لوجود منصة مخصصة للنساء الجزائريات اللواتي يواجهن سرطان الثدي، حيث تجتمع التغذية السليمة، الدعم النفسي، والمعرفة الطبية الموثوقة.
            </p>
         </div>
      </section>

      {/* Values */}
      <section className="py-12 max-w-7xl mx-auto px-4 mb-20">
         <h2 className="text-4xl font-display font-bold text-center text-dark mb-16">قيمنا الأساسية</h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: ShieldCheck, title: 'الموثوقية الطبية', desc: 'كل وصفة ونصيحة على منصتنا يتم تدقيقها من قبل أخصائيين معتمدين.' },
              { icon: Heart, title: 'التعاطف والدعم', desc: 'بناء مجتمع يشعر فيه الجميع بالانتماء، المشاركة، وأنهم ليسوا وحدهم أبداً.' },
              { icon: Target, title: 'تخصيص العناية', desc: 'إيماننا بأن كل رحلة علاج مختلفة، ولذلك يجب أن تكون خطة التعافي متفردة.' },
            ].map((v, i) => (
              <Card key={i} variant="glass" className="p-10 text-center bg-white/80 border-white shadow-sm hover:shadow-xl transition-shadow">
                 <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner transform -rotate-6">
                    <v.icon size={40} />
                 </div>
                 <h3 className="text-2xl font-bold text-dark mb-4">{v.title}</h3>
                 <p className="text-text-muted font-medium leading-relaxed text-lg">{v.desc}</p>
              </Card>
            ))}
         </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-neutral/50 rounded-[3rem] px-4 max-w-7xl mx-auto border border-white shadow-sm mb-20">
         <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-dark mb-6">الفريق وراء نيوتريكير</h2>
            <p className="text-xl text-text-muted font-medium">مزيج من التكنولوجيا والخبرة الطبية</p>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {team.map((t, i) => (
              <div key={i} className="text-center group">
                 <div className="w-48 h-48 mx-auto rounded-full overflow-hidden mb-6 shadow-xl border-4 border-white transition-transform duration-500 group-hover:scale-110">
                    <img src={t.img} alt={t.name} className="w-full h-full object-cover" />
                 </div>
                 <h3 className="text-2xl font-bold text-dark mb-2">{t.name}</h3>
                 <p className="text-primary font-bold">{t.role}</p>
              </div>
            ))}
         </div>
      </section>
    </div>
  );
}

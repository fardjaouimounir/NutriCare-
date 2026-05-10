import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ar: {
    translation: {
      "greeting": "صباح الخير",
      "nav_home": "الرئيسية",
      "nav_dashboard": "لوحة القيادة",
      "nav_profile": "الملف الشخصي",
      "nav_nutrition": "التغذية",
      "nav_hydration": "الترطيب",
      "nav_recipes": "الوصفات",
      "nav_journal": "اليومية",
      "nav_wellness": "تحليلاتك",
      "nav_community": "المجتمع",
      "nav_advice": "نصائح",
      "start_journey": "ابدئي رحلتك",
      "learn_more": "اعرفي أكثر",
      "slogan": "تغذيتك، قوّتك",
      "features": "المميزات",
      "nutrition_personal": "التغذية الشخصية",
      "nutrition_personal_desc": "مصممة خصيصاً لمرحلة علاجك.",
      "algerian_recipes": "الوصفات الجزائرية",
      "algerian_recipes_desc": "أطباق محلية مكيفة حسب احتياجاتك الصحية.",
      "emotional_journal": "اليومية العاطفية",
      "emotional_journal_desc": "تتبع حالتك المزاجية وأعراضك ومشاعرك.",
      "hero_title": "تغذيـتـك، قوّتك",
      "hero_desc": "أول منصة جزائرية متكاملة تدمج بين التغذية العلاجية، الدعم النفسي، والمعرفة الطبية لدعمك في كل خطوة من رحلة علاج سرطان الثدي.",
      "hero_badge": "مرافقتك في رحلة التعافي",
      "stat_patients": "مريضة مستفيدة",
      "stat_recipes": "وصفة مقننة",
      "stat_experts": "خبير وأخصائي",
      "stat_commitment": "نسبة الالتزام",
      "community": "المجتمع",
      "community_desc": "تواصل مع مجتمع داعم من النساء.",
      "reminders": "التذكيرات",
      "reminders_desc": "لا تفوت وجبة أو دواء أو هدف ترطيب.",
      "advice": "النصائح",
      "advice_desc": "نصائح ومقالات معتمدة طبياً.",
      "solutions_title": "حلول شاملة مصممة لاحتياجاتك الخاصة",
      "solutions_desc": "كل ميزة في نيوتريكير تم تطويرها بالتعاون مع خبراء التغذية والأطباء لضمان أعلى مستويات الدعم خلال رحلة علاجك.",
      "solutions_btn": "اكتشفي المزيد عن خدماتنا",
      "step1_title": "التشخيص والتقييم",
      "step1_desc": "نبدأ رحلتنا بفهم دقيق لحالتك، نوع علاجك، واحتياجاتك الغذائية الفورية.",
      "step2_title": "خطة مخصصة بالكامل",
      "step2_desc": "نظام غذائي مصمم ليشمل الأطعمة المحلية الجزائرية التي تحبينها، ومعدلة طبياً لتناسب حالتك.",
      "step3_title": "الدعم والمتابعة المستمرة",
      "step3_desc": "لستِ وحدك، نحن نتابع تطورك يومياً ونوفر لكِ الدعم النفسي والمجتمعي اللازم للتعافي.",
      "here_for_you": "نحن هنا لأجلك",
      "testimonial_text": "\"وجدت في نيوتريكير أكثر من مجرد تطبيق غذائي، وجدت مجتمعاً يفهمني، وأدوات علمية جعلت رحلة علاجي الكيماوي أقل وطأة وأكثر أماناً.\"",
      "testimonial_author": "أمينة، محاربة من الجزائر",
      "cta_title": "ابدئي رحلة تعافيكِ اليوم",
      "cta_desc": "انضمي إلى مئات المنيات اللواتي يستخدمن نيوتريكير للاعتناء بتغذيتهن وصحتهن النفسية بأمان كامل.",
      "cta_btn": "إنشاء حسابكِ المجاني",
      "footer_desc": "تغذيتك، قوتك - رفيقك الشخصي للتغذية والعافية وإيجاد القوة خلال رحلة علاج سرطان الثدي.",
      "footer_platform": "المنصة",
      "footer_support": "الدعم",
      "footer_newsletter": "النشرة الإخبارية",
      "footer_newsletter_desc": "احصلي على نصائح ووصفات صحية أسبوعياً.",
      "footer_email_placeholder": "عنوان البريد الإلكتروني",
      "footer_join": "انضمي",
      "footer_rights": "جميع الحقوق محفوظة",
      // Admin translations
      "admin_dashboard": "لوحة التحكم",
      "admin_users": "المريضات",
      "admin_specialists": "الأخصائيات",
      "admin_content": "المحتوى",
      "admin_analytics": "التحليلات",
      "admin_settings": "الإعدادات",
      "admin_reports": "التقارير",
      "admin_logout": "تسجيل الخروج",
      "admin_search": "بحث سريع...",
      "admin_notifications": "الإشعارات"
    }
  },
  fr: {
    translation: {
      "greeting": "Bonjour",
      "nav_home": "Accueil",
      "nav_dashboard": "Tableau de bord",
      "nav_profile": "Profil",
      "nav_nutrition": "Nutrition",
      "nav_hydration": "Hydratation",
      "nav_recipes": "Recettes",
      "nav_journal": "Journal",
      "nav_wellness": "Analyses",
      "nav_community": "Communauté",
      "nav_advice": "Conseils",
      "start_journey": "Commencer",
      "learn_more": "En savoir plus",
      "slogan": "Nutrition, Votre Force",
      "features": "Caractéristiques",
      "nutrition_personal": "Nutrition Personnalisée",
      "nutrition_personal_desc": "Conçue spécifiquement pour votre phase de traitement.",
      "algerian_recipes": "Recettes Algériennes",
      "algerian_recipes_desc": "Plats locaux adaptés à vos besoins de santé.",
      "emotional_journal": "Journal Émotionnel",
      "emotional_journal_desc": "Suivez votre humeur, vos symptômes et vos sentiments.",
      "hero_title": "Votre Nutrition, Votre Force",
      "hero_desc": "La première plateforme algérienne intégrée alliant nutrition clinique, soutien psychologique et expertise médicale pour vous accompagner à chaque étape du cancer du sein.",
      "hero_badge": "Votre compagnon de guérison",
      "stat_patients": "Patientes bénéficiaires",
      "stat_recipes": "Recettes certifiées",
      "stat_experts": "Experts & Spécialistes",
      "stat_commitment": "Taux d'engagement",
      "community": "Communauté",
      "community_desc": "Connectez-vous avec une communauté de soutien.",
      "reminders": "Rappels",
      "reminders_desc": "Ne ratez jamais un repas, un médicament ou un objectif.",
      "advice": "Conseils",
      "advice_desc": "Conseils et articles validés médicalement.",
      "solutions_title": "Des solutions complètes adaptées à vos besoins",
      "solutions_desc": "Chaque fonctionnalité de NutriCare a été développée en collaboration avec des nutritionnistes et des médecins pour assurer le plus haut niveau de soutien.",
      "solutions_btn": "Découvrez nos services",
      "step1_title": "Diagnostic et Évaluation",
      "step1_desc": "Nous commençons notre voyage par une compréhension précise de votre état, de votre type de traitement et de vos besoins nutritionnels immédiats.",
      "step2_title": "Plan Entièrement Personnalisé",
      "step2_desc": "Un régime alimentaire conçu pour inclure les aliments locaux algériens que vous aimez, médicalement adaptés à votre état.",
      "step3_title": "Soutien et Suivi Continu",
      "step3_desc": "Vous n'êtes pas seule, nous suivons votre progression quotidiennement et vous apportons le soutien psychologique et communautaire nécessaire.",
      "here_for_you": "Nous sommes là pour vous",
      "testimonial_text": "\"J'ai trouvé en NutriCare plus qu'une simple application de nutrition, j'ai trouvé une communauté qui me comprend et des outils scientifiques qui ont rendu mon parcours plus sûr.\"",
      "testimonial_author": "Amina, combattante d'Algérie",
      "cta_title": "Commencez votre voyage de guérison aujourd'hui",
      "cta_desc": "Rejoignez des centaines de femmes qui utilisent NutriCare pour prendre soin de leur nutrition et de leur santé mentale en toute sécurité.",
      "cta_btn": "Créer votre compte gratuit",
      "footer_desc": "Nutrition, Votre Force - Votre compagnon personnalisé pour la nutrition, le bien-être et la force pendant le traitement du cancer du sein.",
      "footer_platform": "Plateforme",
      "footer_support": "Support",
      "footer_newsletter": "Newsletter",
      "footer_newsletter_desc": "Recevez des conseils et des recettes saines chaque semaine.",
      "footer_email_placeholder": "Adresse e-mail",
      "footer_join": "Rejoindre",
      "footer_rights": "Tous droits réservés",
      // Admin translations
      "admin_dashboard": "Tableau de bord",
      "admin_users": "Patientes",
      "admin_specialists": "Spécialistes",
      "admin_content": "Contenu",
      "admin_analytics": "Analyses",
      "admin_settings": "Paramètres",
      "admin_reports": "Rapports",
      "admin_logout": "Déconnexion",
      "admin_search": "Recherche rapide...",
      "admin_notifications": "Notifications"
    }
  }
};

const savedLng = localStorage.getItem('nutricare-lang') || 'ar';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLng,
    fallbackLng: "fr",
    interpolation: {
      escapeValue: false 
    }
  });

// Set initial direction
document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
document.documentElement.lang = i18n.language;

export default i18n;


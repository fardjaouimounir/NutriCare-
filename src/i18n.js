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
      "algerian_recipes": "الوصفات الجزائرية",
      "emotional_journal": "اليومية العاطفية",
      "hero_title": "تغذيـتـك، قوّتك",
      "hero_desc": "أول منصة جزائرية متكاملة تدمج بين التغذية العلاجية، الدعم النفسي، والمعرفة الطبية لدعمك في كل خطوة من رحلة علاج سرطان الثدي.",
      "hero_badge": "مرافقتك في رحلة التعافي",
      "stat_patients": "مريضة مستفيدة",
      "stat_recipes": "وصفة مقننة",
      "stat_experts": "خبير وأخصائي",
      "stat_commitment": "نسبة الالتزام",
      "community": "المجتمع",
      "reminders": "التذكيرات",
      "advice": "النصائح",
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
      "algerian_recipes": "Recettes Algériennes",
      "emotional_journal": "Journal Émotionnel",
      "hero_title": "Votre Nutrition, Votre Force",
      "hero_desc": "La première plateforme algérienne intégrée alliant nutrition clinique, soutien psychologique et expertise médicale pour vous accompagner à chaque étape du cancer du sein.",
      "hero_badge": "Votre compagnon de guérison",
      "stat_patients": "Patientes bénéficiaires",
      "stat_recipes": "Recettes certifiées",
      "stat_experts": "Experts & Spécialistes",
      "stat_commitment": "Taux d'engagement",
      "community": "Communauté",
      "reminders": "Rappels",
      "advice": "Conseils",
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


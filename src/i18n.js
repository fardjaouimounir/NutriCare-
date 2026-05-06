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
      "emotional_journal": "اليومية العاطفية"
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
      "start_journey": "Commencez votre voyage",
      "learn_more": "En savoir plus",
      "slogan": "Nutrition, Votre Force",
      "features": "Caractéristiques",
      "nutrition_personal": "Nutrition Personnalisée",
      "algerian_recipes": "Recettes Algériennes",
      "emotional_journal": "Journal Émotionnel"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "ar", // default language
    fallbackLng: "fr",
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;

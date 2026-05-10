import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Globe, MessageCircle, Camera } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Footer = ({ minimal = false }) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  if (minimal) {
    return (
      <footer className="py-6 text-center text-sm text-text-muted font-ui">
        <p>&copy; {new Date().getFullYear()} NUTRICARE. {t('footer_rights')}</p>
      </footer>
    );
  }

  return (
    <footer className={`bg-white/40 backdrop-blur-md pt-16 pb-8 border-t border-white/20 mt-20 ${isRtl ? 'text-right' : 'text-left'}`}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className={`flex items-center gap-2 ${isRtl ? 'justify-end md:justify-start' : ''}`}>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                <Heart size={16} fill="currentColor" />
              </div>
              <span className="text-xl font-display font-bold text-primary">NUTRICARE</span>
            </Link>
            <p className="text-text-muted text-sm leading-relaxed">
              {t('footer_desc')}
            </p>
            <div className={`flex items-center gap-4 pt-2 ${isRtl ? 'justify-end md:justify-start' : ''}`}>
              <a href="#" className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors shadow-sm">
                <Globe size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors shadow-sm">
                <MessageCircle size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors shadow-sm">
                <Camera size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-lg">{t('footer_platform')}</h4>
            <ul className="space-y-2 text-sm text-text-muted">
              <li><Link to="/about" className="hover:text-primary transition-colors">{i18n.language === 'ar' ? 'من نحن' : 'À propos'}</Link></li>
              <li><Link to="/features" className="hover:text-primary transition-colors">{t('features')}</Link></li>
              <li><Link to="/recipes" className="hover:text-primary transition-colors">{t('nav_recipes')}</Link></li>
              <li><Link to="/advice" className="hover:text-primary transition-colors">{t('nav_advice')}</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-lg">{t('footer_support')}</h4>
            <ul className="space-y-2 text-sm text-text-muted">
              <li><Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">{i18n.language === 'ar' ? 'اتصلي بنا' : 'Contactez-nous'}</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">{i18n.language === 'ar' ? 'سياسة الخصوصية' : 'Confidentialité'}</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">{i18n.language === 'ar' ? 'شروط الخدمة' : 'Conditions'}</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-lg">{t('footer_newsletter')}</h4>
            <p className="text-sm text-text-muted">{t('footer_newsletter_desc')}</p>
            <form className="flex mt-2" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder={t('footer_email_placeholder')} 
                className="w-full bg-white/60 border border-transparent focus:border-primary px-4 py-2 rounded-r-none rtl:rounded-l-none rtl:rounded-r-xl ltr:rounded-l-xl outline-none transition-all text-sm"
              />
              <button 
                type="submit" 
                className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-l-none rtl:rounded-r-none rtl:rounded-l-xl ltr:rounded-r-xl transition-colors font-semibold whitespace-nowrap"
              >
                {t('footer_join')}
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-white/20 text-center text-sm text-text-muted">
          <p>&copy; {new Date().getFullYear()} NUTRICARE. {t('footer_rights')}</p>
        </div>
      </div>
    </footer>
  );
};

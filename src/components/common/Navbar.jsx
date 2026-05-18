import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, Globe } from 'lucide-react';
import { Button } from '../ui/Button';
import logoImg from '../../assets/logo.png';

export const Navbar = ({ onMenuClick, hideLinks = false }) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const toggleLang = () => {
    const nextLang = i18n.language === 'ar' ? 'fr' : 'ar';
    i18n.changeLanguage(nextLang);
    localStorage.setItem('nutricare-lang', nextLang);
    document.documentElement.dir = nextLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = nextLang;
  };

  const navLinks = [
    { name: t('nav_home'), path: '/' },
    { name: t('nav_dashboard'), path: '/dashboard' },
    { name: t('nav_recipes'), path: '/recipes' },
    { name: t('nav_community'), path: '/community' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/60 backdrop-blur-[20px] backdrop-saturate-[180%] border-b border-white/20 w-full shadow-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onMenuClick && !hideLinks && (
            <button onClick={onMenuClick} className="lg:hidden p-2 text-dark focus:outline-none focus:ring-2 focus:ring-primary rounded-md">
              <Menu size={20} />
            </button>
          )}
          <Link to="/" className="flex items-center gap-0.5 group outline-none focus:ring-2 focus:ring-dark/10 rounded-lg p-1">
            <img src={logoImg} className="h-16 w-auto object-contain" alt="SENOCARE" />
            <span className="text-lg font-display font-bold text-dark tracking-tighter">SENOCARE</span>
          </Link>
        </div>

        {!hideLinks && (
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path}
                className={`text-base font-semibold hover:text-primary transition-colors outline-none focus:ring-2 focus:ring-primary rounded-md px-2 py-1 ${location.pathname === link.path ? 'text-primary' : 'text-text-muted'}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleLang} 
            className="p-2 text-text-muted hover:text-primary transition-colors flex items-center gap-1 font-semibold text-sm outline-none focus:ring-2 focus:ring-primary rounded-md"
          >
            <Globe size={18} />
            {i18n.language === 'ar' ? 'FR' : 'عربي'}
          </button>
          {!hideLinks && (
            <Link to="/login" className="hidden sm:block outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-neutral rounded-full">
              <Button variant="primary" className="px-6 py-2 h-auto text-sm">{t('start_journey')}</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

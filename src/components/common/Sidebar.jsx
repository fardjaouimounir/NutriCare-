import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  User, 
  Apple, 
  Droplet, 
  Coffee, 
  BookHeart, 
  LineChart, 
  Users, 
  Stethoscope,
  Bell,
  X,
  Heart
} from 'lucide-react';

import logoImg from '../../assets/logo.png';

export const Sidebar = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  const links = [
    { name: t('nav_dashboard'), path: '/dashboard', icon: LayoutDashboard },
    { name: t('nav_profile'), path: '/profile', icon: User },
    { name: t('nav_nutrition'), path: '/nutrition', icon: Apple },
    { name: t('nav_hydration'), path: '/hydration', icon: Droplet },
    { name: t('nav_recipes'), path: '/recipes', icon: Coffee },
    { name: t('nav_journal'), path: '/journal', icon: BookHeart },
    { name: t('nav_wellness'), path: '/wellness', icon: LineChart },
    { name: t('nav_community'), path: '/community', icon: Users },
    { name: t('nav_advice'), path: '/advice', icon: Stethoscope },
    { name: 'Notifications', path: '/notifications', icon: Bell },
  ];

  const sidebarContent = (
    <div className="w-64 h-full glass-card p-4 flex flex-col gap-2 overflow-y-auto no-scrollbar">
      <div className="flex items-center justify-between lg:hidden mb-6 px-2">
        <div className="flex items-center gap-0.5">
          <img src={logoImg} className="h-16 w-auto object-contain" alt="SENOCARE" />
          <span className="text-lg font-display font-bold text-dark tracking-tighter uppercase">SENOCARE</span>
        </div>
        <button onClick={onClose} className="p-1 text-text-muted hover:text-primary">
          <X size={24} />
        </button>
      </div>
      
      <div className="space-y-1.5 mt-2">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            onClick={() => window.innerWidth < 1024 && onClose()}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-2.5 rounded-lg font-bold transition-all duration-200
              ${isActive 
                ? 'bg-primary text-white shadow-lg shadow-primary/10' 
                : 'text-text-muted hover:bg-secondary hover:text-dark'
              }
            `}
          >
            <link.icon size={16} strokeWidth={2} />
            <span className="text-xs uppercase tracking-widest">{link.name}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-dark/20 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: document.documentElement.dir === 'rtl' ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: document.documentElement.dir === 'rtl' ? '100%' : '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed top-0 bottom-0 rtl:right-0 ltr:left-0 z-50 p-4 lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 sticky top-[104px] h-[calc(100vh-120px)] border-none">
        {sidebarContent}
      </aside>
    </>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Card = ({ children, variant = 'glass', className, hoverEffect = false, ...props }) => {
  const baseClasses = "overflow-hidden relative";
  
  const variants = {
    glass: "glass-card",
    solid: "bg-white shadow-[0_4px_20px_rgba(31,26,27,0.03)] rounded-[24px] border border-dark/5",
    dark: "bg-dark text-white shadow-xl rounded-[24px] border border-white/5",
  };

  const classes = twMerge(clsx(baseClasses, variants[variant]), className);

  if (hoverEffect) {
    return (
      <motion.div 
        className={classes}
        whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(31, 26, 27, 0.08)' }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

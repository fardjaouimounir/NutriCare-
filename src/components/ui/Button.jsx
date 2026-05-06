import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Button = React.forwardRef(({ 
  children, 
  variant = 'primary', 
  className, 
  onClick, 
  type = 'button',
  fullWidth = false,
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center transition-all duration-300 font-semibold rounded-full outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-neutral transform active:scale-95";
  
  const variants = {
    primary: "bg-primary text-white shadow-sm hover:shadow-md hover:bg-primary/90 focus:ring-primary/20",
    secondary: "border border-dark/10 text-text-dark hover:bg-dark/5 focus:ring-dark/20",
    danger: "bg-red-600 text-white shadow-sm hover:bg-red-700 focus:ring-red-500/20",
    ghost: "text-text-muted hover:bg-dark/5 hover:text-text-dark focus:ring-dark/20"
  };

  const classes = twMerge(
    clsx(baseClasses, variants[variant], fullWidth ? "w-full" : "", "px-6 py-3"),
    className
  );

  return (
    <motion.button
      ref={ref}
      type={type}
      className={classes}
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      {...props}
    >
      {children}
    </motion.button>
  );
});

Button.displayName = 'Button';

import React, { useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Input = React.forwardRef(({ 
  label, 
  error, 
  success, 
  id, 
  className,
  type = 'text',
  icon: Icon,
  ...props 
}, ref) => {
  // Input fields for form with error/success
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <div className={twMerge(clsx("flex flex-col w-full relative", className))}>
      {label && (
        <label 
          htmlFor={id} 
          className={clsx(
            "text-sm font-semibold mb-2 transition-colors duration-200",
            isFocused ? "text-primary" : "text-text-dark",
            error ? "text-red-500" : ""
          )}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute top-1/2 -translate-y-1/2 rtl:right-4 ltr:left-4 text-text-muted">
            <Icon size={20} />
          </div>
        )}
        <input
          ref={ref}
          id={id}
          type={type}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={clsx(
            "input-field",
            Icon ? "rtl:pr-12 ltr:pl-12 rtl:pl-4 ltr:pr-4" : "",
            error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20 text-red-900" : "",
            success ? "border-success focus:border-success focus:ring-success/20" : ""
          )}
          {...props}
        />
        {error && (
          <div className="absolute top-1/2 -translate-y-1/2 rtl:left-4 ltr:right-4 text-red-500">
            <AlertCircle size={20} />
          </div>
        )}
        {success && !error && (
          <div className="absolute top-1/2 -translate-y-1/2 rtl:left-4 ltr:right-4 text-success">
            <CheckCircle2 size={20} />
          </div>
        )}
      </div>
      {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';

import React from 'react';

const Badge = ({
  children,
  variant = 'emerald',
  size = 'md',
  className = '',
  icon: Icon,
}) => {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-medium',
    lg: 'px-3 py-1.5 text-sm font-medium',
  };

  const variantStyles = {
    emerald: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    teal: 'bg-teal-50 text-teal-700 border border-teal-200/60',
    amber: 'bg-amber-50 text-amber-700 border border-amber-200/60',
    rose: 'bg-rose-50 text-rose-700 border border-rose-200/60',
    blue: 'bg-sky-50 text-sky-700 border border-sky-200/60',
    slate: 'bg-slate-100 text-slate-700 border border-slate-200',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {Icon && <Icon className="w-3 h-3" />}
      {children}
    </span>
  );
};

export default Badge;

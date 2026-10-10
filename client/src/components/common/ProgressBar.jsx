import React from 'react';

const ProgressBar = ({
  value = 0,
  max = 100,
  label,
  valueText,
  color = 'emerald',
  size = 'md',
  className = '',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const colorStyles = {
    emerald: 'bg-emerald-500',
    teal: 'bg-teal-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    blue: 'bg-sky-500',
  };

  const heightStyles = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || valueText) && (
        <div className="flex justify-between items-center text-xs mb-1.5">
          {label && <span className="font-medium text-slate-700">{label}</span>}
          {valueText ? (
            <span className="font-semibold text-slate-600">{valueText}</span>
          ) : (
            <span className="font-semibold text-slate-600">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${heightStyles[size]}`}>
        <div
          className={`${colorStyles[color]} ${heightStyles[size]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;

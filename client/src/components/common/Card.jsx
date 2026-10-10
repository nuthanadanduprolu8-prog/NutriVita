import React from 'react';

const Card = ({
  children,
  className = '',
  hoverEffect = false,
  padding = 'p-6',
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-soft transition-all duration-200 ${
        hoverEffect ? 'hover:shadow-soft-lg hover:border-emerald-200 hover:-translate-y-0.5' : ''
      } ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;

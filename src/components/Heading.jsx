import React from 'react';

export default function Heading({ title, bgWord, className = '', align = 'center' }) {
  const alignCls = align === 'left' ? 'text-left' : align === 'right' ? 'text-right' : 'text-center';
  return (
    <div className={`${alignCls} section-title`}>
      <h2 className={`font-display uppercase tracking-wide font-extrabold ${className}`}>{title}</h2>
      {bgWord && <span aria-hidden className="bg-word font-display">{bgWord}</span>}
    </div>
  );
}
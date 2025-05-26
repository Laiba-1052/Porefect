import React from 'react';

function Card({ 
  children, 
  title, 
  subtitle, 
  footer,
  headerAction,
  className = '', 
  padding = true,
  shadow = 'md',
  hoverable = false
}) {
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  };

  const classes = [
    'bg-white rounded-lg overflow-hidden',
    shadowClasses[shadow],
    hoverable ? 'transition-transform hover:-translate-y-1 hover:shadow-lg' : '',
    className
  ].join(' ');

  return (
    <div className={classes}>
      {(title || subtitle) && (
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div>
            {title && <h3 className="font-semibold text-lg text-gray-800">{title}</h3>}
            {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
          </div>
          {headerAction && (
            <div>{headerAction}</div>
          )}
        </div>
      )}
      
      <div className={padding ? 'p-5' : ''}>
        {children}
      </div>
      
      {footer && (
        <div className="px-5 py-3 bg-gray-50 border-t">
          {footer}
        </div>
      )}
    </div>
  );
}

export default Card;
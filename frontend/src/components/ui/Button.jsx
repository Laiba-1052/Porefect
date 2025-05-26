import React from 'react';

function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  type = 'button', 
  fullWidth = false, 
  icon, 
  disabled = false, 
  loading = false,
  onClick 
}) {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-lavender-500 hover:bg-lavender-600 focus:ring-lavender-400 text-white",
    secondary: "bg-mint-500 hover:bg-mint-600 focus:ring-mint-400 text-white",
    outline: "border border-lavender-300 hover:bg-lavender-50 focus:ring-lavender-300 text-lavender-700",
    ghost: "hover:bg-lavender-50 text-lavender-700 focus:ring-lavender-300",
    danger: "bg-error-500 hover:bg-error-700 focus:ring-error-400 text-white",
  };
  
  const sizes = {
    sm: "text-xs py-1.5 px-3",
    md: "text-sm py-2 px-4",
    lg: "text-base py-2.5 px-5"
  };
  
  const classes = [
    baseClasses,
    variants[variant],
    sizes[size],
    fullWidth ? "w-full" : "",
    disabled || loading ? "opacity-60 cursor-not-allowed" : "",
  ].join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {icon && !loading && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
}

export default Button;
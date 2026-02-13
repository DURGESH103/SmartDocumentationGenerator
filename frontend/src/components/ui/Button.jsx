const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-xl transition-all',
  };

  const sizes = {
    sm: 'text-sm px-4 py-2',
    md: 'text-sm sm:text-base px-4 sm:px-6 py-2.5 min-h-[44px]',
    lg: 'text-base sm:text-lg px-6 sm:px-8 py-3 min-h-[48px]',
  };

  return (
    <button
      className={`${variants[variant]} ${sizes[size]} ${className} disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

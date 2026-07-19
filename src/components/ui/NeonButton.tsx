import React, { ButtonHTMLAttributes } from 'react';

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

const NeonButton: React.FC<NeonButtonProps> = ({ 
  variant = 'primary', 
  children, 
  className = '',
  ...props 
}) => {
  const baseStyles = "px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform active:scale-95";
  
  const variants = {
    primary: "bg-gradient-to-r from-neonGreen to-neonBlue text-dark glow-green hover:shadow-[0_0_30px_rgba(80,255,176,0.6)] hover:-translate-y-0.5",
    secondary: "bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default NeonButton;

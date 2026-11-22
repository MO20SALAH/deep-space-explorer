import React from 'react';
import { motion } from 'framer-motion';

/**
 * Button component - Stylized interactive button with glass & glowing states
 */
export default function Button({
  children,
  variant = 'primary',
  className = '',
  onClick,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#030712] cursor-pointer select-none';

  const variants = {
    primary: 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 border border-cyan-400/30 hover:shadow-cyan-500/40 focus:ring-cyan-400',
    glass: 'bg-white/10 hover:bg-white/15 text-white border border-white/15 backdrop-blur-md hover:border-white/25 focus:ring-white/40',
    outline: 'border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10 focus:ring-cyan-400',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

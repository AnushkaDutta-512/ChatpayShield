import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const AnimatedButton = ({ 
  children, 
  variant = 'primary', 
  className, 
  onClick,
  ...props 
}) => {
  const variants = {
    primary: "bg-primary text-background hover:bg-primary/90 shadow-[0_0_15px_rgba(0,229,255,0.5)]",
    secondary: "bg-secondary text-white hover:bg-secondary/90 shadow-[0_0_15px_rgba(124,58,237,0.5)]",
    outline: "border border-primary text-primary hover:bg-primary/10",
    danger: "bg-danger text-white hover:bg-danger/90 shadow-[0_0_15px_rgba(239,68,68,0.5)]",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "px-6 py-2.5 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center gap-2",
        variants[variant],
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default AnimatedButton;

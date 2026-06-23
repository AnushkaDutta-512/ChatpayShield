import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const GlassCard = ({ children, className, hover = false, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "glass-panel rounded-2xl p-6",
        hover && "glass-panel-hover cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;

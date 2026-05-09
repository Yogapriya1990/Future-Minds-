import { motion } from 'framer-motion';
import { ReactNode } from 'react';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

interface AnimatedListProps {
  children: ReactNode[];
  className?: string;
}

export function AnimatedList({ children, className }: AnimatedListProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={className}
    >
      {children.map((child, i) => (
        <motion.div key={i} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

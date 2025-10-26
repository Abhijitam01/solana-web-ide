'use client';

import { motion, HTMLMotionProps, Variants } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface AnimatedWrapperProps extends Omit<HTMLMotionProps<"div">, 'children'> {
  children: ReactNode;
  variant?: 'fadeInUp' | 'fadeInDown' | 'slideInLeft' | 'slideInRight' | 'scaleIn' | 'stagger';
  delay?: number;
  duration?: number;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
  staggerChildren?: boolean;
  staggerDelay?: number;
}

const variants: Record<string, Variants> = {
  fadeInUp: {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  },
  fadeInDown: {
    initial: { opacity: 0, y: -20, scale: 0.95 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    exit: { 
      opacity: 0, 
      y: 20, 
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  },
  slideInLeft: {
    initial: { opacity: 0, x: -50, scale: 0.95 },
    animate: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    exit: { 
      opacity: 0, 
      x: -50, 
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  },
  slideInRight: {
    initial: { opacity: 0, x: 50, scale: 0.95 },
    animate: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    exit: { 
      opacity: 0, 
      x: 50, 
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  },
  stagger: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  }
};

const childVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};

export default function AnimatedWrapper({
  children,
  variant = 'fadeInUp',
  delay = 0,
  duration,
  className,
  as = 'div',
  staggerChildren = false,
  staggerDelay = 0.1,
  ...props
}: AnimatedWrapperProps) {
  const MotionComponent = motion[as] as any;
  
  const animationVariants = variants[variant];
  
  // Add delay and custom duration if provided
  const enhancedVariants = {
    ...animationVariants,
    animate: {
      ...animationVariants.animate,
      transition: {
        ...animationVariants.animate.transition,
        delay,
        ...(duration && { duration }),
        ...(staggerChildren && {
          staggerChildren: staggerDelay,
          delayChildren: delay
        })
      }
    }
  };

  return (
    <MotionComponent
      variants={staggerChildren ? enhancedVariants : undefined}
      initial="initial"
      animate="animate"
      exit="exit"
      className={cn(className)}
      {...props}
    >
      {staggerChildren ? (
        <motion.div variants={childVariants}>
          {children}
        </motion.div>
      ) : (
        children
      )}
    </MotionComponent>
  );
}

// Specialized animation components for common use cases
export const FadeInUp = ({ children, ...props }: Omit<AnimatedWrapperProps, 'variant'>) => (
  <AnimatedWrapper variant="fadeInUp" {...props}>
    {children}
  </AnimatedWrapper>
);

export const FadeInDown = ({ children, ...props }: Omit<AnimatedWrapperProps, 'variant'>) => (
  <AnimatedWrapper variant="fadeInDown" {...props}>
    {children}
  </AnimatedWrapper>
);

export const SlideInLeft = ({ children, ...props }: Omit<AnimatedWrapperProps, 'variant'>) => (
  <AnimatedWrapper variant="slideInLeft" {...props}>
    {children}
  </AnimatedWrapper>
);

export const SlideInRight = ({ children, ...props }: Omit<AnimatedWrapperProps, 'variant'>) => (
  <AnimatedWrapper variant="slideInRight" {...props}>
    {children}
  </AnimatedWrapper>
);

export const ScaleIn = ({ children, ...props }: Omit<AnimatedWrapperProps, 'variant'>) => (
  <AnimatedWrapper variant="scaleIn" {...props}>
    {children}
  </AnimatedWrapper>
);

export const StaggerContainer = ({ children, ...props }: Omit<AnimatedWrapperProps, 'variant'>) => (
  <AnimatedWrapper variant="stagger" staggerChildren {...props}>
    {children}
  </AnimatedWrapper>
);

'use client';

import type { Variants } from 'framer-motion';

// Framer Motion Variants
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

export const slideInVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3, ease: 'easeIn' },
  },
};

export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: 'backOut' },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

export const slideFromDirections = {
  up: {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  },
  down: {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 },
  },
  left: {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  },
  right: {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

export const brutalHoverVariants: Variants = {
  initial: {
    x: 0,
    y: 0,
    boxShadow: '8px 8px 0px #000000',
  },
  hover: {
    x: -2,
    y: -2,
    boxShadow: '12px 12px 0px #000000',
    transition: { duration: 0.15, ease: 'easeOut' },
  },
  tap: {
    x: 4,
    y: 4,
    boxShadow: '4px 4px 0px #000000',
    transition: { duration: 0.1, ease: 'easeOut' },
  },
};

export const glowPulseVariants: Variants = {
  initial: {
    boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
  },
  animate: {
    boxShadow: [
      '0 0 20px rgba(59, 130, 246, 0.3)',
      '0 0 40px rgba(59, 130, 246, 0.8)',
      '0 0 20px rgba(59, 130, 246, 0.3)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const morphingVariants: Variants = {
  animate: {
    borderRadius: ['20%', '50%', '10%', '40%', '20%'],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const floatVariants: Variants = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const rubberBandVariants: Variants = {
  animate: {
    scaleX: [1, 1.25, 0.75, 1.15, 0.95, 1.05, 1],
    scaleY: [1, 0.75, 1.25, 0.85, 1.05, 0.95, 1],
    transition: {
      duration: 1,
      ease: 'easeInOut',
    },
  },
};

export const heartbeatVariants: Variants = {
  animate: {
    scale: [1, 1.3, 1, 1.3, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
      times: [0, 0.14, 0.28, 0.42, 0.7],
    },
  },
};

export const shakeVariants: Variants = {
  animate: {
    x: [0, -10, 10, -10, 10, 0],
    transition: {
      duration: 0.82,
      ease: 'easeInOut',
    },
  },
};

// Animation Presets for Common Use Cases
export const animationPresets = {
  // Page transitions
  pageTransition: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: 'easeInOut' },
  },

  // Modal animations
  modalBackdrop: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 },
  },

  modalContent: {
    initial: { opacity: 0, scale: 0.8, y: 50 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.8, y: 50 },
    transition: { duration: 0.3, ease: 'backOut' },
  },

  // Card animations
  cardHover: {
    whileHover: {
      y: -5,
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      transition: { duration: 0.2 },
    },
  },

  brutalCardHover: {
    whileHover: {
      x: -2,
      y: -2,
      boxShadow: '12px 12px 0px #000000',
      transition: { duration: 0.15 },
    },
    whileTap: {
      x: 4,
      y: 4,
      boxShadow: '4px 4px 0px #000000',
      transition: { duration: 0.1 },
    },
  },

  // Button animations
  buttonPress: {
    whileTap: { scale: 0.95 },
  },

  brutalButtonPress: {
    whileHover: brutalHoverVariants.hover,
    whileTap: brutalHoverVariants.tap,
  },

  // List item animations
  listItem: {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  },

  // Loading animations
  spinner: {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      },
    },
  },

  pulse: {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },
};

// Utility functions
export const createStaggeredAnimation = (
  _children: number,
  staggerDelay = 0.1,
  baseAnimation = slideInVariants
) => ({
  visible: {
    ...baseAnimation.visible,
    transition: {
      ...baseAnimation.visible.transition,
      staggerChildren: staggerDelay,
      delayChildren: 0.1,
    },
  },
});

export const createDelayedAnimation = (delay: number, baseAnimation = fadeInVariants) => ({
  ...baseAnimation,
  visible: {
    ...baseAnimation.visible,
    transition: {
      ...baseAnimation.visible.transition,
      delay,
    },
  },
});

// DeFi-specific animations
export const defiAnimations = {
  priceChange: (isPositive: boolean) => ({
    animate: {
      color: isPositive ? '#10b981' : '#ef4444',
      scale: [1, 1.1, 1],
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  }),

  profitGlow: {
    animate: {
      boxShadow: [
        '0 0 20px rgba(16, 185, 129, 0.3)',
        '0 0 40px rgba(16, 185, 129, 0.8)',
        '0 0 20px rgba(16, 185, 129, 0.3)',
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },

  lossGlow: {
    animate: {
      boxShadow: [
        '0 0 20px rgba(239, 68, 68, 0.3)',
        '0 0 40px rgba(239, 68, 68, 0.8)',
        '0 0 20px rgba(239, 68, 68, 0.3)',
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },

  stakingPulse: {
    animate: {
      boxShadow: [
        '0 0 20px rgba(168, 85, 247, 0.3)',
        '0 0 40px rgba(168, 85, 247, 0.8)',
        '0 0 20px rgba(168, 85, 247, 0.3)',
      ],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },
};

// Shimmer effect utility for loading states
export const shimmerVariants: Variants = {
  animate: {
    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// Gradient animation variants
export const gradientAnimationVariants: Variants = {
  animate: {
    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

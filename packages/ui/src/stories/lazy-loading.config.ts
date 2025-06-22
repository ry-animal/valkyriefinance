// Lazy loading configuration for Storybook stories
export const LAZY_LOADING_CONFIG = {
  // Enable lazy loading for heavy components
  enableLazyLoading: true,

  // Intersection observer options for progressive loading
  intersectionOptions: {
    rootMargin: '50px',
    threshold: 0.1,
  },

  // Components that should be loaded lazily
  lazyComponents: [
    'Design-System-Showcase',
    'Enhanced-Design-System',
    'Web3-Patterns',
    'Interactive-Demo',
  ],

  // Tree shaking optimization - only import what's needed
  treeShakeOptimization: {
    // Lucide icons - import individually instead of entire library
    icons: {
      // Only import icons that are actually used
      used: [
        'ArrowRight',
        'BarChart3',
        'Check',
        'ChevronDown',
        'DollarSign',
        'ExternalLink',
        'TrendingUp',
        'Wallet',
        'Zap',
        'AlertTriangle',
        'ArrowUpDown',
        'CheckCircle',
        'Copy',
        'Globe',
        'Lock',
        'RefreshCw',
        'Shield',
      ],
    },

    // Framer Motion - import only used components
    framerMotion: {
      used: ['motion', 'AnimatePresence'],
    },
  },
};

// Progressive loading thresholds
export const PROGRESSIVE_LOADING = {
  // Load critical components first
  critical: ['button', 'card', 'input', 'label'],

  // Load secondary components after critical ones
  secondary: ['dialog', 'tooltip', 'progress', 'avatar'],

  // Load heavy components last
  heavy: ['animations', 'showcase', 'interactive-demo'],

  // Delay between loading phases (ms)
  loadingDelay: 100,
};

import type { NextConfig } from 'next';

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Performance optimizations
  poweredByHeader: false,

  // Transpile packages for monorepo support
  transpilePackages: ['@valkyrie/ui', '@valkyrie/common', '@valkyrie/contracts'],

  // Compiler optimizations
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Turbopack configuration (moved from experimental)
  turbopack: {
    resolveAlias: {
      '@': './src',
    },
  },

  // Experimental features for performance
  experimental: {
    // Enable experimental optimizations for UI package - temporarily disabled due to build issues
    // optimizePackageImports: ['@valkyrie/ui', '@/components/ui'],
    // Enable optimized CSS loading - disabled due to missing critters dependency
    optimizeCss: false,
    // Enable React compiler (if using React 19+) - disabled due to babel plugin missing
    reactCompiler: false,
    // Force dynamic rendering for all pages to avoid SSR issues
    forceSwcTransforms: true,
    typedRoutes: true,
  },

  // Optimize bundle splitting
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Separate vendor chunks
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
            },
            // Separate UI library chunks
            // ui: {
            //   test: /[\\/]packages[\\/]ui[\\/]/,
            //   name: 'ui',
            //   chunks: 'all',
            //   priority: 20,
            // },
            // Common chunks
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 5,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    return config;
  },

  // Security headers for comprehensive protection
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Prevent MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Prevent clickjacking attacks
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // Legacy XSS protection (deprecated but still useful)
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Enhanced Content Security Policy for Web3 and DeFi apps
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cloudflare-eth.com https://*.alchemy.com https://*.walletconnect.org https://*.reown.com https://cdn.jsdelivr.net",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data: https://fonts.gstatic.com",
              "connect-src 'self' https: wss: https://cloudflare-eth.com https://*.alchemy.com https://*.walletconnect.org https://*.reown.com https://api.coingecko.com https://defillama.com",
              "frame-src 'none'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests"
            ].join('; '),
          },
          // Referrer policy for privacy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Permissions policy to restrict dangerous features
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          // Strict Transport Security (HTTPS only) - only in production
          ...(process.env.NODE_ENV === 'production' ? [{
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          }] : []),
        ],
      },
    ];
  },

  // Optimize images for better performance
  images: {
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Enable compression in production
  compress: true,

  // Output configuration for static export if needed
  output: process.env.NEXT_OUTPUT === 'export' ? 'export' : undefined,
  trailingSlash: process.env.NEXT_OUTPUT === 'export',

  // Disable x-powered-by header for security
  generateEtags: false,

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

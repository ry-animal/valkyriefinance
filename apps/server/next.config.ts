import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: ['@valkyrie/config'],
  trailingSlash: false,
  // Disable static generation for error pages to avoid React context issues
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    // This might help with error page generation issues
    workerThreads: false,
  },
  // Skip building error pages
  skipMiddlewareUrlNormalize: true,
  skipTrailingSlashRedirect: true,
};

export default nextConfig;

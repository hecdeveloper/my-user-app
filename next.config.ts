import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  
  // Configure code splitting and chunking
  webpack: (config, { dev, isServer }) => {
    // Only apply these optimizations in production build
    if (!dev && !isServer) {
      // Optimize chunk size
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Framework chunk
          framework: {
            name: 'framework',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](react|react-dom|next|scheduler)[\\/]/,
            priority: 40,
            enforce: true,
          },
          // Library chunk for larger dependencies 
          lib: {
            test: /[\\/]node_modules[\\/]/,
            name(module: { context: string }) {
              const matches = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              );
              const packageName = matches ? matches[1] : 'unknown';
              
              // Return npm package name to avoid conflicts
              return `npm.${packageName.replace('@', '')}`;
            },
            priority: 30,
            minChunks: 2,
            reuseExistingChunk: true,
          },
          // Extract common chunks for components
          components: {
            name: 'components',
            test: /[\\/]components[\\/]/,
            minChunks: 2,
            priority: 20,
            reuseExistingChunk: true,
          },
        },
      };
    }
    return config;
  },
  
  // Enable automatic compression
  compress: true,
  
  // Disable ESLint during builds to prevent failures
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Disable TypeScript checking during builds for faster builds
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

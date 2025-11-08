const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'placekitten.com',
      },
      {
        protocol: 'https',
        hostname: 'silvercrossus.com',
      },
      {
        protocol: 'https',
        hostname: 'images.babylist.com',
      },
      {
        protocol: 'https',
        hostname: 'babylist.com',
      },
    ],
  },
  experimental: {
    typedRoutes: false,
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  async redirects() {
    return [
      {
        source: '/academy/:path*',
        destination: '/dashboard/learn/:path*',
        permanent: true,
      },
      {
        source: '/dashboard/learn/nursery',
        destination: '/dashboard/learn/welcome',
        permanent: true,
      },
      {
        source: '/dashboard/learn/gear',
        destination: '/dashboard/learn/welcome',
        permanent: true,
      },
      {
        source: '/dashboard/learn/postpartum',
        destination: '/dashboard/learn/welcome',
        permanent: true,
      },
    ];
  },
  webpack: (config) => {
    config.resolve.alias['@prisma/client'] = path.resolve(__dirname, '../../node_modules/@prisma/client');
    config.resolve.alias['.prisma/client'] = path.resolve(__dirname, '../../node_modules/.prisma/client');
    config.resolve.alias['packages/db/prisma'] = path.resolve(__dirname, '../../packages/db/prisma.ts');
    return config;
  },
};

module.exports = nextConfig;

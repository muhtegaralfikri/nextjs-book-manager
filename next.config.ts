import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // Izinkan domain 'example.com' (dari data dummy)
        protocol: 'https',
        hostname: 'example.com',
        port: '',
        pathname: '/**',
      },
      {
        // Izinkan domain 'via.placeholder.com' (fallback)
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        // Hostname Goodreads/Amazon
        protocol: 'https',
        hostname: 'images-na.ssl-images-amazon.com',
        port: '',
        pathname: '/**',
      },
      {
        // Hostname Bukabuku
        protocol: 'https',
        hostname: 'img.bukabuku.net',
        port: '',
        pathname: '/**',
      },
      {
        // Hostname Bukukita
        protocol: 'https',
        hostname: 'bukukita.com',
        port: '',
        pathname: '/**',
      },
      {
        // (Hostname Vercel Blob
        protocol: 'https',
        hostname: '*.blob.vercel-storage.com', 
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

import type {NextConfig} from 'next';

const remotePatterns: NextConfig['images']['remotePatterns'] = [
  {
    protocol: 'http',
    hostname: 'mike.bilalgul.dpdns.org',
    port: '',
    pathname: '/**',
  },
  {
    protocol: 'https',
    hostname: 'mike.bilalgul.dpdns.org',
    port: '',
    pathname: '/**',
  },
  {
    protocol: 'https',
    hostname: 'placehold.co',
    port: '',
    pathname: '/**',
  },
  {
    protocol: 'https',
    hostname: 'images.unsplash.com',
    port: '',
    pathname: '/**',
  },
  {
    protocol: 'https',
    hostname: 'picsum.photos',
    port: '',
    pathname: '/**',
  },
];


const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns,
  },
};

export default nextConfig;

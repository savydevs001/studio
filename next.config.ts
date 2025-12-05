import type {NextConfig} from 'next';

const appHostname = process.env.NEXT_PUBLIC_APP_URL
  ? new URL(process.env.NEXT_PUBLIC_APP_URL).hostname
  : undefined;

const remotePatterns: NextConfig['images']['remotePatterns'] = [
  {
    protocol: 'http',
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

if (appHostname) {
  remotePatterns.push({
    protocol: 'http',
    hostname: appHostname,
    port: '',
    pathname: '/**',
  });
  remotePatterns.push({
    protocol: 'https',
    hostname: appHostname,
    port: '',
    pathname: '/**',
  });
}


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

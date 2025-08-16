import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pioneirosdoadvento.com',
        port: '',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: 'sso.pioneirosdoadvento.com',
        port: '',
        pathname: '**'
      }
    ]
  }
};

export default nextConfig;

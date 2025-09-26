import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '/alternatives/react-nextjs-mui-reactquery',
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;

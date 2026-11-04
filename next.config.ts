/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  assetPrefix: process.env.ASSET_PREFIX || undefined,
};

export default nextConfig;

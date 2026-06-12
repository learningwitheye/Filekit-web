/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 🚨 YEH HAI ASLI RAM BAAN (For Cloudflare Static Export)
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      canvas: false,
    };
    return config;
  },
};

module.exports = nextConfig;
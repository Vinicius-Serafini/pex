const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    config.resolve.alias = {
      ...config.resolve.alias,
      Server: path.resolve(__dirname, 'src/server/')
    }

    return config;
  }
}

module.exports = nextConfig

import('./src/env.mjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  transpilePackages: ['@esa/types'],
  images: {
    domains: ['api.mapbox.com', 'localhost', process.env.NEXT_PUBLIC_API_URL],
  },
  env: {
    RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED: 'false',
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.tsx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgoConfig: {
              plugins: [
                {
                  name: 'removeViewBox',
                  active: false,
                },
              ],
            },
          },
        },
      ],
    });

    return config;
  },
};

export default nextConfig;

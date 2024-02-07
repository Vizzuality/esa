import('./src/env.mjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  output: 'standalone',
  transpilePackages: ['@esa/types'],
  images: {
    domains: [
      'api.mapbox.com',
      'localhost',
      process.env.NEXT_PUBLIC_API_URL,
      'esa-gda-comms-staging-cms.fra1.digitaloceanspaces.com',
      'fra1.digitaloceanspaces.com',
      'esa-gda-comms-staging-mfafc.ondigitalocean.app',
    ],
  },
  env: {
    RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED: 'false',
    NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH || '',
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

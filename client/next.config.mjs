/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  output: 'standalone',
  transpilePackages: ['@esa/types'],
  images: {
    domains: [
      'api.mapbox.com',
      ...(process.env.NEXT_PUBLIC_API_URL
        ? [new URL(process.env.NEXT_PUBLIC_API_URL).hostname]
        : []),
      'esa-gda-comms-staging-cms.fra1.digitaloceanspaces.com',
      'fra1.digitaloceanspaces.com',
      'esa-gda-comms-staging-mfafc.ondigitalocean.app',
      'https://impact-sphere-gda.esa.int',
    ],
  },
  env: {
    RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED: 'false',
    NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH || '',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  redirects: async () => {
    return [
      {
        source: '/',
        has: [
          {
            type: 'cookie',
            key: 'esa-visited',
            value: 'true',
          },
        ],
        permanent: false,
        destination: '/globe',
      },
      {
        source: '/',
        missing: [
          {
            type: 'cookie',
            key: 'esa-visited',
          },
        ],
        permanent: false,
        destination: '/home',
      },
    ];
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

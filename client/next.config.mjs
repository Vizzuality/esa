/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  output: 'standalone',
  transpilePackages: ['@esa/types'],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.mapbox.com',
      },
      ...(process.env.NEXT_PUBLIC_API_URL
        ? [
            {
              protocol: 'https',
              hostname: new URL(process.env.NEXT_PUBLIC_API_URL).hostname,
            },
          ]
        : []),
      {
        protocol: 'https',
        hostname: 'esa-gda-comms-staging-cms.fra1.digitaloceanspaces.com',
      },
      {
        protocol: 'https',
        hostname: 'fra1.digitaloceanspaces.com',
      },
      {
        protocol: 'https',
        hostname: 'esa-gda-comms-staging-mfafc.ondigitalocean.app',
      },
      {
        protocol: 'https',
        hostname: 'impact-sphere-gda.esa.int',
      },
      {
        protocol: 'https',
        hostname: 'esa-dev-public.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'esa-dev-public.s3.eu-west-3.amazonaws.com',
      },
    ],
  },

  env: {
    RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED: 'false',
    NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH || '',
  },

  typescript: { ignoreBuildErrors: true },

  async redirects() {
    return [
      {
        source: '/',
        has: [{ type: 'cookie', key: 'esa-visited', value: 'true' }],
        permanent: false,
        destination: '/globe',
      },
      {
        source: '/',
        missing: [{ type: 'cookie', key: 'esa-visited' }],
        permanent: false,
        destination: '/home',
      },
    ];
  },

  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
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
              plugins: [{ name: 'removeViewBox', active: false }],
            },
          },
        },
      ],
    });
    return config;
  },
};

export default nextConfig;

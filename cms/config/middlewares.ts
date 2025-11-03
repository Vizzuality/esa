export default ({ env }) => [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'script-src': ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net', 'api.mapbox.com'],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            // Support both DigitalOcean Spaces (for legacy/staging) and AWS S3
            `*.${env('BUCKET_REGION')}.digitaloceanspaces.com`,
            `${env('BUCKET_REGION')}.digitaloceanspaces.com`,
            // AWS S3 - both regional and legacy global URL formats
            `*.s3.${env('BUCKET_REGION', 'eu-west-3')}.amazonaws.com`,
            `s3.${env('BUCKET_REGION', 'eu-west-3')}.amazonaws.com`,
            '*.s3.amazonaws.com', // Legacy virtual-hosted-style URL
            's3.amazonaws.com', // Legacy path-style URL
            'api.mapbox.com',
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            // Support both DigitalOcean Spaces (for legacy/staging) and AWS S3
            `*.${env('BUCKET_REGION')}.digitaloceanspaces.com`,
            `${env('BUCKET_REGION')}.digitaloceanspaces.com`,
            // AWS S3 - both regional and legacy global URL formats
            `*.s3.${env('BUCKET_REGION', 'eu-west-3')}.amazonaws.com`,
            `s3.${env('BUCKET_REGION', 'eu-west-3')}.amazonaws.com`,
            '*.s3.amazonaws.com', // Legacy virtual-hosted-style URL
            's3.amazonaws.com', // Legacy path-style URL
          ],
          'worker-src': ['blob:'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  {
    name: 'strapi::body',
    config: {
      formLimit: '256mb', // modify form body
      jsonLimit: '256mb', // modify JSON body
      textLimit: '256mb', // modify text body
      formidable: {
        maxFileSize: 300 * 1024 * 1024, // multipart data, modify here limit of uploaded file size
      },
    },
  },
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];

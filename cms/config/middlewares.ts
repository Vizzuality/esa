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
          'img-src': ["'self'", 'data:', 'blob:', `https://${env('DO_SPACE_BUCKET')}.${env('DO_SPACE_REGION')}.digitaloceanspaces.com`, `${env('DO_SPACE_REGION')}.digitaloceanspaces.com/${env('DO_SPACE_BUCKET')}`],
          'media-src': ["'self'", 'data:', 'blob:', `https://${env('DO_SPACE_BUCKET')}.${env('DO_SPACE_REGION')}.digitaloceanspaces.com`, `${env('DO_SPACE_REGION')}.digitaloceanspaces.com/${env('DO_SPACE_BUCKET')}`],
          'worker-src': ['blob:', `https://${env('DO_SPACE_BUCKET')}.${env('DO_SPACE_REGION')}.digitaloceanspaces.com`, `${env('DO_SPACE_REGION')}.digitaloceanspaces.com/${env('DO_SPACE_BUCKET')}`],
          upgradeInsecureRequests: null,
        },
      }
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  {
    name: "strapi::body",
    config: {
      formLimit: "256mb", // modify form body
      jsonLimit: "256mb", // modify JSON body
      textLimit: "256mb", // modify text body
      formidable: {
        maxFileSize: 300 * 1024 * 1024, // multipart data, modify here limit of uploaded file size
      },
    },
  },
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];

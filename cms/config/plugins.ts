
module.exports = ({ env }) => ({
  documentation: {
    config: {
      "x-strapi-config": {
        mutateDocumentation: (generatedDocumentationDraft) => {
          console.log("generatedDocumentationDraft", generatedDocumentationDraft);
          Object.keys(generatedDocumentationDraft.paths).forEach((path) => {
            // check if it has {id} in the path
            if (path.includes("{id}")) {
              // add `populate` as params
              if (generatedDocumentationDraft.paths[path].get) {
                if (!generatedDocumentationDraft.paths[path].get.parameters.find((param) => param.name === "populate")) {
                  generatedDocumentationDraft.paths[path].get.parameters.push(
                    {
                      "name": "populate",
                      "in": "query",
                      "description": "Relations to return",
                      "deprecated": false,
                      "required": false,
                      "schema": {
                        "type": "string"
                      }
                    },
                  );
                }
              }
            }
          });
        },
      },
      'strapi-plugin-populate-deep': {
        config: {
          defaultDepth: 5, // Default is 5
        }
      },
    },
  },
  'map-field': {
    enabled: true,
    resolve: './src/plugins/map-field'
  },
  ...(env('STRAPI_MEDIA_LIBRARY_PROVIDER') === 'digitalocean' && {
    upload: {
      config: {
        provider: "aws-s3",
        providerOptions: {
          accessKeyId: env("BUCKET_ACCESS_KEY"),
          secretAccessKey: env("BUCKET_SECRET_KEY"),
          endpoint: env("BUCKET_ENDPOINT"),
          region: env("BUCKET_REGION"),
          params: {
            Bucket: env("BUCKET_BUCKET")
          },
        },
      },
    },
  }),
  'preview-button': {
    config: {
      contentTypes: [
        {
          uid: 'api::story.story',
          draft: {
            url: `${env('STRAPI_ADMIN_PREVIEW_URL')}/api/preview`,
            query: {
              secret: env('STRAPI_ADMIN_PREVIEW_SECRET'),
              slug: '{id}'
            },
          },
          published: {
            url: `${env('STRAPI_ADMIN_PREVIEW_URL')}/stories/{id}`,
          },
        },
      ],
    },
  },
});


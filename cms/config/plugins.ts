
module.exports = ({env}) => ({
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
        provider: "strapi-provider-upload-do",
        providerOptions: {
          key: env('DO_SPACE_ACCESS_KEY'),
          secret: env('DO_SPACE_SECRET_KEY'),
          endpoint: `https://${env('DO_SPACE_REGION')}.digitaloceanspaces.com`,
          space: env('DO_SPACE_BUCKET'),
        }
      },
    },
  }),
});

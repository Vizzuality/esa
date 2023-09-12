import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => {
  // registeration phase
  strapi.customFields.register({
    name: 'map-field',
    plugin: 'map-field',
    type: 'json',
    inputSize: { // optional
      default: 4,
      isResizable: true,
    },
  });
};

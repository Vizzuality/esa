import { prefixPluginTranslations } from '@strapi/helper-plugin';

import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import Initializer from './components/Initializer';
import PluginIcon from './components/PluginIcon';

const name = pluginPkg.strapi.name;

export default {
  register(app: any) {
    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: name,
      },
      Component: async () => {
        const component = await import(/* webpackChunkName: "[request]" */ './pages/App');

        return component;
      },
      permissions: [
        // Uncomment to set the permissions of the plugin here
        // {
        //   action: '', // the action name should be plugin::plugin-name.actionType
        //   subject: null,
        // },
      ],
    });
    const plugin = {
      id: pluginId,
      initializer: Initializer,
      isReady: false,
      name,
    };

    app.registerPlugin(plugin);

    app.customFields.register({
      name: 'map-field',
      pluginId: 'map-field',
      type: 'json',
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: 'Map',
      },
      intlDescription: {
        id: `${pluginId}.plugin.description`,
        defaultMessage: 'Mapbox map field',
      },
      icon: PluginIcon, // don't forget to create/import your icon component
      components: {
        Input: async () =>
          import(/* webpackChunkName: "input-component" */ './components/PluginInput'),
      },
      options: {
        base: [
          /*
            Declare settings to be added to the "Base settings" section
            of the field in the Content-Type Builder
          */
          {
            sectionTitle: {
              // Add a "Format" settings section
              id: 'map-field.type',
              defaultMessage: 'Location type',
            },
            items: [
              // Add settings items to the section
              {
                intlLabel: {
                  id: 'map-field.type.label',
                  defaultMessage: 'Location type',
                },
                name: 'options.format',
                type: 'select',
                value: 'map', // option selected by default
                options: [
                  {
                    key: 'map',
                    defaultValue: 'map',
                    value: 'map',
                    metadatas: {
                      intlLabel: {
                        id: 'options.format.map',
                        defaultMessage: 'map',
                      },
                    },
                  },
                  {
                    key: 'marker',
                    value: 'marker',
                    metadatas: {
                      intlLabel: {
                        id: 'options.format.marker',
                        defaultMessage: 'marker',
                      },
                    },
                  },
                ],
              },
            ],
          },
        ],
        advanced: [
          {
            sectionTitle: {
              id: 'global.settings',
              defaultMessage: 'Settings',
            },
            items: [
              {
                name: 'required',
                type: 'checkbox',
                intlLabel: {
                  id: 'form.attribute.item.requiredField',
                  defaultMessage: 'Required field',
                },
                description: {
                  id: 'form.attribute.item.requiredField.description',
                  defaultMessage: "You won't be able to create an entry if this field is empty",
                },
              },
            ],
          },
        ],
      },
    });
  },

  bootstrap(app: any) {},

  async registerTrads(app: any) {
    const { locales } = app;

    const importedTrads = await Promise.all(
      (locales as any[]).map((locale) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};

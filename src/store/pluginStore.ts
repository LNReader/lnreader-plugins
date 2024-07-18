import { Plugin } from '@typings/plugin';
import { StoreCreator } from '.';
import { getPlugin } from '@provider/plugins';

export type PluginStore = {
  selectedPlugin?: Plugin.PluginItem;
  plugin?: Plugin.PluginBase;
  selectPlugin(plugin: Plugin.PluginItem): void;
};

/**
 * @param set State setter for use inside actions
 * @param get State getter for use inside actions, outside of State setter
 */
export const PluginStore: StoreCreator<PluginStore> = set => ({
  // this is initial state
  // selectedPlugin: undefined,

  // those are actions
  selectPlugin(plugin) {
    set(state => ({
      ...state,
      selectedPlugin: plugin,
      plugin: getPlugin(plugin.id),
    }));
  },
});

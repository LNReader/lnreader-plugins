import { Plugin } from '@typings/plugin';

const plugins: Plugin.PluginBase[] = [];

export const loadPlugins = async () => {
  const paths = await fetch('pluginPaths').then(res => res.json());
  for (const path of paths) {
    const relativePath = '../plugins/' + path;
    const plugin: Plugin.PluginBase = (
      await import(/* @vite-ignore */ relativePath)
    ).default;
    plugins.push(plugin);
  }
};

export const searchPlugins = (keyword: string) => {
  return plugins.filter(
    f => f.name.includes(keyword) || f.id.includes(keyword),
  );
};

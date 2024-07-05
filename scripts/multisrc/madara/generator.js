import list from './sources.json' with { type: 'json' };
import { existsSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const folder = dirname(fileURLToPath(import.meta.url));

export const generateAll = function () {
  return list.map(source => {
    const exist = existsSync(join(folder, 'filters', source.id + '.json'));
    if (exist) {
      const filters = readFileSync(
        join(folder, 'filters', source.id + '.json'),
      );
      source.filters = JSON.parse(filters);
    }
    console.log(
      '[madara] Generating:',
      metadata.id.padEnd(20),
      metadata.options?.down
        ? '🔽site is down🔽'
        : metadata.filters
          ? '🔎with filters🔍'
          : '🚫 no filters 🚫',
      metadata.options?.downSince
        ? `since: ${metadata.options?.downSince}`
        : '',
    );
    return generator(source);
  });
};

const generator = function generator(source) {
  const madaraTemplate = readFileSync(join(folder, 'template.ts'), {
    encoding: 'utf-8',
  });

  const pluginScript = `
${madaraTemplate}
const plugin = new MadaraPlugin(${JSON.stringify(source)});
export default plugin;
    `.trim();
  return {
    lang: source.options?.lang || 'English',
    filename: source.sourceName,
    pluginScript,
    down: metadata.options?.down,
  };
};

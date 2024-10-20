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
      source.filters = JSON.parse(filters).filters;
    }
    console.log(
      '[lightnovelwp] Generating:',
      source.id.padEnd(20),
      source.options?.down
        ? '🔽site is down🔽'
        : source.filters
          ? '🔎with filters🔍'
          : '🚫 no filters 🚫',
      source.options?.downSince ? `since: ${source.options?.downSince}` : '',
    );
    return generator(source);
  });
};

const generator = function generator(source) {
  const LightNovelWPTemplate = readFileSync(join(folder, 'template.ts'), {
    encoding: 'utf-8',
  });

  const pluginScript = `
${LightNovelWPTemplate.replace(
  '// CustomJS HERE',
  source.options?.customJs || '',
)}
const plugin = new LightNovelWPPlugin(${JSON.stringify(source)});
export default plugin;
    `.trim();

  return {
    lang: source.options?.lang || 'English',
    filename: source.sourceName,
    pluginScript,
    down: source.options?.down || false,
  };
};

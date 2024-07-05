import list from './sources.json' with { type: 'json' };
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const generateAll = function () {
  list.sort((a, b) => a.id.length - b.id.length);
  return list.map(source => {
    try {
      const filters = JSON.parse(
        readFileSync(`${__dirname}/filters/mtlnovel.json`, 'utf-8'),
      );
      source.filters = filters;
    } catch (e) {}
    console.log(
      `[mtlnovel] Generating: ${source.id}`.padEnd(35),
      source.filters ? '🔎with filters🔍' : '🚫 no filters 🚫',
    );
    return generator(source);
  });
};

const generator = function generator(source) {
  const MTLNovelTemplate = readFileSync(__dirname + '/template.ts', {
    encoding: 'utf-8',
  });

  const pluginScript = `
  ${MTLNovelTemplate}

const plugin = new MTLNovelPlugin(${JSON.stringify(source)});
export default plugin;
    `.trim();

  return {
    lang: source.options?.lang || 'English',
    filename: source.sourceName,
    pluginScript,
  };
};

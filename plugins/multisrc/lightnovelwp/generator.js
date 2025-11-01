import list from './sources.json' with { type: 'json' };
import { existsSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';

const folder = dirname(fileURLToPath(import.meta.url));

const LightNovelWPTemplate = readFileSync(join(folder, 'template.ts'), {
  encoding: 'utf-8',
});

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
      `[lightnovelwp] Generating: ${source.id} ${' '.repeat(20 - source.id.length)} ${source.filters ? '🔎with filters🔍' : '🚫no filters🚫'}`,
    );
    return generator(source);
  });
};

const generator = function generator(source) {
  const chapterTransformJsOrPath = source.options?.customJs?.chapterTransform;
  const chapterTransformPath = chapterTransformJsOrPath
    ? join(folder, chapterTransformJsOrPath)
    : '';
  const chapterTransformJs = existsSync(chapterTransformPath)
    ? readFileSync(chapterTransformPath, { encoding: 'utf-8' })
    : chapterTransformJsOrPath;

  const pluginScript = `
${LightNovelWPTemplate.replace('// CustomJS HERE', chapterTransformJs || '')}
const plugin = new LightNovelWPPlugin(${JSON.stringify(source)});
export default plugin;
    `.trim();

  return {
    lang: source.options?.lang || 'English',
    filename: source.sourceName,
    pluginScript,
  };
};

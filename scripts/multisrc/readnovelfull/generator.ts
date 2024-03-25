import { readFileSync } from 'fs';
import path from 'path';

import list from './sources.json';
import { ReadNovelFullMetadata } from './template';
import { ScrpitGeneratorFunction } from '../generate';

export const generateAll: ScrpitGeneratorFunction = function (name) {
  return list.map((metadata: ReadNovelFullMetadata) => {
    console.log(
      `[${name}] Generating: ${metadata.id}${' '.repeat(20 - metadata.id.length)}`,
    );
    return generator(metadata);
  });
};

const generator = function generator(metadata: ReadNovelFullMetadata) {
  const readNovelFullTemplate = readFileSync(
    path.join(__dirname, 'template.ts'),
    { encoding: 'utf-8' },
  );

  const pluginScript = `
${readNovelFullTemplate}
const plugin = new ReadNovelFullPlugin(${JSON.stringify(metadata)});
export default plugin;
    `.trim();
  return {
    lang: metadata.options?.lang || 'English',
    filename: metadata.sourceName,
    pluginScript,
  };
};

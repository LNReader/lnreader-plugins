import { ScrpitGeneratorFunction } from '../generate';
import { ReadwnMetadata } from './template';
import list from './sources.json';
import { readFileSync } from 'fs';
import path from 'path';

export const generateAll: ScrpitGeneratorFunction = function (name) {
  return list.map((metadata: ReadwnMetadata) => {
    try {
      const { filters }: any = require(`./filters/${metadata.id}`);
      metadata.filters = filters;
    } catch (e) {}
    console.log(
      `[${name}] Generating: ${metadata.id}${' '.repeat(20 - metadata.id.length)} ${metadata.filters ? '🔎with filters🔍' : '🚫no filters🚫'}`,
    );
    return generator(metadata);
  });
};

const generator = function generator(metadata: ReadwnMetadata) {
  const readwnTemplate = readFileSync(path.join(__dirname, 'template.ts'), {
    encoding: 'utf-8',
  });

  const pluginScript = `
${readwnTemplate}
const plugin = new ReadwnPlugin(${JSON.stringify(metadata)});
export default plugin;
    `.trim();

  return {
    lang: 'english',
    filename: metadata.sourceName,
    pluginScript,
  };
};

import list from './sources.json' with { type: 'json' };
import { readFileSync } from 'fs';
import path from 'path';

const FilterTypes = {
  TextInput: 'Text',
  Picker: 'Picker',
  CheckboxGroup: 'Checkbox',
  Switch: 'Switch',
  ExcludableCheckboxGroup: 'XCheckbox',
};

const lang = {
  en: 'english',
  ru: 'russian',
  es: 'spanish',
  pt: 'portuguese',
  th: 'turkish',
};

export const generateAll = function () {
  return list
    .map(p => {
      const filters = {};
      for (const k in p.filters) {
        const f = p.filters[k];
        if (f) {
          filters[k] = {
            ...f,
            type: FilterTypes.Picker,
          };
        }
      }
      return { ...p, filters };
    })
    .map(metadata => {
      console.log(`[hotnovelpub]: Generating`, metadata.id);
      return generator(metadata);
    });
};

const generator = function generator(metadata) {
  const HotNovelPubTemplate = readFileSync(
    './scripts/multisrc/hotnovelpub/template.ts',
    {
      encoding: 'utf-8',
    },
  );

  const pluginScript = `
    ${HotNovelPubTemplate}
const plugin = new HotNovelPubPlugin(${JSON.stringify(metadata).replace(
    /"type":"([^"]+)"/g,
    '"type":FilterTypes.$1',
  )});
export default plugin;
    `.trim();

  return {
    lang: lang[metadata?.options?.lang || 'en'] || 'english',
    filename: metadata.sourceName,
    pluginScript,
  };
};

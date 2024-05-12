require('module-alias/register');
import * as fs from 'fs';
import { Plugin } from '@typings/plugin';
import { languages } from '@libs/languages';
import * as path from 'path';

const root = path.join(__dirname, '..');
const size = 96;

const skip: string[] = [
  //custom icons
  'ReN',
  'sektenovel',
  'FWK.US',
  'daonovel',
  'dragontea',
  'foxaholic',
  'kiniga',
  'sonicmtl',
  'translatinotaku',
  'wuxiaworld.site',
  'moonlightnovel',
  'mtl-novel',
  'mysticalmerries',
  'lightnovelpubvip',
  'novelTL',

  //low quality
  'BLN',
  'novelhall',
  'NO.net',
  'novelbookid',
  'olaoe',

  //broken icons
  'guavaread',
  'LightNovelUpdates',
  'turkcelightnovels',
  'novelki.pl',
  'lunarletters',
  'novelsparadise',
  'earlynovel',
  'wbnovel',
  'novhell',
  'RLIB',
];

const used = new Set();
used.add(path.join(root, 'icons', 'coverNotAvailable.webp'));

(async () => {
  console.log('Loading plugins.json ⌛');
  const plugin_path = path.join(root, '.dist', 'plugins.json');
  if (!fs.existsSync(plugin_path)) {
    console.log('❌', plugin_path, 'not found (run "json_plugins.ts" first)');
    return;
  }
  const plugins = JSON.parse(fs.readFileSync(plugin_path, 'utf-8'));
  console.log('\nDownloading icons ⌛');
  let language;
  for (let plugin in plugins) {
    const { id, name, site, iconUrl, lang } = plugins[plugin];
    if (language !== lang) {
      language = lang;
      console.log(
        ` ${language} `
          .padStart(Math.floor((language.length + 32) / 2), '=')
          .padEnd(30, '='),
      );
    }
    let icon;
    if (iconUrl) icon = 'icons/' + iconUrl.split('icons/')[1];
    try {
      if (icon) used.add(path.join(root, icon));

      if (!skip.includes(id) && icon && site) {
        const image = await fetch(
          `https://www.google.com/s2/favicons?domain=${site}&sz=${size}&type=png`,
        )
          .then(res => res.arrayBuffer())
          .then(res => Buffer.from(res));

        const notAvailableImage = fs.readFileSync(
          path.join(root, 'scripts', 'notavailable.png'),
        );

        if (Buffer.compare(image, notAvailableImage) === 0) {
          console.log(
            '  ',
            name.padEnd(26),
            `(${id})`.padEnd(20),
            'Is site down?',
            '\r❌',
          );
          continue;
        }

        fs.writeFileSync(icon, image);
        console.log('  ', name.padEnd(26), `(${id})`, '\r✅');
      } else {
        console.log('  ', `Skipping ${name}`.padEnd(26), `(${id})`, '\r🔄');
      }
    } catch (err) {
      console.log(
        '  ',
        name.padEnd(26),
        `(${id})`.padEnd(20),
        err instanceof Error ? err.constructor.name : typeof err,
        '\r❌',
      );
      console.log(err);
      await new Promise(resolve => setTimeout(resolve, 2500));
    }
  }
  console.log('\nDeleting unused icons  ⌛');

  function fileList(dir: string): string[] {
    return fs.readdirSync(dir).reduce((list: string[], file: string) => {
      const name = path.join(dir, file);
      const isDir = fs.statSync(name).isDirectory();
      return list.concat(isDir ? fileList(name) : [name]);
    }, []);
  }

  fileList(path.join(root, 'icons')).forEach(path => {
    if (!used.has(path)) {
      console.log('🗑️', path);
      fs.rmSync(path, { force: true });
    }
  });
  console.log('\nDone ✅');
})();

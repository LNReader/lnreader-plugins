/* global Buffer */
import * as fs from 'fs';
import * as path from 'path';
import sizeOf from 'image-size';

const size = 96;
const minSize = 16;

const skip = new Set([
  //custom icons
  'FWK.US',
  'ReN',
  'daonovel',
  'dragontea',
  'foxaholic',
  'kiniga',
  'lightnovelpubvip',
  'moonlightnovel',
  'mtl-novel',
  'mysticalmerries',
  'novelTL',
  'novelsparadise',
  'sektenovel',
  'sonicmtl',
  'translatinotaku',
  'warriorlegendtrad',
  'wuxiaworld.site',
]);

const used = new Set([
  path.join('public', 'icons', 'coverNotAvailable.webp'),
  path.join('public', 'icons', 'siteNotAvailable.png'),
]);

const notAvailableImage = fs.readFileSync(
  path.join('public', 'icons', 'siteNotAvailable.png'),
);

(async () => {
  console.log('Loading plugins.json ⌛');
  const plugin_path = path.join('.dist', 'plugins.json');
  if (!fs.existsSync(plugin_path)) {
    console.log('❌', plugin_path, 'not found (run "json_plugins.js" first)');
    return;
  }
  const plugins = JSON.parse(fs.readFileSync(plugin_path, 'utf-8'));

  console.log('\nDownloading icons ⌛');
  let language;
  for (let plugin in plugins) {
    const { id, name, site, iconUrl, lang } = plugins[plugin];
    const icon = iconUrl && 'public/icons/' + iconUrl.split('icons/')[1];

    if (language !== lang) {
      language = lang;
      console.log(
        ` ${language} `
          .padStart(Math.floor((language.length + 32) / 2), '=')
          .padEnd(30, '='),
      );
    }

    try {
      if (icon) used.add(path.join(icon));
      if (!skip.has(id) && icon && site) {
        const image = await fetch(
          `https://www.google.com/s2/favicons?domain=${site}&sz=${size}&type=png`,
        )
          .then(res => res.arrayBuffer())
          .then(res => Buffer.from(res));

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

        const imageSize = sizeOf(image);
        const exist = fs.existsSync(icon);

        if (!exist) {
          const dir = path.dirname(icon);
          fs.mkdirSync(dir, { recursive: true });
        }

        if (
          ((imageSize?.width || size) > minSize &&
            (imageSize?.height || size) > minSize) ||
          !exist
        ) {
          fs.writeFileSync(icon, image);
          console.log('  ', name.padEnd(26), `(${id})`, '\r✅');
        } else {
          console.log(
            '  ',
            name.padEnd(26),
            `(${id})`.padEnd(20),
            'Low quality',
            '\r🔄',
          );
        }
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

  fileList(path.join('public', 'icons')).forEach(path => {
    if (!used.has(path)) {
      console.log('🗑️', path);
      fs.rmSync(path, { force: true });
    }
  });
  console.log('\nDone ✅');
})();

function fileList(dir) {
  return fs.readdirSync(dir).reduce((list, file) => {
    const name = path.join(dir, file);
    const isDir = fs.statSync(name).isDirectory();
    return list.concat(isDir ? fileList(name) : [name]);
  }, []);
}

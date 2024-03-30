require('module-alias/register');
import * as fs from 'fs';
import { Plugin } from '@typings/plugin';
import { languages } from '@libs/languages';
import * as path from 'path';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
const root = path.dirname(__dirname);
const size = 96;

const skip: { [key: string]: boolean } = {
  //custom icons
  'ReN': true,

  //low quality
  'BLN': true,
  'novelhall': true,
  'NO.net': true,

  //broken icons
  'guavaread': true,
  'LightNovelUpdates': true,
  'turkcelightnovels': true,
  'novelki.pl': true,
  'lunarletters': true,

  //dead plugins?
  'freenovel.me': true,
  'daonovel': true,
  'mtl-novel': true,
  'novelroom': true,
  'zinnovel': true,
  'novelr18': true,
  'novelstic': true,
  'readwebnovels': true
};

const used = new Set();
used.add(path.join(root, '..', 'icons', 'coverNotAvailable.jpg'));

(async () => {
  console.log('\nDownloading icons ⌛');
  for (let language in languages) {
    const langPath = path.join(root, 'plugins', language.toLowerCase());
    if (!fs.existsSync(langPath)) continue;
    const plugins = fs.readdirSync(langPath);
    for (let i = 0; i < plugins.length; i++) {
      const instance: Plugin.PluginBase = require(
        `../plugins/${language.toLowerCase()}/${plugins[i].split('.')[0]}`,
      ).default;

      const { id, name, site, icon } = instance;
      if (icon) used.add(path.join(root, '..', 'icons', icon));

      if (!skip?.[id] && icon && site) {
        try {
          const image = await fetch(
            `https://www.google.com/s2/favicons?domain=${site}&sz=${size}`,
          )
            .then(res => res.arrayBuffer())
            .then(res => Buffer.from(res));

          const dir = path.join(root, '..', 'icons', icon);
          if (!fs.existsSync(dir.match(/^.*[\\\/]/)?.[0] || dir)) {
            fs.mkdirSync(dir.match(/^.*[\\\/]/)?.[0] || dir, {
              recursive: true,
            });
          }
          fs.writeFileSync(dir, image);
          console.log(name, '✅');
        } catch (err) {
          console.log(name, '❌', err);
        }
      } else {
        console.log(name, '❌');
      }
      await delay(2500)
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

  fileList(path.join(root, '..', 'icons')).forEach(path => {
    if (!used.has(path)) {
      console.log('🗑️', path);
      fs.rmSync(path, { recursive: true, force: true });
    }
  });
  console.log('\nDone ✅');
})();

// import { describe, expect, test } from '@jest/globals';

import { getPlugin, searchPlugins } from '@provider/plugins';
import { Plugin } from '@typings/plugin';

const plugins = searchPlugins('ranobehu');
plugins.forEach(({ name, id }) => {
  const t1 = `Test: ${name} (${id})`;
  let chapterPath: string | undefined;
  let exampleNovel: Plugin.NovelItem;

  describe(t1, () => {
    const plugin = getPlugin(id)!;
    const filters = {};
    for (const fKey in plugin.filters) {
      //@ts-expect-error
      filters[fKey] = {
        type: plugin.filters[fKey].type,
        value: plugin.filters[fKey].value,
      };
    }

    test('Latest Novels', () => {
      return plugin
        .popularNovels(1, {
          filters,
          showLatestNovels: true,
        })
        .then(res => {
          expect(res.length).toBeGreaterThan(0);
          exampleNovel = res?.[2];
        });
    }, 20000);
    test.concurrent(
      'Popular Novels',
      async () => {
        return plugin
          .popularNovels(1, {
            filters,
            showLatestNovels: false,
          })
          .then(res => {
            expect(res.length).toBeGreaterThan(0);
          });
      },
      20000,
    );
    test('Search Novels', async () => {
      console.log(exampleNovel);

      return plugin.searchNovels(exampleNovel.name, 1).then(res => {
        expect(res[0].path).toBe(exampleNovel.path);
      });
    }, 20000);
    test('Cover image', async () => {
      expect(exampleNovel.cover?.length).toBeGreaterThan(0);
    });
    describe('Parse Novel', () => {
      let parsedNovel: Plugin.SourceNovel;
      test('Meta data', () => {
        if (exampleNovel) {
          return plugin.parseNovel(exampleNovel.path).then(res => {
            parsedNovel = res;
            expect(res.summary?.length).toBeGreaterThan(0);
            expect(res.genres?.length).toBeGreaterThan(0);
            expect(res.status?.length).toBeGreaterThan(0);
            expect(res.author?.length).toBeGreaterThan(0);
          });
        } else {
          fail();
        }
      });
      test('Chapters', () => {
        if (parsedNovel) {
          expect(parsedNovel.chapters?.length).toBeGreaterThan(0);
          chapterPath = parsedNovel.chapters?.[0]?.path;
        } else {
          fail();
        }
      });
    });
    test('Parse Chapter', () => {
      if (chapterPath) {
        plugin.parseChapter(chapterPath).then(res => {
          expect(res.length).toBeGreaterThan(100);
        });
      } else {
        fail();
      }
    });
  });
});

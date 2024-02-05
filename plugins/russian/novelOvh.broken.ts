import { Plugin } from "@typings/plugin";
import { FilterTypes, Filters } from "@libs/filterInputs";
import { fetchApi, fetchFile } from "@libs/fetch";
import { NovelStatus } from "@libs/novelStatus";
import dayjs from "dayjs";

class novelOvh implements Plugin.PluginBase {
  id = "novelovh";
  name = "НовелОВХ";
  site = "https://novel.ovh/";
  version = "1.0.0";
  icon = "src/ru/novelOvh/icon.png";

  async popularNovels(
    page: number,
    { showLatestNovels, filters }: Plugin.PopularNovelsOptions,
  ): Promise<Plugin.NovelItem[]> {

  }

  async parseNovelAndChapters(novelUrl: string): Promise<Plugin.SourceNovel> {
  }

  async parseChapter(chapterUrl: string): Promise<string> {

  }

  async searchNovels(
    searchTerm: string,
    page: number | undefined = 1,
  ): Promise<Plugin.NovelItem[]> {

  }

  fetchImage = fetchFile;
}

export default new novelOvh();

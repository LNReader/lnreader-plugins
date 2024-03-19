import { Plugin } from "@typings/plugin";
import { FilterTypes, Filters } from "@libs/filterInputs";
import { fetchApi, fetchFile } from "@libs/fetch";
import { NovelStatus } from "@libs/novelStatus";
import { load as parseHTML } from "cheerio";
import dayjs from "dayjs";
import qs from "qs";

class Zelluloza implements Plugin.PluginBase {
  id = "zelluloza";
  name = "Целлюлоза.ру";
  site = "https://zelluloza.ru";
  version = "1.0.0";
  icon = "src/ru/zelluloza/icon.png";

  async popularNovels(
    pageNo: number,
    { showLatestNovels }: Plugin.PopularNovelsOptions,
  ): Promise<Plugin.NovelItem[]> {
    const body = await fetchApi(this.site + "/ajaxcall/", {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Referer: this.site + "/top/freebooks/",
        Origin: this.site,
      },
      method: "POST",
      body: qs.stringify({
        op: "morebooks",
        par1: "",
        par2: "125:0::0.0.0.0.0.0.0.0.0.0.0.0.1.s.1..:" + pageNo,
        par4: "",
      }),
    }).then((res) => res.text());
    const loadedCheerio = parseHTML(body);
    const novels: Plugin.NovelItem[] = [];

    loadedCheerio('div[style="display: flex"]').each((index, element) => {
      novels.push({
        name: loadedCheerio(element).find('span[itemprop="name"]').text() || "",
        cover:
          this.site +
          loadedCheerio(element).find('img[class="shadow"]').attr("src"),
        path: (
          loadedCheerio(element).find('img[class="shadow"]').attr("onclick") ||
          ""
        ).replace(/\D/g, ""),
      });
    });

    return novels;
  }

  async parseNovel(novelPath: string): Promise<Plugin.SourceNovel> {
    const body = await fetchApi(this.resolveUrl(novelPath, true))
      .then((res) => res.text());
    const loadedCheerio = parseHTML(body);

    const novel: Plugin.SourceNovel = {
      path: novelPath,
      name: loadedCheerio('span[itemprop="name"]').text(),
      cover: this.site + loadedCheerio('img[class="shadow"]').attr("src"),
      summary:
        loadedCheerio("#bann_full").text() ||
        loadedCheerio("#bann_short").text(),
      author: loadedCheerio(".author_link").text(),
      //status: NovelStatus.Unknown
    };

    const chapters: Plugin.ChapterItem[] = [];
    loadedCheerio('ul[class="g0"] div[class="w800_m"]').each(
      (chapterIndex, element) => {
        const isFree = loadedCheerio(element).find('div[class="chaptfree"]').length;
        if (isFree) {
          const chapter = loadedCheerio(element).find('a[class="chptitle"]');
          const releaseDate = loadedCheerio(element)
            .find('div[class="stat"]')
            .text();
          chapters.push({
            name: chapter.text().trim(),
            path: (chapter.attr("href") || "").split("/").slice(2, 4).join("/"),
            releaseTime: this.parseDate(releaseDate),
            chapterNumber: chapterIndex + 1,
          });
        }
      },
    );

    novel.chapters = chapters;
    return novel;
  }

  async parseChapter(chapterPath: string): Promise<string> {
    const [bookID, chapterID] = chapterPath.split("/");
    const body = await fetchApi(this.site + "/ajaxcall/", {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Referer: this.resolveUrl(chapterPath),
        Origin: this.site,
      },
      method: "POST",
      body: qs.stringify({
        op: "getbook",
        par1: bookID,
        par2: chapterID,
      }),
    }).then((res) => res.text());

    const encrypted = body.split("<END>")[0].split("\n");
    const chapterText = encrypted
      .map((str) => (str.length ? "<p>" + decrypt(str) + "</p>" : ""))
      .join("\n")
      .replace(/\r/g, "")
      .replace(/\[~\]([^\[]*)\[\/]/g, "<i>$1</i>")
      .replace(/\[\*\]([^\]]*)\[\/]/g, "<b>$1</b>")
      .replace(/\[blu\]([^\]]*)\[\/]/g, "<subtitle>$1</subtitle>");

    return chapterText || "";
  }

  async searchNovels(
    searchTerm: string,
    pageNo: number | undefined = 1,
  ): Promise<Plugin.NovelItem[]> {
    const novels: Plugin.NovelItem[] = [];
    return novels;
  }

  parseDate = (dateString: string | undefined = "") => {
    const [, day, month, year, hour, minute] =
      dateString.match(/(\d{2})\.(\d{2})\.(\d{4})г\s(\d{2}):(\d{2})/) || [];

    if (day && month && year && hour && minute) {
      return dayjs(
        year + "-" + month + "-" + day + " " + hour + ":" + minute,
      ).format("LLL");
    }

    return null;
  };

  fetchImage = fetchFile;
  resolveUrl = (path: string, isNovel?: boolean) => this.site + "/books/" + path;
}

const alphabet: { [key: string]: string } = {
  "~": "0",
  "H": "1",
  "^": "2",
  "@": "3",
  "f": "4",
  "0": "5",
  "5": "6",
  "n": "7",
  "r": "8",
  "=": "9",
  "W": "a",
  "L": "b",
  "7": "c",
  " ": "d",
  "u": "e",
  "c": "f",
};

function decrypt(encrypt: string) {
  const hexArray = [];
  let index = 0;

  for (let j = 0; j < encrypt.length; j += 2) {
    const firstChar = encrypt.substring(j, j + 1);
    const secondChar = encrypt.substring(j + 1, j + 2);
    hexArray[index++] = alphabet[firstChar] + alphabet[secondChar];
  }

  return hexToUtf8(hexArray);
}

function hexToUtf8(hexArray: string[]) {
  let index = 0;
  let result = "";

  while (index < hexArray.length) {
    const currentHex = parseInt(hexArray[index], 16) & 0xff;

    if (currentHex < 128) {
      if (currentHex < 16) {
        switch (currentHex) {
          case 9:
            result += " ";
            break;
          case 13:
            result += "\r";
            break;
          case 10:
            result += "\n";
            break;
        }
      } else {
        result += String.fromCharCode(currentHex);
      }
      index++;
    } else if (currentHex > 191 && currentHex < 224) {
      if (index + 1 < hexArray.length) {
        const nextHex = parseInt(hexArray[index + 1], 16) & 0xff;
        result += String.fromCharCode(
          ((currentHex & 31) << 6) | (nextHex & 63),
        );
      }
      index += 2;
    } else {
      if (index + 2 < hexArray.length) {
        const nextHex = parseInt(hexArray[index + 1], 16) & 0xff;
        const thirdHex = parseInt(hexArray[index + 2], 16) & 0xff;
        result += String.fromCharCode(
          ((currentHex & 15) << 12) | ((nextHex & 63) << 6) | (thirdHex & 63),
        );
      }
      index += 3;
    }
  }

  return result;
}
export default new Zelluloza();

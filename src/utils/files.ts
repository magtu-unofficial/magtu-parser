import XLSX, { WorkBook, WorkSheet } from "xlsx";
import fs from "fs";
import { promisify } from "util";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import md5 from "md5";

import { Efrom } from "../interfaces/config";
import { urls } from "./config";

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);

export class File {
  constructor(name: string, path: string, from: Efrom) {
    this.name = name;
    this.path = path;
    this.from = from;
  }

  async load() {
    if (!this.md5) {
      if (this.from === Efrom.local) {
        const buf = await readFile(this.path);
        this.md5 = md5(buf);
        this.book = XLSX.read(buf, { type: "buffer" });
      } else if (this.from === Efrom.newlms) {
        const res = await fetch(this.path, {
          headers: {
            accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "en-US,en;q=0.9,ru;q=0.8",
            "cache-control": "no-cache",
            pragma: "no-cache",
            "sec-ch-ua":
              '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-origin",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
            cookie:
              "BPC=af13c4e4925aeb3594d3fc55908de263; MoodleSession=d7emmp5bioeujndcjuj738ho0q",
            Referer: "https://newlms.magtu.ru/course/view.php?id=26619",
            "Referrer-Policy": "strict-origin-when-cross-origin"
          },
          body: null,
          method: "GET"
        });

        const buf = await res.buffer();
        this.md5 = md5(buf);
        this.book = XLSX.read(buf, { type: "buffer" });
      } else if (this.from === Efrom.newlmsZip) {
        throw Error("Загрузка ZIP архивов пока не реализована");
      }

      for (const sheetName in this.book.Sheets) {
        if (Object.prototype.hasOwnProperty.call(this.book.Sheets, sheetName)) {
          const sheet = this.book.Sheets[sheetName];
          if (sheet["!ref"]) {
            this.sheet = sheet;
          }
        }
      }
    }
    return this;
  }

  name: string;
  path: string;
  from: Efrom;
  book: WorkBook;
  sheet: WorkSheet;
  md5: string;
}

/**
 * Получает список файлов
 * @param path Путь до файла
 * @param from Отуда брать список файлов
 */
export const fileList = async (
  path: string,
  from: Efrom = urls.from
): Promise<Array<File>> => {
  if (from === Efrom.local) {
    const dir = await readdir(path);
    return dir.map(file => {
      return new File(file, `${path}${file}`, urls.from);
    });
  }
  if (from === Efrom.newlms) {
    const res = await fetch(path, {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-language": "en-US,en;q=0.9,ru;q=0.8",
        "cache-control": "no-cache",
        pragma: "no-cache",
        "sec-ch-ua":
          '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
        cookie:
          "BPC=af13c4e4925aeb3594d3fc55908de263; MoodleSession=d7emmp5bioeujndcjuj738ho0q",
        Referer: "https://newlms.magtu.ru/course/view.php?id=26619",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      },
      body: null,
      method: "GET"
    });

    const dom = new JSDOM(await res.text());
    const elements = dom.window.document.querySelectorAll(
      ".fp-filename-icon a"
    );

    const files: Array<File> = [];
    elements.forEach(value => {
      files.push(
        new File(value.innerHTML, value.getAttribute("href"), urls.from)
      );
    });
    return files;
  }
  if (from === Efrom.newlmsZip) {
    throw Error("Загрузка ZIP архивов пока не реализована");
  }
  return [];
};

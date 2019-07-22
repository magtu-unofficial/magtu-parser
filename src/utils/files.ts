import fs from "fs";
import { promisify } from "util";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import XLSX, { WorkBook, WorkSheet } from "xlsx";
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
        const res = await fetch(this.path);
        const buf = await res.buffer();
        this.md5 = md5(buf);
        this.book = XLSX.read(buf, { type: "buffer" });
      } else if (this.from === Efrom.newlmsZip) {
        throw Error("Загрузка ZIP архивов пока не реализована");
      }

      this.sheet = this.book.Sheets[this.book.SheetNames[0]];
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
    const res = await fetch(path);
    const dom = new JSDOM(await res.text());
    const elements = dom.window.document.querySelectorAll(
      ".fp-filename-icon a"
    );

    const files: Array<File> = [];
    elements.forEach(value => {
      files.push(
        new File(
          value.lastElementChild.innerHTML,
          value.getAttribute("href"),
          urls.from
        )
      );
    });
    return files;
  }
  if (from === Efrom.newlmsZip) {
    throw Error("Загрузка ZIP архивов пока не реализована");
  }
};

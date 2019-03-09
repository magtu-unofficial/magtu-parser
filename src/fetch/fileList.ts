import fetch from "node-fetch";
import { JSDOM } from "jsdom";

import Ifile from "../interfaces/file";

export default async (url: string): Promise<Array<Ifile>> => {
  const res = await fetch(url);
  const dom = new JSDOM(await res.text());
  const elements = dom.window.document.querySelectorAll(".fp-filename-icon a");

  // какая-то магия
  const array = Array.prototype.slice.call(elements);

  return array.map(value => ({
    file: value.lastChild.innerHTML,
    url: value.getAttribute("href")
  }));
};

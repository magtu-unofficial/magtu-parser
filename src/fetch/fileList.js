import fetch from "node-fetch";
import { JSDOM } from "jsdom";

export default async url => {
  const res = await fetch(url);
  const dom = new JSDOM(await res.text());
  const elements = dom.window.document.querySelectorAll(".fp-filename-icon a");

  // какая то магия
  const array = Array.prototype.slice.call(elements);

  return array.map(value => ({
    file: value.lastChild.innerHTML,
    url: value.getAttribute("href")
  }));
};

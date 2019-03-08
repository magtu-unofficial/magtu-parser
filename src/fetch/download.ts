import fetch from "node-fetch";
import XLSX from "xlsx";

export default async url => {
  const res = await fetch(url);
  const book = XLSX.read(await res.buffer(), { type: "buffer" });

  return book;
};

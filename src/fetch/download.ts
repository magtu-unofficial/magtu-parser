import fetch from "node-fetch";
import XLSX from "xlsx";

export default async (url: string): Promise<XLSX.WorkBook> => {
  const res = await fetch(url);
  const book = XLSX.read(await res.buffer(), { type: "buffer" });

  return book;
};

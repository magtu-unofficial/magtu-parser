import { resolve } from "path";
import { readFileSync } from "fs";
import XLSX, { WorkSheet } from "xlsx";

export default (path: string): WorkSheet => {
  const buf = readFileSync(resolve("testdata", path));
  const book = XLSX.read(buf);
  return book.Sheets[book.SheetNames[0]];
};

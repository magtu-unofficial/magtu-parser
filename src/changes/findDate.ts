import cp from "../lib/cellPos";
import { WorkBook } from "xlsx";

export default (book: WorkBook): Date => {
  const sheet = book.Sheets[book.SheetNames[0]];

  for (let i = 0; i < 5; i += 1) {
    if (sheet[cp(2, i)]) {
      const numbers = sheet[cp(2, i)].v.split(".").map(val => {
        if (isNaN(parseInt(val, 10))) {
          return null;
        }
        return parseInt(val, 10);
      });
      if (numbers.indexOf(null) === -1) {
        return new Date(numbers[2], numbers[1] - 1, numbers[0]);
      }
    }
  }

  throw Error("Date not found");
};

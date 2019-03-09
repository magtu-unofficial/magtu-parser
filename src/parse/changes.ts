import cp from "../lib/cellPos";
import { WorkBook } from "xlsx/types";
import Ipair from "../interfaces/pair";
import Esubgroup from "../interfaces/subgroup";

const parseString = (str: string): Ipair => {
  const split = str.split("  ");
  try {
    if (str.indexOf("-----") !== -1) {
      return {
        removed: true
      };
    }
    if (split[0] && split[1].split("\n")[1] && split[1].split("\n")[0]) {
      return {
        name: split[0],
        teacher: split[1].split("\n")[1],
        classroom: split[1].split("\n")[0]
      };
    }
    throw Error();
  } catch (e) {
    console.log("Error in changes for", str);
    return { error: true, string: str };
  }
};

const splitString = (str: string, num: number): Array<Ipair> => {
  try {
    if (str.indexOf("1. ") === -1 && str.indexOf("2. ") === -1) {
      return [
        {
          number: num,
          subgroup: Esubgroup.first,
          ...parseString(str)
        }
      ];
    }
    if (str.split("\r\n2. ").length > 1) {
      return [
        {
          number: num,
          subgroup: Esubgroup.first,
          ...parseString(str.replace("1. ", "").split("\r\n2. ")[0])
        },
        {
          number: num,
          subgroup: Esubgroup.second,
          ...parseString(str.replace("1. ", "").split("\r\n2. ")[1])
        }
      ];
    }
    if (str.indexOf("1. ") !== -1) {
      return [
        {
          number: num,
          subgroup: Esubgroup.first,
          ...parseString(str.replace("1. ", ""))
        }
      ];
    }
    if (str.indexOf("2. ") !== -1) {
      return [
        {
          number: num,
          subgroup: Esubgroup.second,
          ...parseString(str.replace("2. ", ""))
        }
      ];
    }
  } catch (error) {
    console.log(str, error.message);
  }
  return [];
};

const processCol = (sheet, x, y, pairsCount) => {
  const three = {};
  for (let t = 0; t < 3; t += 1) {
    three[t] = [];
    for (let p = 1; p <= pairsCount[t]; p += 1) {
      if (sheet[cp(x, y + p + (pairsCount[t] + 1) * t)]) {
        const pairs = splitString(
          sheet[cp(x, y + p + (pairsCount[t] + 1) * t)].v,
          p
        );
        three[t].push(...pairs);
      }
    }
  }
  return { group: sheet[cp(x, y)].v.toLowerCase().split("/")[0], three };
};

const findCols = (sheet, pairsCount, y = 2) => {
  const cols = [];
  let empty = 0;
  for (let col = 1; col < 300; col += 1) {
    if (sheet[cp(col, y)]) {
      empty = 0;
      cols.push(processCol(sheet, col, y, pairsCount));
    } else {
      empty += 1;
      if (empty > 6) {
        return cols;
      }
    }
  }
  return cols;
};

const findPairsCount = (sheet, x = 3, y) => {
  const pairs = [];
  for (let three = 0; three < 3; three += 1) {
    for (let row = y; row < y + 12; row += 1) {
      if (sheet[cp(x, row)]) {
        pairs[three] = sheet[cp(x, row)].v;
      } else {
        break;
      }
    }
  }

  return pairs;
};

const findY = sheet => {
  for (let y = 1; y < 10; y += 1) {
    if (sheet[cp(2, y)]) {
      if (sheet[cp(2, y)]) {
        return y - 1;
      }
    }
  }
  throw Error("Y line not found un changes");
};

export default (book: WorkBook) => {
  const sheet = book.Sheets[book.SheetNames[0]];
  const Y = findY(sheet);
  return findCols(sheet, findPairsCount(sheet, 3, Y + 1), Y);
};

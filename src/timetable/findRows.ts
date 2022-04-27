import { WorkSheet } from "xlsx";
import exist from "../utils/exist";
import cp from "../utils/cellPos";

const findRow = (
  sheet: WorkSheet,
  text: string,
  startFrom = 1,
  x = 1,
  limit = 100
) => {
  for (let y = startFrom; y < limit; y += 1) {
    if (exist(sheet, x, y) && sheet[cp(x, y)].h === text) {
      return y;
    }
  }
  return -1;
};

const findRowFirstGrade = (
  sheet: WorkSheet,
  reg: RegExp,
  startFrom = 10,
  x = 1,
  limit = 130
) => {
  for (let y = startFrom; y < limit; y += 1) {
    if (exist(sheet, x, y) && reg.test(sheet[cp(x, y)].h)) {
      return y;
    }
  }
  return -1;
};

export default (sheet: WorkSheet): { [index: number]: number } => {
  const rows: { [index: number]: number } = {};
  const upscaling = 10;
  let isFirstGrade = false;

  for (let row = 1; row <= 4; row += 1) {
    let rw: number = null;

    if (!isFirstGrade) {
      rw = findRow(
        sheet,
        row % 2 === 1 ? "Понедельник" : "Четверг",
        rows[row - 1 !== undefined ? row - 1 : 1]
      );

      if (rw === -1) {
        isFirstGrade = true;
      }

      if (!isFirstGrade) {
        rows[row] = rw;
      }
    }

    if (isFirstGrade) {
      rw = findRowFirstGrade(
        sheet,
        (upscaling + row) % 2 === 1
          ? /^Понедельник \d{2}.\d{2}$/
          : /^Четверг \d{2}.\d{2}$/,
        rows[row - 1 !== undefined ? row - 1 : 1]
      );

      if (rw === -1) throw Error(`Строка ${row} не найдена`);

      rows[row] = rw;
    }
  }

  return rows;
};

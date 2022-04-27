import { WorkSheet } from "xlsx";
import cp from "../utils/cellPos";
import Ipair from "../interfaces/pair";
import exist from "../utils/exist";
import log from "../utils/log";
import Esubgroup from "../interfaces/subgroup";

const readSubgroup = (sheet: WorkSheet, x: number, y: number) => {
  return {
    name: sheet[cp(x, y)].h,
    teacher: sheet[cp(x, y + 1)].h,
    classroom: sheet[cp(x + 1, y + 1)] ? sheet[cp(x + 1, y + 1)].h : -1
  };
};

const readGroup = (sheet: WorkSheet, x: number, y: number) => {
  return {
    name: sheet[cp(x, y)].h,
    teacher: sheet[cp(x, y + 1)].h,
    classroom: sheet[cp(x + 3, y + 1)] ? sheet[cp(x + 3, y + 1)].h : -1
  };
};

const readBlock = (sheet: WorkSheet, x: number, y: number): Array<Ipair> => {
  try {
    if (exist(sheet, x, y)) {
      const block: Array<Ipair> = [];

      if (
        // Пара у первой и второй подгруппы
        exist(sheet, x + 1, y) &&
        !exist(sheet, x + 2, y + 1) &&
        exist(sheet, x + 4, y + 1)
      ) {
        block.push({
          number: sheet[cp(x, y)].v,
          subgroup: Esubgroup.common,
          ...readGroup(sheet, x + 1, y)
        });
      } else {
        if (
          // Пара у первой подгруппы
          exist(sheet, x + 1, y) &&
          exist(sheet, x + 2, y + 1)
        ) {
          block.push({
            number: sheet[cp(x, y)].v,
            subgroup: Esubgroup.first,
            ...readSubgroup(sheet, x + 1, y)
          });
        }

        if (
          // Пара у вторйо подгруппы
          exist(sheet, x + 3, y)
        ) {
          block.push({
            number: sheet[cp(x, y)].v,
            subgroup: Esubgroup.second,
            ...readSubgroup(sheet, x + 3, y)
          });
        }
      }
      // TODO: Приводить строки в нормалоьный вид
      return block;
    }
    return [];
  } catch (error) {
    log.warn(`Проблемы с парой  ${x}, ${y}, ${error.message}`);
    return [];
  }
};

const readDay = (
  sheet: WorkSheet,
  x: number,
  from: number,
  to: number
): Array<Ipair> => {
  const day: Array<Ipair> = [];
  for (let i = from; i < to; i += 2) {
    const block = readBlock(sheet, x, i);
    if (block) {
      day.push(...block);
      // day[block.number] = block;
    }
  }
  return day;
};

export default (
  day: number,
  rows: { [index: number]: number },
  sheet: WorkSheet
): Array<Ipair> => {
  const timetableBlock = 3;
  const three = day % timetableBlock;
  const row = Math.floor(day / timetableBlock) + 1;

  return readDay(
    sheet,
    6 * three + 1,
    rows[row] + 1,
    rows[row + 1] !== undefined ? rows[row + 1] : 130
  );
};

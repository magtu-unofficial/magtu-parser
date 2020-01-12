import { WorkSheet } from "xlsx";
import cp from "../utils/cellPos";
import log from "../utils/log";
import * as regexp from "../utils/regexp";
import Ipair from "../interfaces/pair";
import Esubgroup from "../interfaces/subgroup";
import Igroup from "../interfaces/group";
import Irow from "../interfaces/row";

const parseString = (str: string): Ipair => {
  try {
    if (str.search(/-{2,}/) !== -1) {
      return {
        removed: true
      };
    }
    const name = str.split(/\s\s|\n/)[0];
    const teacher = str.match(regexp.teacher)[0];
    const classroom = str.match(regexp.classroom);
    return { name, teacher, classroom: classroom ? classroom[0] : undefined };
  } catch (e) {
    log.warn(`Ошибка в заменах для "${str}"`);
    return { error: true, string: str };
  }
};

const splitString = (str: string, num: number): Array<Ipair> => {
  try {
    // Общая пара
    if (str.search(/^1. /) === -1 && str.search(/2. /) === -1) {
      return [
        {
          number: num,
          subgroup: Esubgroup.common,
          ...parseString(str)
        }
      ];
    }
    // Пара у двух подгрупп
    if (str.search(/^1. /) !== -1 && str.search(/2. /) !== -1) {
      return [
        {
          number: num,
          subgroup: Esubgroup.first,
          ...parseString(str.replace("1. ", "").split("\n2. ")[0])
        },
        {
          number: num,
          subgroup: Esubgroup.second,
          ...parseString(str.replace("1. ", "").split("\n2. ")[1])
        }
      ];
    }
    // Пара у первой подгруппы
    if (str.search(/^1. /) !== -1) {
      return [
        {
          number: num,
          subgroup: Esubgroup.first,
          ...parseString(str.replace("1. ", ""))
        }
      ];
    }
    // Пара у второй подгруппы
    if (str.search(/2. /) !== -1) {
      return [
        {
          number: num,
          subgroup: Esubgroup.second,
          ...parseString(str.replace("2. ", ""))
        }
      ];
    }
  } catch (error) {
    log.warn(str, error.message);
  }
  return [];
};

export default (group: Igroup, date: Irow, sheet: WorkSheet): Array<Ipair> => {
  const pairs: Array<Ipair> = [];

  for (let p = 0; p < date.pairs; p += 1) {
    const col = date.y + p;
    if (sheet[cp(group.x, col)]) {
      pairs.push(...splitString(sheet[cp(group.x, col)].v, p + 1));
    }
  }
  return pairs;
};

import { WorkSheet } from "xlsx";
import Ipair from "../interfaces/pair";
import cp from "../utils/cellPos";
import { File } from "../utils/files";
import { groupG } from "../utils/regexp";

export interface IGroup {
  name: Array<string>;
  displayName?: string;
  x: number;
  file?: File;
  timetable?: Array<Ipair>;
}

export default (sheet: WorkSheet, y: number, x: number = 1): Array<IGroup> => {
  const cols: Array<IGroup> = [];
  let empty: number = 0;

  // Проходимся по горизонтале и пишем названия групп в массив
  // Если путая ячейка, то прибовляем empty
  // Если empty слишком большое, то возвращаем массив групп
  for (let col = x; col < 300; col += 1) {
    if (sheet[cp(col, y)]) {
      empty = 0;
      const str: string = sheet[cp(col, y)].v;
      if (str.search(groupG) !== -1) {
        cols.push({
          name: str.toLowerCase().match(groupG),
          displayName: str.match(groupG)[0],
          x: col
        });
      } else {
        throw Error(`Вместо названия группы - ${str}`);
      }
    } else {
      empty += 1;
      if (empty > 6) {
        if (cols[0]) {
          return cols;
        }
        throw Error("Групп не найдено");
      }
    }
  }
  throw Error("Слишком длинный список групп");
};

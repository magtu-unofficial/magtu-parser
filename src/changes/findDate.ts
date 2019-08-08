import { WorkSheet } from "xlsx";
import cp from "../utils/cellPos";
import Irow from "../interfaces/row";

/**
 * Ищет дату и количество пар в файле замен
 * @param sheet Лист с заменами
 * @param y Строка, с которой начинть поиск
 * @param x Столбец с номерами пар
 */
export default (sheet: WorkSheet, x: number = 3): Array<Irow> => {
  const pairs: Array<Irow> = [];
  let row: number; // Номенр обрабатываемой строки
  // Ищем начало номеров пар
  for (let y = 1; y < 10; y += 1) {
    if (sheet[cp(2, y)]) {
      row = y;
      break;
    }
  }

  // В файле замены максумум на три дня
  for (let three = 0; three < 3; three += 1) {
    if (sheet[cp(x - 1, row)]) {
      const numbers = sheet[cp(x - 1, row)].v.split(".").map((val: string) => {
        if (isNaN(parseInt(val, 10))) {
          return null;
        }
        return parseInt(val, 10);
      });
      if (numbers.indexOf(null) === -1) {
        const date = new Date(numbers[2], numbers[1] - 1, numbers[0]);
        pairs[three] = { date, y: row };
      }

      // Тут ищем начало каждого дня в таблице
      for (row; row < 50; row += 1) {
        // Между номерами пар в каждом дне есть пустая ячейка
        if (sheet[cp(x, row)]) {
          // Если в ячейке есть какое то значение, то пишем его в массив под индекс текущего дня
          pairs[three].pairs = sheet[cp(x, row)].v;
        } else {
          // Если пустая ячека, переходим на следующию строку, и выходим из цикла
          row += 1;
          break;
        }
      }
    }
  }

  if (!pairs[0]) {
    throw Error("Даты не найдены");
  }
  return pairs;
};

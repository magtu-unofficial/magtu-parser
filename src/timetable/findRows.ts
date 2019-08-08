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
  // const end = false;

  for (let y = startFrom; y < limit; y += 1) {
    if (exist(sheet, x, y) && sheet[cp(x, y)].v === text) {
      return y;
    }
  }
  return -1;
};

export default (sheet: WorkSheet): { [index: number]: number } => {
  // Находим координаты каждой из 4х строк
  // (понедельник нечетный, четверг нечетный, понедельник четный, четверг нечетный)

  const rows: { [index: number]: number } = {};
  for (let row = 1; row <= 4; row += 1) {
    rows[row] = findRow(
      sheet,
      row % 2 === 1 ? "Понедельник" : "Четверг",
      rows[row - 1 !== undefined ? row - 1 : 1]
    );

    if (rows[row] === -1) throw Error(`Строка ${row} не найдена`);
  }

  return rows;
};

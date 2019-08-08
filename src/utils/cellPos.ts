// https://github.com/avilaton/excel-column-name/blob/master/index.js
export const intToExcelCol = (num: number): string => {
  let colName = "";
  let dividend = Math.floor(Math.abs(num));
  let rest;

  while (dividend > 0) {
    rest = (dividend - 1) % 26;
    colName = String.fromCharCode(65 + rest) + colName;
    dividend = parseInt(String((dividend - rest) / 26), 10);
  }
  return colName;
};

export default (x: number, y: number): string => `${intToExcelCol(x)}${y}`;

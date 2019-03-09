import { intToExcelCol } from "excel-column-name";

export default (x: number, y: number): string => `${intToExcelCol(x)}${y}`;

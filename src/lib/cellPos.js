import { intToExcelCol } from "excel-column-name";

export default (x, y) => `${intToExcelCol(x)}${y}`;

import { intToExcelCol } from "excel-column-name";

export default (x, y) => `${intToExcelCol(y)}${x}`;

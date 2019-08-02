import { WorkSheet } from "xlsx/types";
import cp from "./cellPos";

export default (sheet: WorkSheet, x: number, y: number) => {
  return sheet[cp(x, y)] !== undefined;
};

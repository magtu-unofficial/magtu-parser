import { WorkBook } from "xlsx/types";

export default interface Ifile {
  file: string;
  url: string;
  date?: Date;
  book?: WorkBook;
}

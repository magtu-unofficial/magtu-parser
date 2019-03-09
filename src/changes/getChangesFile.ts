import fileList from "../fetch/fileList";
import download from "../fetch/download";
import findDate from "./findDate";
import Ifile from "../interfaces/file";

export default async (url: string) => {
  const files: Array<Ifile> = await fileList(url);
  let result: Ifile;
  for (const file of files) {
    // Каждый файл с .xlsx или .xls скачиваеться
    if (file.file.indexOf(".xlsx") !== -1 || file.file.indexOf(".xls") !== -1) {
      const book = await download(file.url);
      try {
        const date = findDate(book);
        if (!result || result.date === undefined || date > result.date) {
          result = { book, date, ...file };
        }
      } catch (error) {
        console.log(error.message, "in", file.file);
        console.log(error);
      }
    }
  }
  return result;
};

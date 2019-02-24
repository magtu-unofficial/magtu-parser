import fileList from "../fetch/fileList";
import download from "../fetch/download";
import findDate from "./findDate";

export default async url => {
  const files = await fileList(url);
  let result = {};
  for (const file of files) {
    if (file.file.indexOf(".xlsx") !== -1 || file.file.indexOf(".xls") !== -1) {
      const book = await download(file.url);
      try {
        const date = findDate(book);
        if (date > result.date || result.date === undefined) {
          result = { book, date };
        }
      } catch (error) {
        console.log(error.message, "in", file.file);
      }
    }
  }
  return result;
};

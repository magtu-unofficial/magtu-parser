import download from "../fetch/download";
import parseTimetable from "../parse/timeTable";

export default async file => {
  const book = await download(file.url);
  return parseTimetable(file.file, book);
};

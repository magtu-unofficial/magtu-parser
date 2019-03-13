import download from "../fetch/download";
import parseChanges from "../parse/changes";
import Ifile from "../interfaces/file";

export default async (file: Ifile) => {
  const book = await download(file.url);

  return parseChanges(book);
};

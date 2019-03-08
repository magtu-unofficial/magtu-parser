import download from "../fetch/download";
import parseChanges from "../parse/changes";

export default async file => {
  const book = await download(file.url);

  return parseChanges(book);
};

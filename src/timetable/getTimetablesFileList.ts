import fileList from "../fetch/fileList";

export default async urls => {
  const promises = [];

  for (const url of urls) {
    promises.push(fileList(url));
  }

  const result = await Promise.all(promises);

  let files = [];

  for (const el of result) {
    files = files.concat(el);
  }

  return files;
};

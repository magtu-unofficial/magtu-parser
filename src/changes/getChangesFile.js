import fileList from "../fetch/fileList";

export default async url => {
  const files = await fileList(url);
  const result = {};
  for (const file of files) {
    if (file.file.indexOf("-") !== -1 && file.file.indexOf(".") !== -1) {
      const numbers = file.file
        .split("-")[0]
        .split(".")
        .map(e => {
          return parseInt(e, 10);
        });

      if (numbers.length === 3 && numbers.findIndex(e => isNaN(e)) === -1) {
        const date = new Date(numbers[2] + 2000, numbers[1] - 1, numbers[0]);

        if (!result.date || result.date < date) {
          result.date = date;
          result.file = file;
        }
      }
    }
  }
  return result;
};

import { File, fileList } from "../utils/files";
import { urls } from "../utils/config";
import parseDate from "../utils/parseDate";
import { groupG, date } from "../utils/regexp";

export const loadTimetable = async (): Promise<{
  [index: string]: Array<File>;
}> => {
  const groups: { [index: string]: Array<File> } = {};

  for (const path of urls.timetable.urls) {
    const currentFiles = await fileList(path);
    currentFiles.forEach(val => {
      const group = val.name.match(groupG);
      if (group) {
        if (!groups[group[0]]) {
          groups[group[0]] = [];
        }
        groups[group[0]].push(val);
      }
    });
  }
  return groups;
};

export const findTimtableFile = (
  groups: {
    [index: string]: Array<File>;
  },
  today: Date
): { [index: string]: File } => {
  const files: { [index: string]: File } = {};

  for (const key in groups) {
    if (Object.prototype.hasOwnProperty.call(groups, key)) {
      const e = groups[key];
      const name = key.toLowerCase();

      if (e.length !== 1) {
        let maxDate: Date = new Date(0);
        let maxFile: File;

        // Ищем файл с максимальной датой, но не новее, чем сегодня
        for (const file of e) {
          if (file.name.search(date) !== -1) {
            const newDate = parseDate(file.name);
            if (
              newDate.getTime() > maxDate.getTime() &&
              newDate.getTime() <= today.getTime()
            ) {
              maxFile = file;
              maxDate = newDate;
            }
          }
        }

        // Если файл с датой не найден то ищем файл с самым длинным названием, не содержашем дату
        if (!maxFile) {
          let maxLength = 0;
          for (const file of e) {
            if (file.name.search(date) === -1 && file.name.length > maxLength) {
              maxFile = file;
              maxLength = file.name.length;
            }
          }
        }
        files[name] = maxFile;
      } else {
        // eslint-disable-next-line
        files[name] = e[0];
      }
    }
  }
  return files;
};

export default async (d: Date = new Date()) => {
  return findTimtableFile(await loadTimetable(), d);
};

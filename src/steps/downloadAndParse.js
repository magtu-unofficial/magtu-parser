import download from "../fetch/download";
import parseTimetable from "../parse/timeTable";
import period from "../lib/period";
import addDays from "../lib/addDays";
import Timetable from "../models/timetable";

const baseDate = new Date("2019-02-04T00:00:00.000Z");

const make = async file => {
  try {
    const book = await download(file.url);
    const result = parseTimetable(file.file, book);

    const three = result.timetable[period(baseDate)];
    const tasks = [];
    for (const day in three) {
      if (({}.hasOwnProperty.call(three), day)) {
        const document = new Timetable({
          date: addDays(baseDate, parseInt(day, 10)),
          group: result.name,
          pairs: three[day]
        });
        tasks.push(document.save());
      }
    }
    await Promise.all(tasks);
  } catch (error) {
    console.log(`${error.message} in ${file.file}`);
  }
};

export default async fileList => {
  const tasks = [];
  for (const file of fileList) {
    tasks.push(make(file));
  }

  await Promise.all(tasks);
};

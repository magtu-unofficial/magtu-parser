import getTimetablesFileList from "./steps/getTimetablesFileList";
import removeIgnored from "./steps/removeIgnored";
import downloadAndParse from "./steps/downloadAndParse";
import { timetable } from "../urls.json";
import Timetable from "./models/timetable";
import mongoose from "./lib/mongoose";
import period from "./lib/period";
import addDays from "./lib/addDays";

const baseDate = new Date("2019-02-04T00:00:00.000Z");

const t = async file => {
  try {
    const result = await downloadAndParse(file);

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

(async () => {
  const startTime = new Date();
  let fileList = await getTimetablesFileList(timetable.urls);
  console.log(`Found ${fileList.length} timetables files`);
  fileList = removeIgnored(fileList, timetable.ignore);

  const tasks = [];
  for (const file of fileList) {
    tasks.push(t(file));
  }
  console.log("Processing timetables");
  await Promise.all(tasks);
  console.log(`Done in ${new Date() - startTime}ms`);
  mongoose.connection.close();
})();

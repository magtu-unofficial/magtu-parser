import getTimetablesFileList from "./steps/getTimetablesFileList";
import removeIgnored from "./steps/removeIgnored";
import downloadAndParse from "./steps/downloadAndParse";
import { timetable } from "../urls.json";

const t = async file => {
  try {
    const result = await downloadAndParse(file);
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
})();

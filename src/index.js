import getTimetablesFileList from "./steps/getTimetablesFileList";
import removeIgnored from "./steps/removeIgnored";
import downloadAndParse from "./steps/downloadAndParse";
import { timetable } from "../urls.json";

import mongoose from "./lib/mongoose";

(async () => {
  const startTime = new Date();

  let fileList = await getTimetablesFileList(timetable.urls);

  console.log(`Found ${fileList.length} timetables files`);
  fileList = removeIgnored(fileList, timetable.ignore);

  console.log("Processing timetables");
  await downloadAndParse(fileList);

  console.log(`Done in ${new Date() - startTime}ms`);
  mongoose.connection.close();
})();

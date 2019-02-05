import getTimetablesFileList from "./getTimetablesFileList";
import removeIgnored from "./removeIgnored";
import downloadAndParse from "./downloadAndParse";
import { timetable } from "../../urls.json";

export default async () => {
  let fileList = await getTimetablesFileList(timetable.urls);

  console.log(`Found ${fileList.length} timetables files`);
  fileList = removeIgnored(fileList, timetable.ignore);

  console.log("Processing timetables");
  await downloadAndParse(fileList);
};

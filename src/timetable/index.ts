import getTimetablesFileList from "./getTimetablesFileList";
import removeIgnored from "./removeIgnored";
import downloadAndParse from "./downloadAndParse";
import { timetable } from "../../urls.json";

export default async date => {
  const fileList = await getTimetablesFileList(timetable.urls);

  console.log(`Found ${fileList.length} timetables files`);
  const { cleanFileList, applied, ignored, duplicated } = removeIgnored(
    fileList,
    timetable.ignore
  );

  console.log("Processing timetables");
  await downloadAndParse(cleanFileList, date);

  return { applied, ignored, duplicated, total: fileList.length };
};

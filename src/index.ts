import fetch from "node-fetch";

import { bot } from "./lib/config";
import timetable from "./timetable";
import getChangesFile from "./changes/getChangesFile";
import parseChanges from "./parse/changes";
import { changes } from "../urls.json";
import Launch from "./models/launch";
import Timetable from "./models/timetable";
import mongoose from "./lib/mongoose";

console.log("Starting parser");

(async () => {
  const startTime = new Date();
  const launch = new Launch({ date: startTime });

  console.log("Checking changes");
  const changesComp = await Promise.all([
    Launch.findlastChanges(),
    getChangesFile(changes.url)
  ]);

  console.log(
    changesComp[0] < changesComp[1].date,
    changesComp[0],
    changesComp[1].date
  );

  if (changesComp[0] < changesComp[1].date) {
    const { date, book } = changesComp[1];
    launch.lastChanges = date;
    launch.newChanges = true;

    console.log("New changes", date);

    const result = await timetable(date);
    launch.files = result;

    const ch = parseChanges(book);
    await Timetable.applyChanges(ch, date);
    await fetch(`${bot}/notyfy`);
  } else {
    const date = changesComp[0];
    launch.lastChanges = date;
    launch.newChanges = false;

    console.log("No new changes");
  }

  const endTime = new Date() - startTime;
  launch.time = endTime;
  console.log(`Done in ${endTime}ms`);
  await launch.save();

  console.log(`Disconecting from db`);
  mongoose.connection.close();
  console.log(`Disconected`);
})();

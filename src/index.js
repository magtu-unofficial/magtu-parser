import timetable from "./timetable";

import mongoose from "./lib/mongoose";

(async () => {
  const startTime = new Date();

  await timetable();

  console.log(`Done in ${new Date() - startTime}ms`);
  mongoose.connection.close();
})();

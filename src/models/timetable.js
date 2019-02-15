import mongoose from "../lib/mongoose";
import addDays from "../lib/addDays";

const timetable = mongoose.Schema({
  date: { type: Date, required: true },
  group: { type: String, required: true },
  pairs: [
    {
      number: { type: Number, required: true },
      name: { type: String },
      teacher: { type: String },
      classroom: { type: String },
      subgroup: {
        type: String,
        enum: ["common", "first", "second"],
        required: true
      },
      changed: { type: Boolean, default: false },
      removed: { type: Boolean, default: false },
      error: { type: Boolean, default: false }
    }
  ]
});

timetable.index({ date: 1, group: -1 }, { unique: true });

const check = pair => {
  return e => {
    if (e.number === pair.number) {
      if (e.subgroup === pair.subgroup) {
        return true;
      }
      if (e.subgroup === "common") {
        return true;
      }
    }
    return false;
  };
};

const applyChange = async (group, date, period, changes, tt) => {
  try {
    const day = await tt.findOne({
      group,
      date: addDays(date, parseInt(period, 10))
    });

    for (const changeKey in changes) {
      if ({}.hasOwnProperty.call(changes, changeKey)) {
        const change = changes[changeKey];
        const pairIndex = day.pairs.findIndex(e => {
          return (
            e.number === change.number &&
            (e.subgroup === change.subgroup || change.subgroup === "common")
          );
        });
        if (pairIndex !== -1) {
          console.log(day.pairs[pairIndex]);
          day.pairs.splice(pairIndex, 1, { changed: true, ...change });
        } else {
          day.pairs.push({ changed: true, ...change });
        }
      }
    }
    if (group === "испк-18-1") {
      console.log({ group, date, period, changes });
      console.log(day);
    }
    await day.save();
  } catch (error) {
    console.log(`${error.message} whren applying changes for ${group}`);
  }
};

timetable.statics.applyChanges = async function applyChages(changes, date) {
  const tasks = [];
  for (const item of changes) {
    for (const period in item.three) {
      if ({}.hasOwnProperty.call(item.three, period)) {
        const change = item.three[period];
        tasks.push(applyChange(item.group, date, period, change, this));
      }
    }
  }
  await Promise.all(tasks);
};

export default mongoose.model("Timetable", timetable);

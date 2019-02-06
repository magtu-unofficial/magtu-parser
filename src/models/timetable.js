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
      removed: { type: Boolean, default: false }
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

const applyChange = async (group, date, period, change, tt) => {
  try {
    const day = await tt.findOne({
      group,
      date: addDays(date, parseInt(period, 10))
    });

    for (const pairKey in day.pairs) {
      if ({}.hasOwnProperty.call(day.pairs, pairKey)) {
        const pair = day.pairs[pairKey];
        const ch = change.find(check(pair));
        if (ch) {
          day.pairs[pairKey] = ch;
          day.pairs[pairKey].changed = true;
        }
      }
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

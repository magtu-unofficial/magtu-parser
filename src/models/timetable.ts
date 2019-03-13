import mongoose from "../lib/mongoose";
import addDays from "../lib/addDays";
import Ipair from "../interfaces/pair";

const timetable: mongoose.Schema = new mongoose.Schema({
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
      string: { type: String },
      changed: { type: Boolean, default: false },
      removed: { type: Boolean, default: false },
      error: { type: Boolean, default: false }
    }
  ]
});

timetable.index({ date: 1, group: -1 }, { unique: true });

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
          day.setPair(pairIndex, change);
        } else {
          day.pairs.push({ changed: true, ...change });
        }
      }
    }

    await day.save();
  } catch (error) {
    console.log(`${error.message} whren applying changes for ${group}`);
  }
};

timetable.methods.setPair = function setPair(index, change) {
  // быдлокод
  Object.assign(this.pairs[index], change);
  this.pairs[index].changed = true;
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

interface ItimetableDocument extends mongoose.Document {
  date: Date;
  group: string;
  pairs: Array<Ipair>;
  setPair: (index, change) => any;
}

interface ItimetableModel extends mongoose.Model<ItimetableDocument> {
  applyChanges: (changes, date) => any;
}

const model: ItimetableModel = mongoose.model<
  ItimetableDocument,
  ItimetableModel
>("Timetable", timetable);
export default model;

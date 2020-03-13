import mongoose from "../utils/mongoose";
import Ipair from "../interfaces/pair";
import Esubgroup from "../interfaces/subgroup";

const timetable: mongoose.Schema = new mongoose.Schema({
  date: { type: Date, required: true },
  group: [String],
  displayName: String,
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
  ],
  error: { type: String }
});

timetable.index({ date: 1, group: -1 }, { unique: true });

timetable.methods.addError = function addError(error: string): void {
  this.error = this.error ? `${this.error}\n${error}` : error;
};

timetable.methods.addTimetable = function addTimetable(
  pairs: Array<Ipair>
): void {
  this.pairs.push(...pairs);
};

const rmElement = <T>(arr: Array<T>, comp: (e: T) => boolean): Array<T> => {
  const rmId = arr.findIndex(comp);
  if (rmId !== -1) {
    return arr.splice(rmId, 1);
  }
  return [];
};

timetable.methods.addChanges = function addChanges(pairs: Array<Ipair>): void {
  for (const pair of pairs) {
    const index = this.pairs.findIndex(
      (e: Ipair) =>
        e.number === pair.number &&
        (e.subgroup === pair.subgroup ||
          pair.subgroup === Esubgroup.common ||
          e.subgroup === Esubgroup.common)
    );

    if (index !== -1) {
      Object.assign(this.pairs[index], { changed: true, ...pair });

      if (pair.subgroup === Esubgroup.common) {
        rmElement(
          this.pairs,
          (e: Ipair) =>
            e.number === pair.number && e.subgroup === Esubgroup.first
        );

        rmElement(
          this.pairs,
          (e: Ipair) =>
            e.number === pair.number && e.subgroup === Esubgroup.second
        );
      }
    } else {
      this.pairs.push({ changed: true, ...pair });
    }
    // if (this.displayName === "О-17-2") console.log(this.pairs);
  }
};

interface ItimetableDocument extends mongoose.Document {
  date: Date;
  group: Array<string>;
  displayName: string;
  pairs: Array<Ipair>;
  error: string;
  addError(error: string): void;
  addTimetable(pairs: Array<Ipair>): void;
  addChanges(pairs: Array<Ipair>): void;
}

interface ItimetableModel extends mongoose.Model<ItimetableDocument> {}

const model: ItimetableModel = mongoose.model<
  ItimetableDocument,
  ItimetableModel
>("Timetable", timetable);
export default model;

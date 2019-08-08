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

timetable.methods.addError = function(error: string): void {
  this.error = this.error ? `${this.error}\n${error}` : error;
};

timetable.methods.addTimetable = function(pairs: Array<Ipair>): void {
  this.pairs.push(...pairs);
};

timetable.methods.addChanges = function(pairs: Array<Ipair>): void {
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
    } else {
      this.pairs.push({ changed: true, ...pair });
    }
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

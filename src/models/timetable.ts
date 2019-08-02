import mongoose from "../utils/mongoose";
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

interface ItimetableDocument extends mongoose.Document {
  date: Date;
  group: string;
  pairs: Array<Ipair>;
}

interface ItimetableModel extends mongoose.Model<ItimetableDocument> {}

const model: ItimetableModel = mongoose.model<
  ItimetableDocument,
  ItimetableModel
>("Timetable", timetable);
export default model;

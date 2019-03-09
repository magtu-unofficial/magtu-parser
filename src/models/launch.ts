import mongoose from "../lib/mongoose";

const launch = new mongoose.Schema({
  date: { type: Date, required: true, unique: true },
  time: { type: Number, required: true },
  lastChanges: { type: Date, required: true },
  newChanges: { type: Boolean },
  files: {
    total: { type: Number },
    ignored: { type: Number },
    duplicated: { type: Number },
    applied: { type: Number }
  }
});

launch.statics.findlastChanges = async function findlastChanges(): Promise<
  Date
> {
  const inst = await this.findOne()
    .sort({ date: -1 })
    .limit(1);
  return inst !== null ? inst.lastChanges : new Date(0);
};

interface IlaunchDocument extends mongoose.Document {
  date: Date;
  time: number;
  lastChanges: Date;
  newChanges: boolean;
  files: {
    total: number;
    ignored: number;
    duplicated: number;
    applied: number;
  };
}

interface IlaunchModel extends mongoose.Model<IlaunchDocument> {
  findlastChanges: () => Date;
}

const model: IlaunchModel = mongoose.model<IlaunchDocument, IlaunchModel>(
  "Launch",
  launch
);
export default model;

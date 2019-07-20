import mongoose from "../utils/mongoose";
import { File } from "../utils/files";

const change = new mongoose.Schema({
  date: { type: Date, required: true, unique: true },
  time: { type: Number, required: false },
  fileName: { type: String, required: true },
  md5: { type: String, required: true, unique: true }
});

change.statics.hasFile = async function hasFile(md5: string): Promise<boolean> {
  const inst = await this.findOne({ md5 });
  return inst !== null;
};

change.statics.addFile = async function addile(
  file: File,
  time?: number
): Promise<void> {
  const e = new this({
    date: new Date(),
    time,
    fileName: file.name,
    md5: file.md5
  });

  await e.save();
};

interface IChangeDocument extends mongoose.Document {
  date: Date;
  time?: number;
  fileName: string;
  md5: string;
}

interface IChangeModel extends mongoose.Model<IChangeDocument> {
  hasFile: (md5: string) => Promise<boolean>;
  addFile: (file: File, time?: number) => Promise<void>;
}

const model: IChangeModel = mongoose.model<IChangeDocument, IChangeModel>(
  "change",
  change
);
export default model;

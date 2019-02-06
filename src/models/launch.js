import mongoose from "../lib/mongoose";

const launch = mongoose.Schema({
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

launch.statics.findlastChanges = async function findlastChanges() {
  const inst = await this.findOne()
    .sort({ date: -1 })
    .limit(1);
  return inst !== null ? inst.lastChanges : new Date(0);
};

export default mongoose.model("Launch", launch);

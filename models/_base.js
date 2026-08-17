import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({ key: { type: String, unique: true }, seq: { type: Number, default: 0 } });
export const Counter = mongoose.models.Counter || mongoose.model("Counter", counterSchema, "counters");

export function defineModel(name, collection, fields, options = {}) {
  const schema = new mongoose.Schema({
    id: { type: Number, unique: true, index: true },
    ...fields
  }, { versionKey: false, ...options });

  schema.pre("validate", async function assignNumericId() {
    if (this.isNew && !this.id) {
      const counter = await Counter.findOneAndUpdate(
        { key: collection },
        { $inc: { seq: 1 } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      this.id = counter.seq;
    }
  });

  schema.pre("findOneAndUpdate", async function assignNumericIdToUpsert() {
    if (!this.getOptions().upsert) return;
    const update = this.getUpdate() || {}, setOnInsert = update.$setOnInsert || {};
    if (setOnInsert.id || update.id || update.$set?.id) return;
    const counter = await Counter.findOneAndUpdate(
      { key: collection },
      { $inc: { seq: 1 } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    this.setUpdate({ ...update, $setOnInsert: { ...setOnInsert, id: counter.seq } });
  });

  schema.set("toJSON", { transform: (_doc, ret) => { delete ret._id; return ret; } });
  return mongoose.models[name] || mongoose.model(name, schema, collection);
}

export const now = () => new Date();
export const iso = (value) => value ? new Date(value).toISOString() : null;
export const numericId = (value) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};
export const plain = (document) => document?.toObject ? document.toObject() : document;

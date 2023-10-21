import mongoose from "mongoose";

const ResortDataSchema = new mongoose.Schema({
  label: { type: String, required: true },
  name: { type: String, required: true },
  slug: { type: String, required: true },
  img: { type: String, required: true },
  map: { type: String, required: true },
});

export const ResortDataModel = mongoose.model(
  "resorts-helper-file",
  ResortDataSchema
);

import mongoose, { Schema, model, models } from "mongoose";

const driveFileSchema = new Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    uploadedBy: { type: String },
  },
  { timestamps: true }
);

const DriveFile = models.DriveFile || model("DriveFile", driveFileSchema);
export default DriveFile;

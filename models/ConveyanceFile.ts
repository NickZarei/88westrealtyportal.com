import mongoose from "mongoose";

const ConveyanceFileSchema = new mongoose.Schema({
  title: String,
  fileUrl: String,
  uploadedBy: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.ConveyanceFile ||
  mongoose.model("ConveyanceFile", ConveyanceFileSchema);

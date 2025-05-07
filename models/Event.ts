import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    type: { type: String, required: true }, // e.g. Google Review, Video
    notes: { type: String },                // Optional user notes
    createdBy: { type: String, required: true }, // User email
    status: { type: String, default: "Pending" }, // Admin status
  },
  { timestamps: true }
);

export default mongoose.models.Event || mongoose.model("Event", EventSchema);

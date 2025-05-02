import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: String, required: true },
    location: { type: String, required: true },
  },
  { timestamps: true }
);

// Prevent model overwrite on dev/hot reload
export default mongoose.models.Event || mongoose.model("Event", EventSchema);

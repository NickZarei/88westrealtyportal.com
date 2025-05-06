import mongoose, { Schema, model, models } from "mongoose";

const activitySchema = new Schema(
  {
    type: { type: String, required: true },         // e.g. "5-Star Review"
    date: { type: Date, required: true },           // Submission date
    proof: { type: String },                        // Optional proof text
    file: { type: String },                         // Optional file URL
    notes: { type: String },                        // Optional notes
    createdBy: { type: String },                    // User email or ID
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Activity = models.Activity || model("Activity", activitySchema);
export default Activity;

const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["resume", "project_url", "social_link", "document"],
      required: true,
    },
    label: { type: String, required: true },   // e.g. "GitHub", "Resume PDF"
    url: { type: String, default: "" },        // external link or upload path
    filename: { type: String, default: "" },   // for uploaded files
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resource", resourceSchema);

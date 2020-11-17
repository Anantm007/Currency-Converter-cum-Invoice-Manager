const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    data: {
      type: String,
      required: true,
      trim: true,
    },
    mode: {
      type: String,
      default: "admin",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = Note = mongoose.model("Note", noteSchema);

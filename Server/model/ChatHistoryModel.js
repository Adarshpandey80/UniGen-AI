const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      
    },

    request: {
      type: String,
      required: true,
    },

    response: {
      type: String,
    },

    type: {
      type: String,
      enum: ["text", "image", "video"],
      default: "text",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("History", historySchema);

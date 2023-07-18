const mongoose = require("mongoose");
const { isDate } = require("util");
const moment = require('moment');

const VitaminSchema = new mongoose.Schema(
  {
    brandName: {
      type: String,
      required: [true, "Please provide Vitamin brand name"],
      maxlength: 50,
    },
    notes: {
        type: String,
        trim: true,
    },
      isFeatured: {
        type: Boolean,
        default: false
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vitamin", VitaminSchema);
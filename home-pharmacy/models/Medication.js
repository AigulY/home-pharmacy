const mongoose = require("mongoose");
const { isDate } = require("util");
const moment = require('moment');

const MedicationSchema = new mongoose.Schema(
  {
    brandName: {
      type: String,
      required: [true, "Please provide medication brand name"],
      maxlength: 50,
    },
    producer: {
      type: String,
      required: [true, "Please provide medication manufacturer"],
      maxlength: 50,
    },
    opened: {
      type: Date,
      validate: {
        validator: function(dateString) {
          return moment(dateString, 'MM/DD/YYYY', true).isValid();
          },
          message: "Please provide a valid opened date in the format MM/DD/YYYY",
          },
    },
    expirationDate: {
      type: String,
      validate: {
        validator: function(dateString) {
          return moment(dateString, 'MM/DD/YYYY', true).isValid();
          },
          message: "Please provide a valid expiration date in the format MM/DD/YYYY",
           },
          required: true,
          default: () => moment().format('MM/DD/YYYY'),
    },
    productType: {
      type: String,
      enum: ["Tablet", "Drops", "Capsule", "Solution", "Powder", "Ointment", "Spray", "Syrup"],
      default: "Tablet",
    },
    notes: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["New", "Approaching", "Expired"],
      default: "New",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Medication", MedicationSchema);
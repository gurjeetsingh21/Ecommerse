const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 100,
    },
    owner: {
      type: String,
      trim: true,
      required: true,
      maxlength: 50,
    },

    address: {
      type: String,
      trim: true,
      required: true,
      maxlength: 2000,
    },
    pincode: {
      type: Number,
      trim: true,
      required: true,
      maxlength: 6,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Shop", shopSchema);

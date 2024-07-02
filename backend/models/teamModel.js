const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  designation: {
    type: String,
  },
  linkedin_url: {
    type: String,
  },
  image: {
    type: Array,
    filename: {
      type: String,
    },
    filepath: {
      type: String,
      required: true,
    },
  },
  sequence: {
    type: Number,
  },
});

const teamModel = mongoose.model("Team", teamSchema);

module.exports = teamModel;

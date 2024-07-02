const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone_no: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  position: {
    type: Array,
    required: true,
  },
  document: {
    type: Array,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const jobApplicationModel = mongoose.model("Job", jobApplicationSchema);

module.exports = jobApplicationModel;

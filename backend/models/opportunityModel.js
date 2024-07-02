const mongoose = require("mongoose");

const opportunitySchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  responsibility: {
    type: String,
  },
  qualification: {
    type: String,
  },
});

const opportunityModel = mongoose.model("Opportunity", opportunitySchema);

module.exports = opportunityModel;

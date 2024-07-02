const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const careerSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  subtitle: {
    type: String,
  },
  type: {
    type: String,
    enum: ["", "image", "video"],
    default: "",
  },
  media: {
    type: Schema.Types.Mixed,
    required: function () {
      return this.type === "image" || this.type === "video";
    },
  },
  metaTitle: {
    type: String,
  },
  metaDescription: {
    type: String,
  },
});

const careerModel = mongoose.model("Career", careerSchema);

module.exports = careerModel;

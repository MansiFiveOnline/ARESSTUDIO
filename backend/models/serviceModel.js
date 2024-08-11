const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const serviceSchema = new mongoose.Schema({
  service_name: {
    type: String,
    trim: true,
    unique: true,
  },
  url: {
    type: String,
  },
  title: {
    type: String,
  },
  subtitle: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
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
  posterImg: {
    filename: {
      type: String,
      default: null,
    },
    filepath: {
      type: String,
      default: null,
    },
  },
});

const serviceModel = mongoose.model("Service", serviceSchema);

module.exports = serviceModel;

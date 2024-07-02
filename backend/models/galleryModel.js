const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gallerySchema = new mongoose.Schema({
  service_name: {
    type: String,
    index: true,
  },
  gallery_name: {
    type: String,
    trim: true,
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
  isPublic: {
    type: Boolean,
    default: true,
  },
});

const galleryModel = mongoose.model("Gallery", gallerySchema);

module.exports = galleryModel;

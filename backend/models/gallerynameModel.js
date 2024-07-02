const mongoose = require("mongoose");

const galleryNameSchema = new mongoose.Schema({
  service_name: {
    type: String,
    required: true,
  },
  gallery_name: {
    type: String,
    trim: true,
    required: true,
  },
});

const galleryNameModel = mongoose.model("Gallery Names", galleryNameSchema);

module.exports = galleryNameModel;

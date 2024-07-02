const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema({
  email: {
    type: String,
    // required: true,
  },
  password: {
    type: String,
    // required: true,
    minlength: 8,
  },
});

const emailModel = mongoose.model("Passwords", emailSchema);

module.exports = emailModel;

const aboutController = require("../controllers/aboutController");
const express = require("express");
const route = express.Router();
const multer = require("multer");
const adminMiddleware = require("../middleware/adminMiddleware");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/about"); // Specify the folder where files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name for storing
  },
});
const upload = multer({ storage: storage });

route.post(
  "/",
  upload.single("media"),
  adminMiddleware,
  aboutController.createAbout
);

route.patch(
  "/",
  upload.single("media"),
  adminMiddleware,
  aboutController.updateAbout
);

// route.get("/:_id", aboutController.getAbout);

route.get("/", aboutController.getAbout);

module.exports = route;

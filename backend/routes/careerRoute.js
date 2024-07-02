const careerController = require("../controllers/careerController");
const express = require("express");
const route = express.Router();
const multer = require("multer");
const adminMiddleware = require("../middleware/adminMiddleware");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/career"); // Specify the folder where files will be stored
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
  careerController.createCareer
);

route.patch(
  "/",
  upload.single("media"),
  adminMiddleware,
  careerController.updateCareer
);

route.get("/", careerController.getCareer);

// route.get("/:_id", careerController.getCareer);

// route.delete("/:_id", adminMiddleware, careerController.deleteCareer);

module.exports = route;

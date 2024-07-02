const teamController = require("../controllers/teamController");
const express = require("express");
const route = express.Router();
const multer = require("multer");
const adminMiddleware = require("../middleware/adminMiddleware");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/teams"); // Specify the folder where files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name for storing
  },
});
const upload = multer({ storage: storage });

route.post(
  "/",
  upload.single("image"),
  adminMiddleware,
  teamController.createTeam
);

route.patch(
  "/:_id",
  upload.single("image"),
  adminMiddleware,
  teamController.updateTeam
);

route.get("/", teamController.getTeams);

route.get("/:_id", teamController.getTeam);

route.delete("/:_id", adminMiddleware, teamController.deleteTeam);

route.patch("/sequence/:name", adminMiddleware, teamController.sequenceTeam);

module.exports = route;

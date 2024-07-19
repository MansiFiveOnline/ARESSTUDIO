// fixProjectSequences.js
const mongoose = require("mongoose");
const projectDetailsModel = require("./models/projectDetailsModel"); // Adjust the path as necessary

const fixProjectSequences = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://mansifiveonline:mansik11@ares-studio.i63zgxx.mongodb.net/",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    const projectDetails = await projectDetailsModel
      .find()
      .sort({ project_id: 1, sequence: 1 });

    let previousProjectId = null;
    let previousSequence = 0;
    const bulkOps = [];

    for (let detail of projectDetails) {
      if (detail.project_id.toString() === previousProjectId) {
        if (detail.sequence <= previousSequence) {
          detail.sequence = previousSequence + 1;
          bulkOps.push({
            updateOne: {
              filter: { _id: detail._id },
              update: { $set: { sequence: detail.sequence } },
            },
          });
        }
      }
      previousProjectId = detail.project_id.toString();
      previousSequence = detail.sequence;
    }

    if (bulkOps.length > 0) {
      await projectDetailsModel.bulkWrite(bulkOps);
      console.log("Project sequences fixed successfully.");
    } else {
      console.log("No sequences to fix.");
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error(`Error in fixing project sequences: ${error.message}`);
    await mongoose.disconnect();
  }
};

fixProjectSequences();

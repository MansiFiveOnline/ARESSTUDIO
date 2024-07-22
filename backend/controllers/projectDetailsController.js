const path = require("path");
const projectDetailsModel = require("../models/projectDetailsModel");
const projectModel = require("../models/projectModel");

const createProjectDetail = async (req, res) => {
  try {
    const { project_name } = req.body;
    let mediaData = {};
    let fileType = "";

    const file = req.file;
    const media = req.body.media;

    // Function to check if the input is a URL
    const isURL = (str) => {
      try {
        new URL(str);
        return true;
      } catch (error) {
        return false;
      }
    };

    if (isURL(media)) {
      fileType = "video"; // Set fileType to "video" for iframe URLs
      mediaData = {
        filename: null,
        filepath: null,
        iframe: media.trim(),
      };
    } else if (file) {
      // A file is provided
      const isWebPImage = (file) => {
        const extname = path.extname(file.originalname).toLowerCase();
        return extname === ".webp";
      };

      if (!isWebPImage(file)) {
        return res.status(400).json({
          message: "Unsupported file type. Please upload a WebP image.",
        });
      }

      fileType = "image";
      mediaData = {
        filename: file.originalname,
        filepath: file.path,
        iframe: null,
      };
    } else {
      // Handle the case where neither media nor file is provided
      return res.status(400).json({
        message: "Please provide either an iFrame URL or an image.",
      });
    }

    // Find the project_id based on project_name
    const project = await projectModel.findOne({ project_name });
    if (!project) {
      return res.status(404).json({
        message: `Project with name '${project_name}' not found.`,
      });
    }

    // Get the total number of existing teams
    const totalProjectImg = await projectDetailsModel.countDocuments({
      project_name,
    });

    const newProjectDetail = new projectDetailsModel({
      project_name,
      media: mediaData,
      type: fileType, // Add the type property here
      project_id: project._id,
      sequence: totalProjectImg + 1,
    });

    await newProjectDetail.save();

    return res.status(200).json({
      message: "Added project details successfully.",
      newProjectDetail,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in adding project details due to ${error.message}`,
    });
  }
};

const updateProjectDetail = async (req, res) => {
  try {
    const { project_name, media, sequence } = req.body;

    console.log("Received request with:", { project_name, media, sequence });

    // Step 1: Find the _id of the project_name from the project model
    const project = await projectModel.findOne({ project_name });

    if (!project) {
      console.log("Project not found for project_name:", project_name);
      return res.status(404).json({ message: "Project not found." });
    }

    console.log("Found project:", project);

    const existingProjectDetail = await projectDetailsModel.findById(
      req.params._id
    );

    if (!existingProjectDetail) {
      console.log("Project Detail not found for ID:", req.params._id);
      return res.status(404).json({ message: "Project Detail not found." });
    }

    // Step 2: Update project_name for all entries with the same project_id
    await projectDetailsModel.updateMany(
      { project_id: existingProjectDetail.project_id },
      { $set: { project_name: project_name } }
    );

    let mediaData = {
      filename: existingProjectDetail.media.filename,
      filepath: existingProjectDetail.media.filepath,
      iframe: existingProjectDetail.media.iframe,
    };

    // Check if media file is provided
    if (req.file) {
      const isWebPImage = (file) => {
        const extname = path.extname(file.originalname).toLowerCase();
        return extname === ".webp";
      };

      // Validate file type
      if (!isWebPImage(req.file)) {
        return res.status(400).json({
          message: "Unsupported file type. Please upload a WebP image.",
        });
      }

      // Set media data for image
      mediaData = {
        filename: req.file.originalname,
        filepath: req.file.path,
        iframe: null,
      };
    } else if (media !== undefined && media !== null) {
      const trimmedMedia = typeof media === "string" ? media.trim() : media;

      // Check if media is a URL
      const isURL = (str) => {
        try {
          new URL(str);
          return true;
        } catch (error) {
          return false;
        }
      };

      if (trimmedMedia && !isURL(trimmedMedia)) {
        return res.status(400).json({
          message: "Invalid media URL.",
        });
      }

      // Set media data for video
      mediaData = {
        filename: null,
        filepath: null,
        iframe: trimmedMedia,
      };
    }

    // Step 3: Handle sequence update for other project details
    if (sequence && sequence !== existingProjectDetail.sequence) {
      const projectDetails = await projectDetailsModel
        .find({
          project_id: existingProjectDetail.project_id,
        })
        .sort({ sequence: 1 });

      let updateOperations = [];
      let maxSequence = projectDetails.length;

      if (sequence > maxSequence) {
        return res.status(400).json({
          message: `Invalid sequence. The sequence cannot be greater than ${maxSequence}.`,
        });
      }

      projectDetails.forEach((detail) => {
        if (detail._id.toString() !== existingProjectDetail._id.toString()) {
          if (
            detail.sequence >= sequence &&
            detail.sequence < existingProjectDetail.sequence
          ) {
            updateOperations.push({
              updateOne: {
                filter: { _id: detail._id },
                update: { $inc: { sequence: 1 } },
              },
            });
          } else if (
            detail.sequence > existingProjectDetail.sequence &&
            detail.sequence <= sequence
          ) {
            updateOperations.push({
              updateOne: {
                filter: { _id: detail._id },
                update: { $inc: { sequence: -1 } },
              },
            });
          }
        }
      });

      if (updateOperations.length > 0) {
        await projectDetailsModel.bulkWrite(updateOperations);
      }
    }

    // Step 4: Update the specific project detail entry with new values
    const updatedFields = {
      project_name,
      project_id: project._id,
      media: mediaData,
      type: mediaData.filename ? "image" : "video",
      sequence: sequence || existingProjectDetail.sequence,
    };

    const updatedProjectDetail = await projectDetailsModel.findByIdAndUpdate(
      req.params._id,
      updatedFields,
      { new: true }
    );

    return res.status(200).json({
      message: "Project details updated successfully.",
      updatedProjectDetail,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in updating project details: ${error.message}`,
    });
  }
};

const getProjectMediaByName = async (req, res) => {
  try {
    const project_name = req.query.project_name;

    console.log(`Received project name: ${project_name}`);

    const projectName = project_name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
      .trim();

    console.log(`Searching for project: ${projectName}`);

    // Validate input
    if (!projectName) {
      return res.status(400).json({ message: "Project Name is required." });
    }

    const projectDetail = await projectDetailsModel.find({
      project_name: projectName,
    });

    if (!projectDetail || projectDetail.length === 0) {
      return res.status(404).json({
        message: `No project media found for this given project name ${project_name}`,
      });
    }

    // // Extract and sort media by sequence
    // const media = projectDetail
    //   .map((projectDetail) => projectDetail.media)
    //   .flat()
    //   .sort((a, b) => a.sequence - b.sequence);

    // Extract and sort media by sequence
    const media = projectDetail
      .map((detail) => ({
        ...detail.media,
        sequence: detail.sequence,
      }))
      .sort((a, b) => a.sequence - b.sequence);

    return res.status(200).json({
      message: "Project details media fetched successfully.",
      media,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in fetching project detail media due to ${error.message}`,
    });
  }
};

const getProjectDetails = async (req, res) => {
  try {
    // const projectDetails = await projectDetailsModel
    //   .find()
    //   .sort({ sequence: 1 })
    //   .populate("project_id", "project_name");

    const projectDetails = await projectDetailsModel.aggregate([
      {
        $lookup: {
          from: "projects",
          localField: "project_id",
          foreignField: "_id",
          as: "project",
        },
      },
      {
        $unwind: "$project",
      },
      {
        $sort: {
          "project.project_name": 1,
          sequence: 1,
        },
      },
    ]);

    console.log(projectDetails); // Log the populated project details

    if (projectDetails.length === 0) {
      return res.status(400).json({
        message: "No project details are created. Kindly create one.",
      });
    }
    return res.status(200).json({
      message: "All project details fetched successfully.",
      count: projectDetails.length,
      projectDetails,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in fetching project details due to ${error.message}`,
    });
  }
};

const getProjectDetail = async (req, res) => {
  try {
    const projectDetail = await projectDetailsModel.findById(req.params._id);
    console.log(req.params._id);
    if (!projectDetail) {
      return res.status(400).json({
        message: "No project detail is created with this id.",
      });
    }

    return res.status(200).json({
      message: "project detail fetched successfully.",
      projectDetail,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in fetching project detail due to ${error.message}`,
    });
  }
};

const getTotalCount = async (req, res) => {
  try {
    const projectName = req.params.project_name;
    const count = await projectDetailsModel.countDocuments({
      project_name: projectName,
    });
    res.status(200).json({ count });
  } catch (error) {
    return res.status(500).json({
      message: `Error in deleting project detail due to ${error.message}`,
    });
  }
};

// const deleteProjectDetail = async (req, res) => {
//   try {
//     const projectDetailExists = await projectDetailsModel.findById({
//       _id: req.params._id,
//     });

//     if (projectDetailExists.length === 0) {
//       return res.status(400).json({
//         message: "No project details are created. Kindly create one.",
//       });
//     }

//     const deletedProjectDetail = await projectDetailsModel.findOneAndDelete({
//       _id: req.params._id,
//     });

//     return res.status(200).json({
//       message: "project detail deleted successfully.",
//       deletedProjectDetail,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: `Error in deleting project detail due to ${error.message}`,
//     });
//   }
// };

// const deleteProjectDetail = async (req, res) => {
//   try {
//     const projectDetail = await projectDetailsModel.findById(req.params._id);

//     if (!projectDetail) {
//       return res.status(404).json({
//         message: "Project detail not found.",
//       });
//     }

//     const deletedSequence = projectDetail.sequence;
//     const projectName = projectDetail.project_name;

//     await projectDetailsModel.deleteOne({ _id: req.params._id });

//     // Update sequence for subsequent entries of the same project name
//     await projectDetailsModel.updateMany(
//       { project_name: projectName, sequence: { $gt: deletedSequence } },
//       { $inc: { sequence: -1 } }
//     );

//     return res.status(200).json({
//       message: "Project detail deleted successfully.",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: `Error in deleting project detail due to ${error.message}`,
//     });
//   }
// };

const deleteProjectDetail = async (req, res) => {
  try {
    const projectDetail = await projectDetailsModel.findById(req.params._id);

    if (!projectDetail) {
      return res.status(404).json({
        message: "Project detail not found.",
      });
    }

    const deletedSequence = projectDetail.sequence;
    const projectName = projectDetail.project_name;

    await projectDetailsModel.deleteOne({ _id: req.params._id });

    // Update sequence for subsequent entries of the same project name
    await projectDetailsModel.updateMany(
      { project_name: projectName, sequence: { $gt: deletedSequence } },
      { $inc: { sequence: -1 } }
    );

    // Fetch updated project details after deletion and sequence update
    const updatedProjectDetails = await projectDetailsModel.aggregate([
      {
        $lookup: {
          from: "projects",
          localField: "project_id",
          foreignField: "_id",
          as: "project",
        },
      },
      {
        $unwind: "$project",
      },
      {
        $sort: {
          "project.project_name": 1,
          sequence: 1,
        },
      },
    ]);

    return res.status(200).json({
      message: "Project detail deleted successfully.",
      count: updatedProjectDetails.length,
      projectDetails: updatedProjectDetails,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in deleting project detail due to ${error.message}`,
    });
  }
};

module.exports = {
  createProjectDetail,
  updateProjectDetail,
  getProjectMediaByName,
  getProjectDetails,
  getProjectDetail,
  getTotalCount,
  deleteProjectDetail,
};

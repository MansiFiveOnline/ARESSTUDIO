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

// const updateProjectDetail = async (req, res) => {
//   try {
//     const { project_name, media } = req.body;

//     // Step 1: Find the _id of the project_name from the project model
//     const project = await projectModel.findOne({ project_name });

//     if (!project) {
//       return res.status(404).json({ message: "Project not found." });
//     }

//     const existingProjectDetail = await projectDetailsModel.findById(
//       req.params._id
//     );

//     if (!existingProjectDetail) {
//       return res.status(404).json({ message: "Project Detail not found." });
//     }

//     let mediaData = {
//       filename: existingProjectDetail.media.filename,
//       filepath: existingProjectDetail.media.filepath,
//       iframe: existingProjectDetail.media.iframe,
//     };

//     // Check if media file is provided
//     if (req.file) {
//       // ... (existing code for handling file upload)
//     } else if (media !== undefined && media !== null) {
//       // ... (existing code for handling media URL)
//     }

//     // Step 2: Update project_id in updatedFields
//     const updatedFields = {
//       ...(project_name && { project_name }),
//       project_id: project._id, // Update project_id with the fetched _id
//       media: mediaData,
//       type: mediaData.filename ? "image" : "video",
//     };

//     const updatedProjectDetail = await projectDetailsModel.findByIdAndUpdate(
//       req.params._id,
//       updatedFields,
//       { new: true }
//     );

//     return res.status(200).json({
//       message: "Project details updated successfully.",
//       updatedProjectDetail,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: `Error in updating project details: ${error.message}`,
//     });
//   }
// };

// const updateProjectDetail = async (req, res) => {
//   try {
//     const { project_name, media } = req.body;

//     // Step 1: Find the _id of the project_name from the project model
//     const project = await projectModel.findOne({ project_name });

//     if (!project) {
//       return res.status(404).json({ message: "Project not found." });
//     }

//     const existingProjectDetail = await projectDetailsModel.findById(
//       req.params._id
//     );

//     if (!existingProjectDetail) {
//       return res.status(404).json({ message: "Project Detail not found." });
//     }

//     let mediaData = {
//       filename: existingProjectDetail.media.filename,
//       filepath: existingProjectDetail.media.filepath,
//       iframe: existingProjectDetail.media.iframe,
//     };

//     // Check if media file is provided
//     if (req.file) {
//       const isWebPImage = (file) => {
//         const extname = path.extname(file.originalname).toLowerCase();
//         return extname === ".webp";
//       };

//       // Validate file type
//       if (!isWebPImage(req.file)) {
//         return res.status(400).json({
//           message: "Unsupported file type. Please upload a WebP image.",
//         });
//       }

//       // Set media data for image
//       mediaData = {
//         filename: req.file.originalname,
//         filepath: req.file.path,
//         iframe: null,
//       };
//     } else if (media !== undefined && media !== null) {
//       const trimmedMedia = typeof media === "string" ? media.trim() : media;

//       // Check if media is a URL
//       const isURL = (str) => {
//         try {
//           new URL(str);
//           return true;
//         } catch (error) {
//           return false;
//         }
//       };

//       if (trimmedMedia && !isURL(trimmedMedia)) {
//         return res.status(400).json({
//           message: "Invalid media URL.",
//         });
//       }

//       // Set media data for video
//       mediaData = {
//         filename: null,
//         filepath: null,
//         iframe: trimmedMedia,
//       };
//     }

//     // Step 2: Update project_id in updatedFields
//     const updatedFields = {
//       ...(project_name && { project_name }),
//       project_id: project._id, // Update project_id with the fetched _id
//       media: mediaData,
//       type: mediaData.filename ? "image" : "video",
//     };

//     const updatedProjectDetail = await projectDetailsModel.findByIdAndUpdate(
//       req.params._id,
//       updatedFields,
//       { new: true }
//     );

//     return res.status(200).json({
//       message: "Project details updated successfully.",
//       // updatedFields,
//       updatedProjectDetail,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: `Error in updating project details: ${error.message}`,
//     });
//   }
// };

// const updateProjectDetail = async (req, res) => {
//   try {
//     const { project_name, media, sequence } = req.body;

//     // Step 1: Find the _id of the project_name from the project model
//     const project = await projectModel.findOne({ project_name });

//     if (!project) {
//       return res.status(404).json({ message: "Project not found." });
//     }

//     const existingProjectDetail = await projectDetailsModel.findById(
//       req.params._id
//     );

//     if (!existingProjectDetail) {
//       return res.status(404).json({ message: "Project Detail not found." });
//     }

//     let mediaData = {
//       filename: existingProjectDetail.media.filename,
//       filepath: existingProjectDetail.media.filepath,
//       iframe: existingProjectDetail.media.iframe,
//     };

//     // Check if media file is provided
//     if (req.file) {
//       const isWebPImage = (file) => {
//         const extname = path.extname(file.originalname).toLowerCase();
//         return extname === ".webp";
//       };

//       // Validate file type
//       if (!isWebPImage(req.file)) {
//         return res.status(400).json({
//           message: "Unsupported file type. Please upload a WebP image.",
//         });
//       }

//       // Set media data for image
//       mediaData = {
//         filename: req.file.originalname,
//         filepath: req.file.path,
//         iframe: null,
//       };
//     } else if (media !== undefined && media !== null) {
//       const trimmedMedia = typeof media === "string" ? media.trim() : media;

//       // Check if media is a URL
//       const isURL = (str) => {
//         try {
//           new URL(str);
//           return true;
//         } catch (error) {
//           return false;
//         }
//       };

//       if (trimmedMedia && !isURL(trimmedMedia)) {
//         return res.status(400).json({
//           message: "Invalid media URL.",
//         });
//       }

//       // Set media data for video
//       mediaData = {
//         filename: null,
//         filepath: null,
//         iframe: trimmedMedia,
//       };
//     }

//     // Step 2: Handle sequence update for other project details
//     if (sequence && sequence !== existingProjectDetail.sequence) {
//       await projectDetailsModel.updateMany(
//         {
//           project_id: project._id,
//           sequence: { $gte: sequence },
//           _id: { $ne: existingProjectDetail._id },
//         },
//         { $inc: { sequence: 1 } }
//       );
//     }

//     // Step 3: Update project_name and project_id for all entries with the same project ID
//     await projectDetailsModel.updateMany(
//       { project_id: project._id },
//       { $set: { project_name: project_name } }
//     );

//     // Step 4: Update project_id in updatedFields
//     const updatedFields = {
//       ...(project_name && { project_name }),
//       project_id: project._id, // Update project_id with the fetched _id
//       media: mediaData,
//       type: mediaData.filename ? "image" : "video",
//       ...(sequence && { sequence }), // Add sequence field
//     };

//     const updatedProjectDetail = await projectDetailsModel.findByIdAndUpdate(
//       req.params._id,
//       updatedFields,
//       { new: true }
//     );

//     return res.status(200).json({
//       message: "Project details updated successfully.",
//       updatedProjectDetail,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: `Error in updating project details: ${error.message}`,
//     });
//   }
// };

// const updateProjectDetail = async (req, res) => {
//   try {
//     const { project_name, media, sequence } = req.body;

//     // Step 1: Find the _id of the project_name from the project model
//     const project = await projectModel.findOne({ project_name });

//     if (!project) {
//       return res.status(404).json({ message: "Project not found." });
//     }

//     const existingProjectDetail = await projectDetailsModel.findById(
//       req.params._id
//     );

//     if (!existingProjectDetail) {
//       return res.status(404).json({ message: "Project Detail not found." });
//     }

//     // Step 2: Update project_name for all entries with the same project_id
//     await projectDetailsModel.updateMany(
//       { project_id: existingProjectDetail.project_id },
//       { $set: { project_name: project_name } }
//     );

//     let mediaData = {
//       filename: existingProjectDetail.media.filename,
//       filepath: existingProjectDetail.media.filepath,
//       iframe: existingProjectDetail.media.iframe,
//     };

//     // Check if media file is provided
//     if (req.file) {
//       const isWebPImage = (file) => {
//         const extname = path.extname(file.originalname).toLowerCase();
//         return extname === ".webp";
//       };

//       // Validate file type
//       if (!isWebPImage(req.file)) {
//         return res.status(400).json({
//           message: "Unsupported file type. Please upload a WebP image.",
//         });
//       }

//       // Set media data for image
//       mediaData = {
//         filename: req.file.originalname,
//         filepath: req.file.path,
//         iframe: null,
//       };
//     } else if (media !== undefined && media !== null) {
//       const trimmedMedia = typeof media === "string" ? media.trim() : media;

//       // Check if media is a URL
//       const isURL = (str) => {
//         try {
//           new URL(str);
//           return true;
//         } catch (error) {
//           return false;
//         }
//       };

//       if (trimmedMedia && !isURL(trimmedMedia)) {
//         return res.status(400).json({
//           message: "Invalid media URL.",
//         });
//       }

//       // Set media data for video
//       mediaData = {
//         filename: null,
//         filepath: null,
//         iframe: trimmedMedia,
//       };
//     }

//     // Step 3: Handle sequence update for other project details
//     if (sequence && sequence !== existingProjectDetail.sequence) {
//       await projectDetailsModel.updateMany(
//         {
//           project_id: project._id,
//           sequence: { $gte: sequence },
//           _id: { $ne: existingProjectDetail._id },
//         },
//         { $inc: { sequence: 1 } }
//       );
//     }

//     // Step 4: Update project_id and other fields in updatedFields
//     const updatedFields = {
//       project_name,
//       project_id: project._id, // Update project_id with the fetched _id
//       media: mediaData,
//       type: mediaData.filename ? "image" : "video",
//       ...(sequence && { sequence }), // Add sequence field
//     };

//     const updatedProjectDetail = await projectDetailsModel.findByIdAndUpdate(
//       req.params._id,
//       updatedFields,
//       { new: true }
//     );

//     return res.status(200).json({
//       message: "Project details updated successfully.",
//       updatedProjectDetail,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: `Error in updating project details: ${error.message}`,
//     });
//   }
// };

// const updateProjectDetail = async (req, res) => {
//   try {
//     const { project_name, media, sequence } = req.body;

//     console.log("Received request with:", { project_name, media, sequence });
//     // Step 1: Find the _id of the project_name from the project model
//     const project = await projectModel.findOne({ project_name });

//     if (!project) {
//       console.log("Project not found for project_name:", project_name);
//       return res.status(404).json({ message: "Project not found." });
//     }

//     console.log("Found project:", project);

//     const existingProjectDetail = await projectDetailsModel.findById(
//       req.params._id
//     );

//     if (!existingProjectDetail) {
//       console.log("Project Detail not found for ID:", req.params._id);
//       return res.status(404).json({ message: "Project Detail not found." });
//     }

//     // Step 2: Update project_name for all entries with the same project_id
//     await projectDetailsModel.updateMany(
//       { project_id: existingProjectDetail.project_id },
//       { $set: { project_name: project_name } }
//     );

//     let mediaData = {
//       filename: existingProjectDetail.media.filename,
//       filepath: existingProjectDetail.media.filepath,
//       iframe: existingProjectDetail.media.iframe,
//     };

//     // Check if media file is provided
//     if (req.file) {
//       const isWebPImage = (file) => {
//         const extname = path.extname(file.originalname).toLowerCase();
//         return extname === ".webp";
//       };

//       // Validate file type
//       if (!isWebPImage(req.file)) {
//         return res.status(400).json({
//           message: "Unsupported file type. Please upload a WebP image.",
//         });
//       }

//       // Set media data for image
//       mediaData = {
//         filename: req.file.originalname,
//         filepath: req.file.path,
//         iframe: null,
//       };
//     } else if (media !== undefined && media !== null) {
//       const trimmedMedia = typeof media === "string" ? media.trim() : media;

//       // Check if media is a URL
//       const isURL = (str) => {
//         try {
//           new URL(str);
//           return true;
//         } catch (error) {
//           return false;
//         }
//       };

//       if (trimmedMedia && !isURL(trimmedMedia)) {
//         return res.status(400).json({
//           message: "Invalid media URL.",
//         });
//       }

//       // Set media data for video
//       mediaData = {
//         filename: null,
//         filepath: null,
//         iframe: trimmedMedia,
//       };
//     }

//     // Step 3: Handle sequence update for other project details
//     if (sequence && sequence !== existingProjectDetail.sequence) {
//       await projectDetailsModel.updateMany(
//         {
//           project_id: existingProjectDetail.project_id,
//           sequence: { $gte: sequence },
//           _id: { $ne: existingProjectDetail._id },
//         },
//         { $inc: { sequence: 1 } }
//       );
//     }

//     // Step 4: Update the specific project detail entry with new values
//     const updatedFields = {
//       project_name,
//       project_id: project._id,
//       media: mediaData,
//       type: mediaData.filename ? "image" : "video",
//       ...(sequence && { sequence }),
//     };

//     const updatedProjectDetail = await projectDetailsModel.findByIdAndUpdate(
//       req.params._id,
//       updatedFields,
//       { new: true }
//     );

//     return res.status(200).json({
//       message: "Project details updated successfully.",
//       updatedProjectDetail,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: `Error in updating project details: ${error.message}`,
//     });
//   }
// };

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

// const updateProjectDetail = async (req, res) => {
//   try {
//     const { project_name, media, sequence } = req.body;

//     console.log("Received request with:", { project_name, media, sequence });

//     // Step 1: Find the _id of the project_name from the project model
//     const project = await projectModel.findOne({ _id: project_name }); // Adjust to find by _id

//     if (!project) {
//       console.log("Project not found for project_name:", project_name);
//       return res.status(404).json({ message: "Project not found." });
//     }

//     console.log("Found project:", project);

//     const existingProjectDetail = await projectDetailsModel.findById(
//       req.params._id
//     );

//     if (!existingProjectDetail) {
//       console.log("Project Detail not found for ID:", req.params._id);
//       return res.status(404).json({ message: "Project Detail not found." });
//     }

//     console.log("Found existing project detail:", existingProjectDetail);

//     // Step 2: Update project_name for all entries with the same project_id
//     const updateManyResult = await projectDetailsModel.updateMany(
//       { project_id: existingProjectDetail.project_id },
//       { $set: { project_name: project.project_name } }
//     );

//     console.log("updateMany result:", updateManyResult);

//     let mediaData = {
//       filename: existingProjectDetail.media.filename,
//       filepath: existingProjectDetail.media.filepath,
//       iframe: existingProjectDetail.media.iframe,
//     };

//     // Check if media file is provided
//     if (req.file) {
//       const isWebPImage = (file) => {
//         const extname = path.extname(file.originalname).toLowerCase();
//         return extname === ".webp";
//       };

//       // Validate file type
//       if (!isWebPImage(req.file)) {
//         return res.status(400).json({
//           message: "Unsupported file type. Please upload a WebP image.",
//         });
//       }

//       // Set media data for image
//       mediaData = {
//         filename: req.file.originalname,
//         filepath: req.file.path,
//         iframe: null,
//       };
//     } else if (media !== undefined && media !== null) {
//       const trimmedMedia = typeof media === "string" ? media.trim() : media;

//       // Check if media is a URL
//       const isURL = (str) => {
//         try {
//           new URL(str);
//           return true;
//         } catch (error) {
//           return false;
//         }
//       };

//       if (trimmedMedia && !isURL(trimmedMedia)) {
//         return res.status(400).json({
//           message: "Invalid media URL.",
//         });
//       }

//       // Set media data for video
//       mediaData = {
//         filename: null,
//         filepath: null,
//         iframe: trimmedMedia,
//       };
//     }

//     console.log("Prepared media data:", mediaData);

//     // Step 3: Handle sequence update for other project details
//     if (sequence && sequence !== existingProjectDetail.sequence) {
//       const updateSequenceResult = await projectDetailsModel.updateMany(
//         {
//           project_id: existingProjectDetail.project_id,
//           sequence: { $gte: sequence },
//           _id: { $ne: existingProjectDetail._id },
//         },
//         { $inc: { sequence: 1 } }
//       );

//       console.log("updateSequence result:", updateSequenceResult);
//     }

//     // Step 4: Update the specific project detail entry with new values
//     const updatedFields = {
//       project_name: project.project_name,
//       project_id: project._id,
//       media: mediaData,
//       type: mediaData.filename ? "image" : "video",
//       ...(sequence && { sequence }),
//     };

//     const updatedProjectDetail = await projectDetailsModel.findByIdAndUpdate(
//       req.params._id,
//       updatedFields,
//       { new: true }
//     );

//     console.log("Updated project detail:", updatedProjectDetail);

//     return res.status(200).json({
//       message: "Project details updated successfully.",
//       updatedProjectDetail,
//     });
//   } catch (error) {
//     console.error("Error in updating project details:", error.message);
//     return res.status(500).json({
//       message: `Error in updating project details: ${error.message}`,
//     });
//   }
// };

// const updateProjectDetail = async (req, res) => {
//   try {
//     const { project_name, media, sequence } = req.body;

//     console.log("Received request with:", { project_name, media, sequence });

//     // Step 1: Find the project by _id from the project model
//     const project = await projectModel.findById(project_name);

//     if (!project) {
//       console.log("Project not found for _id:", project_name);
//       return res.status(404).json({ message: "Project not found." });
//     }

//     console.log("Found project:", project);

//     // Step 2: Fetch the existing project detail by _id
//     const existingProjectDetail = await projectDetailsModel.findById(
//       req.params._id
//     );

//     if (!existingProjectDetail) {
//       console.log("Project Detail not found for ID:", req.params._id);
//       return res.status(404).json({ message: "Project Detail not found." });
//     }

//     console.log("Found existing project detail:", existingProjectDetail);

//     // Step 3: Find all project details with the same project_id
//     const relatedProjectDetails = await projectDetailsModel.find({
//       project_id: existingProjectDetail.project_id,
//     });

//     if (!relatedProjectDetails || relatedProjectDetails.length === 0) {
//       console.log(
//         "No related project details found for project_id:",
//         existingProjectDetail.project_id
//       );
//       return res
//         .status(404)
//         .json({ message: "No related project details found." });
//     }

//     console.log("Found related project details:", relatedProjectDetails);

//     // Step 4: Update project_name for all related entries
//     const updatePromises = relatedProjectDetails.map(async (detail) => {
//       const updatedDetail = await projectDetailsModel.findByIdAndUpdate(
//         detail._id,
//         { $set: { project_name: project.project_name } },
//         { new: true }
//       );
//       return updatedDetail;
//     });

//     const updatedProjectDetails = await Promise.all(updatePromises);

//     console.log("Updated project details:", updatedProjectDetails);

//     let mediaData = {
//       filename: existingProjectDetail.media.filename,
//       filepath: existingProjectDetail.media.filepath,
//       iframe: existingProjectDetail.media.iframe,
//     };

//     // Check if media file is provided
//     if (req.file) {
//       const isWebPImage = (file) => {
//         const extname = path.extname(file.originalname).toLowerCase();
//         return extname === ".webp";
//       };

//       // Validate file type
//       if (!isWebPImage(req.file)) {
//         return res.status(400).json({
//           message: "Unsupported file type. Please upload a WebP image.",
//         });
//       }

//       // Set media data for image
//       mediaData = {
//         filename: req.file.originalname,
//         filepath: req.file.path,
//         iframe: null,
//       };
//     } else if (media !== undefined && media !== null) {
//       const trimmedMedia = typeof media === "string" ? media.trim() : media;

//       // Check if media is a URL
//       const isURL = (str) => {
//         try {
//           new URL(str);
//           return true;
//         } catch (error) {
//           return false;
//         }
//       };

//       if (trimmedMedia && !isURL(trimmedMedia)) {
//         return res.status(400).json({
//           message: "Invalid media URL.",
//         });
//       }

//       // Set media data for video
//       mediaData = {
//         filename: null,
//         filepath: null,
//         iframe: trimmedMedia,
//       };
//     }

//     console.log("Prepared media data:", mediaData);

//     // Step 5: Handle sequence update for other project details
//     if (sequence && sequence !== existingProjectDetail.sequence) {
//       const updateSequenceResult = await projectDetailsModel.updateMany(
//         {
//           project_id: existingProjectDetail.project_id,
//           sequence: { $gte: sequence },
//           _id: { $ne: existingProjectDetail._id },
//         },
//         { $inc: { sequence: 1 } }
//       );

//       console.log("updateSequence result:", updateSequenceResult);
//     }

//     // Step 6: Update the specific project detail entry with new values
//     const updatedFields = {
//       project_name: project.project_name,
//       project_id: project._id,
//       media: mediaData,
//       type: mediaData.filename ? "image" : "video",
//       ...(sequence && { sequence }),
//     };

//     const updatedProjectDetail = await projectDetailsModel.findByIdAndUpdate(
//       req.params._id,
//       updatedFields,
//       { new: true }
//     );

//     console.log("Updated project detail:", updatedProjectDetail);

//     return res.status(200).json({
//       message: "Project details updated successfully.",
//       updatedProjectDetail,
//     });
//   } catch (error) {
//     console.error("Error in updating project details:", error.message);
//     return res.status(500).json({
//       message: `Error in updating project details: ${error.message}`,
//     });
//   }
// };

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

// const getProjectMediaByName = async (req, res) => {
//   try {
//     const project_name = req.query.project_name;

//     console.log(`Received project name: ${project_name}`);

//     const projectName = project_name
//       .split("-")
//       .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
//       .join(" ")
//       .trim();

//     console.log(`Searching for project: ${projectName}`);

//     const projectDetail = await projectDetailsModel.find({
//       project_name: projectName,
//     });

//     // Validate input
//     if (!projectName) {
//       return res.status(400).json({ message: "Project Name is required." });
//     }

//     if (!projectDetail || projectDetail.length === 0) {
//       return res.status(404).json({
//         message: `No project media found for this given project name ${project_name}`,
//       });
//     }

//     // Extract media from the gallery
//     const media = projectDetail
//       .map((projectDetail) => projectDetail.media)
//       .flat();

//     return res.status(200).json({
//       message: "Project details media fetched successfully.",
//       media,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: `Error in fetching project detail media due to ${error.message}`,
//     });
//   }
// };

// const getProjectDetails = async (req, res) => {
//   try {
//     const projectDetails = await projectDetailsModel.find();

//     if (projectDetails.length === 0) {
//       return res.status(400).json({
//         message: "No project details are created. Kindly create one.",
//       });
//     }
//     return res.status(200).json({
//       message: "All project details fetched successfully.",
//       count: projectDetails.length,
//       projectDetails,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: `Error in fetching project details due to ${error.message}`,
//     });
//   }
// };

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

const deleteProjectDetail = async (req, res) => {
  try {
    const projectDetailExists = await projectDetailsModel.findById({
      _id: req.params._id,
    });

    if (projectDetailExists.length === 0) {
      return res.status(400).json({
        message: "No project details are created. Kindly create one.",
      });
    }

    const deletedProjectDetail = await projectDetailsModel.findOneAndDelete({
      _id: req.params._id,
    });

    return res.status(200).json({
      message: "project detail deleted successfully.",
      deletedProjectDetail,
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

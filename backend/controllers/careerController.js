const careerModel = require("../models/careerModel");
const path = require("path");

// const createCareer = async (req, res) => {
//   try {
//     const { title, subtitle, media, metaTitle, metaDescription } = req.body;
//     let mediaData = {};

//     const file = req.file;

//     let fileType = "";
//     // Function to check if the input is a URL
//     const isURL = (str) => {
//       try {
//         new URL(str);
//         return true;
//       } catch (error) {
//         return false;
//       }
//     };

//     // Check if media is a URL (iframe)
//     if (isURL(media)) {
//       fileType = "video"; // Set fileType to "video" for iframe URLs
//       mediaData = {
//         filename: null,
//         filepath: null,
//         iframe: media.trim(),
//       };
//     } else if (file) {
//       // A file is provided
//       // Check if the file is a WebP image
//       const isWebPImage = (file) => {
//         const extname = path.extname(file.originalname).toLowerCase();
//         return extname === ".webp";
//       };

//       if (!isWebPImage(file)) {
//         return res.status(400).json({
//           message: "Unsupported file type. Please upload a WebP image.",
//         });
//       }

//       fileType = "image";
//       mediaData = {
//         filename: req.file.originalname,
//         filepath: req.file.path,
//         iframe: null,
//       };
//     } else {
//       // Neither iframe nor file is provided
//       return res.status(400).json({
//         message:
//           "Either an iFrame URL or an image file is required for the media field.",
//       });
//     }

//     const newCareer = new careerModel({
//       title,
//       subtitle,
//       type: fileType,
//       media: mediaData,
//       metaTitle,
//       metaDescription,
//     });

//     await newCareer.save();

//     return res.status(200).json({
//       message: "Added Career content successfully.",
//       newCareer,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: `Error in adding career due to ${error.message}`,
//     });
//   }
// };

const createCareer = async (req, res) => {
  try {
    const { title, subtitle, media, metaTitle, metaDescription } = req.body;
    // Function to check if the file is a WebP image

    let mediaData = {};

    // if (!media || (typeof media === "string" && !isURL(media.trim()))) {
    //   return res.status(400).json({
    //     message:
    //       "Either a file or a valid URL is required for the media field.",
    //   });
    // }
    const file = req.file;
    // Check if the file is a WebP image
    // Function to check if the file is a WebP image
    let fileType = "";

    // Function to check if the input is a URL
    const isURL = (str) => {
      try {
        new URL(str);
        return true;
      } catch (error) {
        return false;
      }
    };

    // Check if media is a URL (iframe)
    if (isURL(media)) {
      fileType = "video"; // Set fileType to "video" for iframe URLs
      mediaData = {
        filename: null,
        filepath: null,
        iframe: media.trim(),
      };
    } else {
      const file = req.file;
      if (!file) {
        return res.status(400).json({
          message:
            "Either a file or a valid URL is required for the media field.",
        });
      }
      // Check if the file is a WebP image
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
        filename: req.file.originalname,
        filepath: req.file.path,
        iframe: null,
      };
    }
    // } else {
    //   mediaData = {
    //     filename: null,
    //     filepath: null,
    //     iframe: media.trim(),
    //   };

    const newCareer = new careerModel({
      title,
      subtitle,
      type: fileType,
      media: mediaData,
      metaTitle,
      metaDescription,
    });

    await newCareer.save();

    return res.status(200).json({
      message: "Added Career content sucessfully.",
      newCareer,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in adding career due to ${error.message}`,
    });
  }
};

// const updateCareer = async (req, res) => {
//   try {
//     const { title, subtitle, metaTitle, metaDescription, media } = req.body;

//     // Fetch the existing service to retain current media values if not updated
//     const existingCareer = await careerModel.findById(req.params._id);
//     if (!existingCareer) {
//       return res.status(404).json({ message: "Career not found." });
//     }

//     let mediaData = {
//       filename: existingCareer.media.filename,
//       filepath: existingCareer.media.filepath,
//       iframe: existingCareer.media.iframe,
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
//       const trimmedMedia = media.trim();

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
//     // Create object with updated fields
//     const updatedFields = {
//       ...(title && { title }),
//       ...(subtitle && { subtitle }),
//       ...(metaTitle && { metaTitle }),
//       ...(metaDescription && { metaDescription }),
//       media: mediaData,
//       type: mediaData.filename ? "image" : "video",
//     };

//     // Update career in the database
//     const updatedCareer = await careerModel.findByIdAndUpdate(
//       req.params._id,
//       updatedFields,
//       { new: true }
//     );

//     return res.status(200).json({
//       message: "Career content updated successfully.",
//       updatedCareer,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: `Error in updating Career due to ${error.message}`,
//     });
//   }
// };

const updateCareer = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      metaTitle,
      metaDescription,
      media, // Add media to destructuring to check its presence
    } = req.body;

    // Fetch the current Career document
    const currentCareer = await careerModel.findOne({});
    if (!currentCareer) {
      return res.status(404).json({ message: "Career content not found." });
    }

    let mediaData = currentCareer.media; // Initialize with current media data
    let fileType = currentCareer.type; // Initialize with current media type

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
      fileType = "image";
    } else if (media) {
      const trimmedMedia = media.trim();

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
      fileType = "video";
    }

    const updatedFields = {
      title,
      subtitle,
      metaTitle,
      metaDescription,
      media: mediaData,
      type: fileType,
    };

    const updatedCareer = await careerModel.findOneAndUpdate(
      {},
      updatedFields,
      {
        new: true,
      }
    );

    console.log(updatedCareer);

    return res.status(200).json({
      message: "Career content updated successfully.",
      updatedCareer,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in updating Career due to ${error.message}`,
    });
  }
};

// const getCareers = async (req, res) => {
//   try {
//     const careers = await careerModel.find();

//     if (careers.length === 0) {
//       return res.status(400).json({
//         message: "No careers are created. Kindly create one.",
//       });
//     }
//     return res.status(200).json({
//       message: "All careers fetched successfully.",
//       count: careers.length,
//       careers,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: `Error in fetching careers due to ${error.message}`,
//     });
//   }
// };

// const getCareer = async (req, res) => {
//   try {
//     const career = await careerModel.findById(req.params._id);
//     console.log(req.params._id);
//     if (!career) {
//       return res.status(400).json({
//         message: "No Career is created with this id.",
//       });
//     }

//     return res.status(200).json({
//       message: "Career fetched successfully.",
//       career,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: `Error in fetching career due to ${error.message}`,
//     });
//   }
// };

const getCareer = async (req, res) => {
  try {
    const careers = await careerModel.find();
    // console.log(req.params._id);
    if (!careers) {
      return res.status(400).json({
        message: "No Career is created.",
      });
    }

    return res.status(200).json({
      message: "All Career fetched successfully.",
      careers,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in fetching careers due to ${error.message}`,
    });
  }
};

// const deleteCareer = async (req, res) => {
//   try {
//     const careerExists = await careerModel.findById({
//       _id: req.params._id,
//     });

//     if (careerExists.length === 0) {
//       return res.status(400).json({
//         message: "No career are created. Kindly create one.",
//       });
//     }

//     const deletedCareer = await careerModel.findOneAndDelete({
//       _id: req.params._id,
//     });

//     return res.status(200).json({
//       message: "Career deleted successfully.",
//       deletedCareer,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: `Error in deleting career due to ${error.message}`,
//     });
//   }
// };

module.exports = {
  createCareer,
  updateCareer,
  // getCareers,
  getCareer,
  // deleteCareer,
};

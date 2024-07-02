const serviceModel = require("../models/serviceModel");
const path = require("path");

const createService = async (req, res) => {
  try {
    const {
      service_name,
      title,
      subtitle,
      description,
      media,
      metaTitle,
      metaDescription,
    } = req.body;

    let mediaData = {};

    const urlSlug = service_name.toLowerCase().replace(/\s+/g, "-");
    const url = `http:/localhost:8000/api/${urlSlug}`;

    const file = req.file;

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

    if (isURL(media)) {
      fileType = "video"; // Set fileType to "video" for iframe URLs
      mediaData = {
        filename: null,
        filepath: null,
        iframe: media.trim(),
      };
    } else if (file) {
      // A file is provided
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
    } else {
      // Neither iframe nor file is provided
      return res.status(400).json({
        message:
          "Either an iFrame URL or an image file is required for the media field.",
      });
    }

    const newService = new serviceModel({
      service_name,
      url,
      title,
      subtitle,
      description,
      type: fileType,
      media: mediaData,
      metaTitle,
      metaDescription,
    });

    await newService.save();

    return res.status(200).json({
      message: "Added Service content sucessfully.",
      newService,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in adding Service due to ${error.message}`,
    });
  }
};

// const updateService = async (req, res) => {
//   try {
//     const {
//       service_name,
//       title,
//       subtitle,
//       description,
//       metaTitle,
//       metaDescription,
//     } = req.body;

//     let mediaData = null;

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
//     } else if (req.body.media) {
//       // Check if media is a URL
//       const isURL = (str) => {
//         try {
//           new URL(str);
//           return true;
//         } catch (error) {
//           return false;
//         }
//       };

//       if (!isURL(req.body.media)) {
//         return res.status(400).json({
//           message: "Invalid media URL.",
//         });
//       }

//       // Set media data for video
//       mediaData = {
//         filename: null,
//         filepath: null,
//         iframe: req.body.media.trim(),
//       };
//     }

//     // Create object with updated fields
//     const updatedFields = {
//       service_name,
//       title,
//       subtitle,
//       description,
//       metaTitle,
//       metaDescription,
//     };

//     // Update the URL based on the updated name
//     const urlSlug = service_name.toLowerCase().replace(/\s+/g, "-");
//     updatedFields.url = `http://localhost:8000/api/service/${urlSlug}`;

//     // Add media data if provided
//     if (mediaData) {
//       updatedFields.media = mediaData;
//       updatedFields.type = mediaData.filename ? "image" : "video";
//     }

//     // Update career in the database
//     const updatedService = await serviceModel.findByIdAndUpdate(
//       req.params._id,
//       updatedFields,
//       { new: true }
//     );

//     return res.status(200).json({
//       message: "Service content updated successfully.",
//       updatedService,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: `Error in updating Service due to ${error.message}`,
//     });
//   }
// };

const updateService = async (req, res) => {
  try {
    const {
      service_name,
      title,
      subtitle,
      description,
      metaTitle,
      metaDescription,
      media,
    } = req.body;

    // Fetch the existing service to retain current media values if not updated
    const existingService = await serviceModel.findById(req.params._id);
    if (!existingService) {
      return res.status(404).json({ message: "Service not found." });
    }

    let mediaData = {
      filename: existingService.media.filename,
      filepath: existingService.media.filepath,
      iframe: existingService.media.iframe,
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
    }

    // Create object with updated fields
    const updatedFields = {
      ...(service_name && { service_name }),
      ...(title && { title }),
      ...(subtitle && { subtitle }),
      ...(description && { description }),
      ...(metaTitle && { metaTitle }),
      ...(metaDescription && { metaDescription }),
      media: mediaData,
      type: mediaData.filename ? "image" : "video",
    };

    // Update the URL based on the updated name
    if (service_name) {
      const urlSlug = service_name.toLowerCase().replace(/\s+/g, "-");
      updatedFields.url = `http://localhost:8000/api/service/${urlSlug}`;
    }

    // Update service in the database by ID
    const updatedService = await serviceModel.findByIdAndUpdate(
      req.params._id,
      updatedFields,
      { new: true }
    );

    return res.status(200).json({
      message: "Service content updated successfully.",
      updatedService,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in updating Service due to ${error.message}`,
    });
  }
};

const getByServiceName = async (req, res) => {
  const { service_name } = req.query;
  try {
    const serviceName = service_name.toUpperCase();
    const service = await serviceModel.findOne({ service_name: serviceName });

    if (!service) {
      return res.status(400).json({
        message: "No service found with the provided service name.",
      });
    }

    return res.status(200).json({
      message: "Service fetched successfully.",
      service,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in fetching service due to ${error.message}`,
    });
  }
};

const getService = async (req, res) => {
  try {
    const service = await serviceModel.findById(req.params._id);

    if (service.length === 0) {
      return res.status(400).json({
        message: "No services are created. Kindly create one.",
      });
    }
    return res.status(200).json({
      message: "Service fetched successfully.",
      service,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in fetching service due to ${error.message}`,
    });
  }
};

const getServices = async (req, res) => {
  try {
    const services = await serviceModel.find();

    if (services.length === 0) {
      return res.status(400).json({
        message: "No services are created. Kindly create one.",
      });
    }
    return res.status(200).json({
      message: "All services fetched successfully.",
      count: services.length,
      services,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in fetching services due to ${error.message}`,
    });
  }
};

const deleteService = async (req, res) => {
  try {
    const serviceExists = await serviceModel.findById({
      _id: req.params._id,
    });

    if (serviceExists.length === 0) {
      return res.status(400).json({
        message: "No services are created. Kindly create one.",
      });
    }

    const deletedService = await serviceModel.findOneAndDelete({
      _id: req.params._id,
    });

    return res.status(200).json({
      message: "Service deleted successfully.",
      deletedService,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in deleting service due to ${error.message}`,
    });
  }
};

module.exports = {
  createService,
  updateService,
  getByServiceName,
  getService,
  getServices,
  deleteService,
};

const galleryModel = require("../models/galleryModel");
const path = require("path");
const galleryNameModel = require("../models/gallerynameModel");

const createGallery = async (req, res) => {
  try {
    const { service_name, gallery_name, isPublic = true, media } = req.body;

    let mediaData = {};
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

    const newGallery = new galleryModel({
      service_name,
      gallery_name,
      type: fileType,
      media: mediaData,
      isPublic,
    });

    await newGallery.save();

    return res.status(200).json({
      message: "Added Gallery content sucessfully.",
      newGallery,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in adding Gallery due to ${error.message}`,
    });
  }
};

const updateGallery = async (req, res) => {
  try {
    const { service_name, gallery_name, isPublic, media } = req.body;
    // Fetch the existing service to retain current media values if not updated
    const existingGallery = await galleryModel.findById(req.params._id);
    if (!existingGallery) {
      return res.status(404).json({ message: "Service not found." });
    }

    let mediaData = {
      filename: existingGallery.media.filename,
      filepath: existingGallery.media.filepath,
      iframe: existingGallery.media.iframe,
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
      ...(gallery_name && { gallery_name }),
      isPublic,
      media: mediaData,
      type: mediaData.filename ? "image" : "video",
    };

    const updatedGallery = await galleryModel.findByIdAndUpdate(
      req.params._id,
      updatedFields,
      { new: true }
    );

    return res.status(200).json({
      message: "Gallery content updated successfully.",
      updatedGallery,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in updating Gallery due to ${error.message}`,
    });
  }
};

const getGallery = async (req, res) => {
  try {
    const gallery = await galleryModel.findById(req.params._id);

    if (gallery.length === 0) {
      return res.status(400).json({
        message: "No gallery is created. Kindly create one.",
      });
    }
    return res.status(200).json({
      message: "Gallery fetched successfully.",
      gallery,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in fetching gallery due to ${error.message}`,
    });
  }
};

const getGalleries = async (req, res) => {
  try {
    const galleries = await galleryModel.find();

    if (galleries.length === 0) {
      return res.status(400).json({
        message: "No galleries are created. Kindly create one.",
      });
    }
    return res.status(200).json({
      message: "All galleries fetched successfully.",
      count: galleries.length,
      galleries,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in fetching galleries due to ${error.message}`,
    });
  }
};

const getMediaByGalleryNames = async (req, res) => {
  try {
    const { service_name, gallery_name } = req.query;

    // Check if the service_name name and gallery name are provided
    if (!service_name || !gallery_name) {
      return res.status(400).json({
        message: "Please provide both service name and gallery name.",
      });
    }

    // Fetch media for all gallery names
    if (gallery_name === "all") {
      const galleries = await galleryModel.find({ service_name });
      const media = galleries.map((gallery) => gallery.media);
      return res.status(200).json({
        message: "Gallery media fetched successfully.",
        media,
      });
    }

    // Find the gallery with the specified service_name and gallery name
    const gallery = await galleryModel.find({ service_name, gallery_name });

    // Check if the gallery exists
    if (gallery.length === 0) {
      return res.status(404).json({
        message: "Gallery not found.",
      });
    }

    // Extract media from the gallery
    const media = gallery.map((gallery) => gallery.media).flat();

    return res.status(200).json({
      message: "Gallery media fetched successfully.",
      media,
    });
  } catch (error) {
    console.error("Error fetching gallery media:", error);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

const deleteGallery = async (req, res) => {
  try {
    const galleryExists = await galleryModel.findById({
      _id: req.params._id,
    });

    if (galleryExists.length === 0) {
      return res.status(400).json({
        message: "No gallery are created. Kindly create one.",
      });
    }

    const deletedGallery = await galleryModel.findOneAndDelete({
      _id: req.params._id,
    });

    return res.status(200).json({
      message: "Gallery deleted successfully.",
      deletedGallery,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in deleting gallery due to ${error.message}`,
    });
  }
};

module.exports = {
  createGallery,
  updateGallery,
  getGallery,
  getGalleries,
  deleteGallery,
  getMediaByGalleryNames,
  // getGalleryNamesByservice_name,
};

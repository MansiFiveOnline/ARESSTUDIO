const galleryNameModel = require("../models/gallerynameModel");
const projectModel = require("../models/projectModel");

const createGalleryName = async (req, res) => {
  try {
    const { service_name, gallery_name } = req.body;

    if (!service_name || !gallery_name) {
      return res.status(400).json({
        message: "Service name and gallery name are required.",
      });
    }
    const newGalleryName = new galleryNameModel({
      service_name,
      gallery_name,
    });

    await newGalleryName.save();

    return res.status(200).json({
      message: "Added Gallery name content sucessfully.",
      newGalleryName,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in creating gallery name due to ${error.message}`,
    });
  }
};

const updateGalleryName = async (req, res) => {
  try {
    const { service_name, gallery_name } = req.body;
    // let image = req.body.image;

    const updatedGalleryName = await galleryNameModel.findByIdAndUpdate(
      req.params._id,
      {
        service_name,
        gallery_name,
      },
      { new: true }
    );

    // Update project name in the Project Details model by project_id
    const updatedProjects = await projectModel.updateMany(
      { gallery_name_id: updatedGalleryName._id },
      { $set: { gallery_name } },
      { new: true }
    );

    // Step 2: Update project_name for all entries with the same project_id
    // const updateManyResult = await projectDetailsModel.updateMany(
    //   { project_id: existingProjectDetail.project_id },
    //   { $set: { project_name: project.project_name } }
    // );

    return res.status(200).json({
      message: "Gallery name content updated successfully.",
      updatedGalleryName,
      updatedProjects,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in updating Gallery name due to ${error.message}`,
    });
  }
};

const getGalleryName = async (req, res) => {
  try {
    const galleryName = await galleryNameModel.findById(req.params._id);

    if (galleryName.length === 0) {
      return res.status(400).json({
        message: "No gallery names are created. Kindly create one.",
      });
    }
    return res.status(200).json({
      message: "gallery Name fetched successfully.",
      galleryName,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in fetching galleryName due to ${error.message}`,
    });
  }
};

const getGalleryNamesByService = async (req, res) => {
  try {
    const { service_name } = req.query;

    console.log(req.query);

    // Check if the service_name name is provided
    if (!service_name) {
      return res.status(400).json({
        message: "Please provide a service name.",
      });
    }

    // Find all galleries with the specified service_name name
    const galleries = await galleryNameModel.find({ service_name });

    // Check if galleries with the specified service_name name exist
    if (galleries.length === 0) {
      return res.status(400).json({
        message: `No galleries found for the service name: ${service_name}.`,
      });
    }

    // Extract gallery names from the found galleries
    const galleryNames = galleries.map((gallery) => gallery.gallery_name);

    // Return the gallery names for the specified service_name
    return res.status(200).json({
      message: `Gallery names fetched successfully for service name: ${service_name}.`,
      galleryNames,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in fetching gallery names due to ${error.message}`,
    });
  }
};

const getGalleryNames = async (req, res) => {
  try {
    const galleryNames = await galleryNameModel.find();

    if (galleryNames.length === 0) {
      return res.status(400).json({
        message: "No gallery names are created. Kindly create one.",
      });
    }
    return res.status(200).json({
      message: "All gallery names fetched successfully.",
      count: galleryNames.length,
      galleryNames,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in fetching gallery names due to ${error.message}`,
    });
  }
};

const deleteGalleryName = async (req, res) => {
  try {
    const galleryNameExists = await galleryNameModel.findById({
      _id: req.params._id,
    });

    if (galleryNameExists.length === 0) {
      return res.status(400).json({
        message: "No gallery names are created. Kindly create one.",
      });
    }

    const deletedGalleryName = await galleryNameModel.findOneAndDelete({
      _id: req.params._id,
    });

    await projectModel.deleteMany({ gallery_name_id: deletedGalleryName._id });

    return res.status(200).json({
      message: "gallery Name deleted successfully.",
      deletedGalleryName,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in deleting gallery Name due to ${error.message}`,
    });
  }
};

module.exports = {
  createGalleryName,
  updateGalleryName,
  getGalleryName,
  getGalleryNames,
  getGalleryNamesByService,
  deleteGalleryName,
};

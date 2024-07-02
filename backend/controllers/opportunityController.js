const opportunityModel = require("../models/opportunityModel");

const createOpportunity = async (req, res) => {
  try {
    const { title, description, responsibility, qualification } = req.body;

    const newOpportunity = new opportunityModel({
      title,
      description,
      responsibility,
      qualification,
    });

    await newOpportunity.save();

    return res.status(200).json({
      message: "Added Opportunity content successfully.",
      newOpportunity: {
        title: newOpportunity.title,
        description: newOpportunity.description,
        responsibility: newOpportunity.responsibility,
        qualification: newOpportunity.qualification,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in adding Opportunity due to ${error.message}`,
    });
  }
};

const updateOpportunity = async (req, res) => {
  try {
    const { title, description, responsibility, qualification } = req.body;

    const updatedOpportunity = await opportunityModel.findByIdAndUpdate(
      req.params._id,
      {
        title,
        description,
        responsibility,
        qualification,
      },
      { new: true } // This ensures the updated document is returned
    );

    if (!updatedOpportunity) {
      return res.status(404).json({
        message: "Opportunity not found.",
      });
    }

    return res.status(200).json({
      message: "Opportunity content updated successfully.",
      updatedOpportunity,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in updating Opportunity due to ${error.message}`,
    });
  }
};

const getOpportunity = async (req, res) => {
  try {
    const opportunity = await opportunityModel.findById(req.params._id);

    if (opportunity.length === 0) {
      return res.status(400).json({
        message: "No opportunities are created. Kindly create one.",
      });
    }
    return res.status(200).json({
      message: "Opportunity fetched successfully.",

      opportunity,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in fetching opportunity due to ${error.message}`,
    });
  }
};

const getOpportunities = async (req, res) => {
  try {
    const opportunities = await opportunityModel.find();

    if (opportunities.length === 0) {
      return res.status(400).json({
        message: "No opportunities are created. Kindly create one.",
      });
    }
    return res.status(200).json({
      message: "All opportunities fetched successfully.",
      count: opportunities.length,
      opportunities,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in fetching opportunities due to ${error.message}`,
    });
  }
};

const getOpportunityTitle = async (req, res) => {
  try {
    const titles = await opportunityModel.find({}, "title"); // Fetch only the 'title' field

    if (titles.length === 0) {
      return res.status(400).json({
        message: `No titles found.`,
      });
    }

    // Extract only the project names
    const titleList = titles.map((title) => title.title);

    res.status(200).json({
      message: "Opportunity Title fetched successfully.",
      opportunityTitles: titleList,
    });
  } catch (error) {
    console.error("Error fetching opportunity titles:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteOpportunity = async (req, res) => {
  try {
    const opportunityExists = await opportunityModel.findById({
      _id: req.params._id,
    });

    if (opportunityExists.length === 0) {
      return res.status(400).json({
        message: "No opportunities are created. Kindly create one.",
      });
    }

    const deletedOpportunity = await opportunityModel.findOneAndDelete({
      _id: req.params._id,
    });

    return res.status(200).json({
      message: "Opportunity deleted successfully.",
      deletedOpportunity,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in deleting Opportunity due to ${error.message}`,
    });
  }
};

module.exports = {
  createOpportunity,
  updateOpportunity,
  getOpportunityTitle,
  getOpportunity,
  getOpportunities,
  deleteOpportunity,
};

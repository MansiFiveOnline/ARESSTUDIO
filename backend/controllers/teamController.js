const teamModel = require("../models/teamModel");
const path = require("path");

const createTeam = async (req, res) => {
  try {
    const { name, designation, linkedin_url } = req.body;

    // const newName = name.toLowerCase().replace(/ /g, "");

    const teamExists = await teamModel.findOne({ name });

    if (teamExists) {
      return res.status(400).json({
        message: "This team already exists. Try adding team with another name",
      });
    }

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

      // If a new image file is uploaded, update the image
      image = {
        filename: req.file.originalname,
        filepath: req.file.path,
      };
    }

    // Get the total number of existing teams
    const totalteams = await teamModel.countDocuments();

    const newTeam = new teamModel({
      name,
      designation,
      linkedin_url,
      image,
      sequence: totalteams + 1, // Assign a sequence value based on the total number of existing teams
    });

    await newTeam.save();

    res.status(200).json({
      message: "team created successfully.",
      newTeam,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in adding team due to ${error.message}`,
    });
  }
};

const updateTeam = async (req, res) => {
  try {
    const { name, designation, linkedin_url, sequence } = req.body;
    let image;

    if (req.file) {
      const isWebPImage = (file) => {
        const extname = path.extname(file.originalname).toLowerCase();
        return extname === ".webp";
      };

      if (!isWebPImage(req.file)) {
        return res.status(400).json({
          message: "Unsupported file type. Please upload a WebP image.",
        });
      }

      image = {
        filename: req.file.originalname,
        filepath: req.file.path,
      };
    } else if (req.body.existingImage) {
      image = {
        filename: path.basename(req.body.existingImage),
        filepath: req.body.existingImage,
      };
    }

    const team = await teamModel.findById(req.params._id);

    if (!team) {
      return res.status(400).json({
        message: "No team found to update.",
      });
    }

    team.name = name;
    team.designation = designation;
    team.linkedin_url = linkedin_url;
    team.image = image ? [image] : team.image;
    team.sequence = sequence;

    await team.save();

    const updatedFields = {
      name,
      designation,
      linkedin_url,
      image: team.image,
      sequence,
    };

    return res.status(200).json({
      message: "Team updated successfully.",
      updatedFields,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in updating team due to ${error.message}`,
    });
  }
};

const getTeam = async (req, res) => {
  //   try {
  //     const team = await teamModel.findById(
  //     //   {
  //     //   _id: req.params._id
  //     // }
  //     req.params._id
  //     );

  //     // console.log(req.params._id)
  //     if (!team) {
  //       return res.status(400).json({
  //         message: "No team is created with this id. ",
  //       });
  //     }

  //     return res.status(200).json({
  //       message: "team fetched successfully.",
  //       team,
  //     });
  //   } catch (error) {
  //     return res.status(500).json({
  //       message: `Error in fetching team due to ${error.message}`,
  //     });
  //   }

  try {
    const team = await teamModel.findById(req.params._id);
    console.log(req.params._id);
    if (!team) {
      return res.status(400).json({
        message: "No team is created with this id.",
      });
    }

    return res.status(200).json({
      message: "team fetched successfully.",
      team,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in fetching team due to ${error.message}`,
    });
  }
};

const getTeams = async (req, res) => {
  try {
    const teams = await teamModel.find().sort({ sequence: 1 });
    // console.log(teams)

    if (teams.length === 0) {
      return res.status(400).json({
        message: "No teams are created. Kindly create one.",
      });
    }

    return res.status(200).json({
      message: "All team fetched successfully.",
      count: teams.length,
      teams,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in fetching teams due to ${error.message}`,
    });
  }
};

const deleteTeam = async (req, res) => {
  try {
    const teamExists = await teamModel.findById({
      _id: req.params._id,
    });

    if (teamExists.length === 0) {
      return res.status(400).json({
        message: "No teams are created. Kindly create one.",
      });
    }

    const deleteteam = await teamModel.findOneAndDelete({
      _id: req.params._id,
    });

    return res.status(200).json({
      message: "team deleted successfully.",
      deleteteam,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in deleting team due to ${error.message}`,
    });
  }
};

// const sequenceteam = async (req, res) => {
//   try {
//     const teamName = req.params.name;
//     const newSequence = req.body.sequence;

//     // Find the team by name
//     const team = await teamModel.findOne({ name: teamName });

//     // Check if the team exists
//     if (!team) {
//       return res.status(400).json({
//         message: "team not found.",
//       });
//     }

//     // Get the current sequence of the team
//     const currentSequence = team.sequence;

//     // Update the sequence field of the team
//     team.sequence = newSequence;

//     // Save the updated team
//     await team.save();

//     // Update the sequence of other teams if necessary
//     if (currentSequence !== newSequence) {
//       const otherteams = await teamModel.find({ name: { $ne: teamName } });
//       for (const otherteam of otherteams) {
//         if (otherteam.sequence === newSequence) {
//           otherteam.sequence = currentSequence;
//           await otherteam.save();
//         }
//       }
//     }

//     // Sort teams by sequence field
//     const sortedteams = await teamModel.find().sort({ sequence: 1 });

//     return res.status(200).json({
//       message: "team sequenced successfully.",
//       teams: sortedteams,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: `Error in sequencing team due to ${error.message}`,
//     });
//   }
// };

const sequenceTeam = async (req, res) => {
  try {
    const teamId = req.params.id; // Changed to ID instead of name
    const newSequence = parseInt(req.body.sequence, 10);

    if (isNaN(newSequence)) {
      return res.status(400).json({
        message: "Invalid sequence value.",
      });
    }

    const team = await teamModel.findById(teamId);

    if (!team) {
      return res.status(400).json({
        message: "Team not found.",
      });
    }

    const currentSequence = team.sequence;

    if (currentSequence === newSequence) {
      return res.status(200).json({
        message: "Team already has the desired sequence.",
        teams: await teamModel.find().sort({ sequence: 1 }),
      });
    }

    const increment = currentSequence < newSequence ? -1 : 1;
    const start = Math.min(currentSequence, newSequence);
    const end = Math.max(currentSequence, newSequence);

    await teamModel.updateMany(
      {
        sequence: { $gte: start, $lte: end },
        _id: { $ne: team._id },
      },
      { $inc: { sequence: increment } }
    );

    team.sequence = newSequence;
    await team.save();

    const sortedTeams = await teamModel.find().sort({ sequence: 1 });

    return res.status(200).json({
      message: "Team sequenced successfully.",
      teams: sortedTeams,
    });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({
      message: `Error in sequencing team due to ${error.message}`,
    });
  }
};

module.exports = {
  createTeam,
  updateTeam,
  getTeam,
  getTeams,
  deleteTeam,
  sequenceTeam,
};

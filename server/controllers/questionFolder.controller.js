import QuestionFolder from "../models/QuestionFolder.js";
import QuestionBank from "../models/QuestionBank.js";

export const createFolder = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Folder name is required",
      });
    }

    const existingFolder =
      await QuestionFolder.findOne({
        name: name.trim(),
      });

    if (existingFolder) {
      return res.status(400).json({
        success: false,
        message: "Folder already exists",
      });
    }

    const folder =
      await QuestionFolder.create({
        name: name.trim(),
      });

    res.status(201).json({
      success: true,
      folder,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to create folder",
    });
  }
};

export const getFolders = async (req, res) => {
  try {
    const folders =
      await QuestionFolder.find().sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      folders,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch folders",
    });
  }
};

export const updateFolder = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const folder =
      await QuestionFolder.findByIdAndUpdate(
        id,
        {
          name: name.trim(),
        },
        {
          new: true,
        }
      );

    if (!folder) {
      return res.status(404).json({
        success: false,
        message: "Folder not found",
      });
    }

    res.status(200).json({
      success: true,
      folder,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to update folder",
    });
  }
};

export const deleteFolder = async (req, res) => {
  try {
    const { id } = req.params;

    const folder = await QuestionFolder.findById(id);

    if (!folder) {
      return res.status(404).json({
        success: false,
        message: "Folder not found",
      });
    }

    // Delete all questions inside this folder
    await QuestionBank.deleteMany({
      folderId: id,
    });

    // Delete folder
    await QuestionFolder.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Folder and all associated questions deleted",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete folder",
    });
  }
};
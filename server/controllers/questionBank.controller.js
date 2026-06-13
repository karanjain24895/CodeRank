import QuestionBank from "../models/QuestionBank.js";

export const createQuestion = async (
  req,
  res
) => {
  try {
    const {
      folderId,
      questionName,
      questionLink,
      description,
      marks,
    } = req.body;

    const question =
      await QuestionBank.create({
        folderId,
        questionName,
        questionLink,
        description,
        marks,
      });

    res.status(201).json({
      success: true,
      question,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to create question",
    });
  }
};

export const getQuestionsByFolder =
  async (req, res) => {
    try {
      const { folderId } = req.params;

      const questions =
        await QuestionBank.find({
          folderId,
        }).sort({
          createdAt: -1,
        });

      res.status(200).json({
        success: true,
        questions,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch questions",
      });
    }
  };

export const updateQuestion = async (
  req,
  res
) => {
  try {
    const { id } =
      req.params;

    const {
      questionName,
      questionLink,
      description,
      marks,
    } = req.body;

    const question =
      await QuestionBank.findByIdAndUpdate(
        id,
        {
          questionName,
          questionLink,
          description,
          marks,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!question) {
      return res
        .status(404)
        .json({
          success: false,
          message:
            "Question not found",
        });
    }

    res.status(200).json({
      success: true,
      message:
        "Question updated successfully",
      question,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to update question",
    });
  }
};
export const deleteQuestion =
  async (req, res) => {
    try {
      const { id } = req.params;

      const question =
        await QuestionBank.findByIdAndDelete(
          id
        );

      if (!question) {
        return res.status(404).json({
          success: false,
          message:
            "Question not found",
        });
      }

      res.status(200).json({
        success: true,
        message:
          "Question deleted",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to delete question",
      });
    }
  };
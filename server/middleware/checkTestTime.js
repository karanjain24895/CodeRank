import Submission from "../models/Submission.js";
export const checkTestTime = async (req, res, next) => {
  const submission = await Submission.findById(req.params.submissionId);

  if (!submission) {
    return res.status(404).json({ message: "Submission not found" });
  }

  if (submission.isFinished) return next();

  if (new Date() > submission.endTime) {
    submission.isFinished = true;
    submission.submittedAt = new Date();
    submission.status = "evaluated";
    await submission.save();

    return res.status(403).json({
      message: "Time is over. Test auto-submitted",
    });
  }

  next();
};
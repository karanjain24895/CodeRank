import dotenv from "dotenv";
import mongoose from "mongoose";

import QuestionBank from "../models/QuestionBank.js";
import QuestionFolder from "../models/QuestionFolder.js";
import Test from "../models/Test.js";

dotenv.config();

const FOLDER_NAME = process.argv.slice(2).join(" ") || "Recursion";

const normalize = (value) => value?.trim() || "";

const main = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing");
  }

  await mongoose.connect(process.env.MONGO_URI);

  const escapedFolderName = FOLDER_NAME.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
  const exactNamePattern = new RegExp(`^${escapedFolderName}$`, "i");

  const sourceTest = await Test.findOne({
    $or: [
      { topicName: exactNamePattern },
      { testName: exactNamePattern },
    ],
  })
    .sort({ createdAt: -1 })
    .lean();

  if (!sourceTest) {
    throw new Error(`No ${FOLDER_NAME} test found`);
  }

  const sourceQuestions = sourceTest.questions || [];

  if (!sourceQuestions.length) {
    throw new Error(`${FOLDER_NAME} test has no embedded questions`);
  }

  const folder = await QuestionFolder.findOneAndUpdate(
    { name: FOLDER_NAME },
    { $setOnInsert: { name: FOLDER_NAME } },
    { returnDocument: "after", upsert: true }
  );

  let insertedCount = 0;
  let skippedCount = 0;

  for (const question of sourceQuestions) {
    const questionName = normalize(question.questionName);
    const questionLink = normalize(question.questionLink);

    if (!questionName || !questionLink) {
      skippedCount += 1;
      continue;
    }

    const existingQuestion = await QuestionBank.findOne({
      folderId: folder._id,
      $or: [{ questionLink }, { questionName }],
    });

    if (existingQuestion) {
      skippedCount += 1;
      continue;
    }

    await QuestionBank.create({
      folderId: folder._id,
      questionName,
      questionLink,
      description: question.description || "",
      marks: Number(question.marks || 1),
    });

    insertedCount += 1;
  }

  const finalCount = await QuestionBank.countDocuments({
    folderId: folder._id,
  });

  console.log(
    JSON.stringify(
      {
        testId: sourceTest._id,
        testName: sourceTest.testName,
        topicName: sourceTest.topicName,
        sourceQuestionCount: sourceQuestions.length,
        folderId: folder._id,
        folderName: folder.name,
        insertedCount,
        skippedCount,
        finalFolderQuestionCount: finalCount,
      },
      null,
      2
    )
  );
};

main()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });

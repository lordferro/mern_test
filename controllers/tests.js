const { ctrlWrapper, HttpError } = require("../helpers");
const { Test, User } = require("../models");

const getTests = async (req, res) => {
  const data = await Test.find();

  res.json(data);
};

const getById = async (req, res) => {
  const { id } = req.params;

  const test = await Test.findById(id);
  if (!test) {
    throw HttpError(404, "not found");
  }

  res.json(test);
};

const addTest = async (req, res) => {
  const { _id } = req.user;
  const data = await Test.create({ ...req.body, owner: _id });

  await User.findByIdAndUpdate(_id, { $push: { myTests: data._id } });

  res.status(201).json(data);
};

const writePassedTest = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const { score } = req.body;

  await User.findByIdAndUpdate(userId, {
    $push: { passedTests: [{ test: id, score }] },
  });

  res.json("Results written.");
};

const getResults = async (req, res) => {
  const { myTests } = req.user;

  const data = await User.find(
    {
      passedTests: {
        $elemMatch: {
          test: { $in: myTests },
        },
      },
    },
    "-password -token -myTests"
  ).populate("passedTests.test");

  res.json(data);
};

module.exports = {
  getTests: ctrlWrapper(getTests),
  getById: ctrlWrapper(getById),
  addTest: ctrlWrapper(addTest),
  writePassedTest: ctrlWrapper(writePassedTest),
  getResults: ctrlWrapper(getResults),
};

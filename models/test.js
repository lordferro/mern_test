const { Schema, Types, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../helpers");

const testSchema = new Schema(
  {
    title: {
      type: String,
      minLength: 1,
      required: [true, "Name your test"],
    },
    description: {
      type: String,
      minLength: 1,
      required: [true, "Describe your test"],
      default: null,
    },
    questions: [
      {
        question: { type: String, required: [true, "Test question"] },
        answers: [
          {
            variant: {
              type: String,
              required: [true, "Give at least two variants"],
            },
            correct: {
              type: Boolean,
              required: [true, "Is it correct answer?"],
            },
            _id: false,
          },
        ],
        _id: false,
      },
    ],
    owner: {
      type: Types.ObjectId,
      ref: "user",
      required: [true, "Test must have an author"],
    },
  },
  { timestamps: true, versionKey: false }
);

testSchema.post("save", handleMongooseError);

const joiQuestionSchema = {
  question: Joi.string().required(),
  answers: Joi.array().min(2).items({
    variant: Joi.string().required(),
    correct: Joi.boolean().required(),
  }),
};

const joiTestSchema = Joi.object({
  description: Joi.string().min(1),
  title: Joi.string().min(1),
  questions: Joi.array().min(1).items(joiQuestionSchema),
});



const Test = model("test", testSchema);

module.exports = { Test, joiTestSchema };

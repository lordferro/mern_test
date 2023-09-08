const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError } = require("../helpers");

//  "example@example.com"
// eslint-disable-next-line no-useless-escape
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
// password = "Abc123"
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,16}$/;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    myTests: [{ type: Schema.Types.ObjectId, ref: "test" }],
    passedTests: [
      {
        test: { type: Schema.Types.ObjectId, ref: "test" },
        score: { type: Number },
        _id: false,
      },
    ],
    token: {
      type: String,
      default: "",
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(16).required(),
  email: Joi.string().pattern(emailRegex).required().messages({
    "string.pattern.base": "email should looks like: example@example.com",
  }),
  password: Joi.string().pattern(passwordRegex).required().messages({
    "string.pattern.base":
      "password shoud be: max 16, min 6; contain: one UpperCase letter, one LowerCase letter, one number",
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegex).required().messages({
    "string.pattern.base": "email should looks like: example@example.com",
  }),
  password: Joi.string().min(6).max(16).required(),
});

const joiTestScoreSchema = Joi.object({ score: Joi.number() });

const schemas = {
  registerSchema,
  loginSchema,
  joiTestScoreSchema,
};

const User = model("user", userSchema);

module.exports = {
  User,
  schemas,
};

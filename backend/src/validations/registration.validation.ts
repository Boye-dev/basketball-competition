import { RequestHandler } from "express";
import { Joi, validate } from "express-validation";

const registerTeamSchema = {
  body: Joi.object({
    teamName: Joi.string().min(2).required().messages({
      "string.empty": "Team name is required",
      "string.min": "Team name must be at least 2 characters",
    }),
    email: Joi.string().email().required().messages({
      "string.empty": "Email is required",
      "string.email": "Must be a valid email address",
    }),
    phoneNumber: Joi.string()
      .pattern(/^(\+234|0)(7[0-9]|8[0-9]|9[0-9])\d{8}$/)
      .required()
      .messages({
        "string.empty": "Phone number is required",
        "string.pattern.base":
          "Must be a valid Nigerian phone number (e.g. 08012345678 or +2348012345678)",
      }),
    players: Joi.string().required().messages({
      "string.empty": "Players data is required",
    }),
    threePointContest: Joi.string().required().messages({
      "string.empty": "3-Point Contest representative is required",
    }),
    freeThrowContest: Joi.string().required().messages({
      "string.empty": "Free Throw Contest representative is required",
    }),
  }),
};

export const registerTeamValidator = () => {
  return validate(
    registerTeamSchema,
    { context: true },
    { abortEarly: false },
  ) as unknown as RequestHandler;
};

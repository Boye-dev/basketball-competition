import { RequestHandler } from "express";
import { Joi, validate } from "express-validation";

const loginSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

const rejectSchema = {
  body: Joi.object({
    reason: Joi.string().optional().allow(""),
  }),
};

export const adminLoginValidator = () => {
  return validate(
    loginSchema,
    { context: true },
    { abortEarly: false },
  ) as unknown as RequestHandler;
};

export const rejectPaymentValidator = () => {
  return validate(
    rejectSchema,
    { context: true },
    { abortEarly: false },
  ) as unknown as RequestHandler;
};

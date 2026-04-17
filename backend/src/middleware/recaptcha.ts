import { Request, Response, NextFunction } from "express";
import axios from "axios";
import config from "../config";
import { BadRequestError } from "../utils/responseHandler";
import logger from "../utils/logger";

const RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
const SCORE_THRESHOLD = 0.5;

export const verifyRecaptcha = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const secretKey = config.recaptchaSecretKey;

  // Skip verification in development if no key is configured
  if (!secretKey) {
    logger.warn("reCAPTCHA secret key not configured — skipping verification");
    return next();
  }

  const token = req.body.recaptchaToken;

  if (!token) {
    return next(new BadRequestError("reCAPTCHA verification failed. Please try again."));
  }

  try {
    const { data } = await axios.post(
      RECAPTCHA_VERIFY_URL,
      null,
      {
        params: {
          secret: secretKey,
          response: token,
        },
      },
    );

    if (!data.success || data.score < SCORE_THRESHOLD) {
      logger.warn({ score: data.score, action: data.action }, "reCAPTCHA failed");
      return next(new BadRequestError("reCAPTCHA verification failed. Please try again."));
    }

    next();
  } catch (error) {
    logger.error(error, "reCAPTCHA verification error");
    return next(new BadRequestError("reCAPTCHA verification failed. Please try again."));
  }
};

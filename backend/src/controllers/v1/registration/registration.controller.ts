import { NextFunction, Request, Response } from "express";
import { registrationService } from "../../../services/v1/registration";

class RegistrationController {
  protected async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { body, file } = req;
      const data = await registrationService.registerTeam(body, file);
      res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  }
}

export default RegistrationController;

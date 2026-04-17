import { NextFunction, Request, Response } from "express";
import { adminService } from "../../../services/v1/admin";

class AdminController {
  protected async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const data = await adminService.login(email, password);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  protected async getAllRegistrations(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data = await adminService.getAllRegistrations();
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  protected async getRegistrationById(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const id = req.params.id as string;
      const data = await adminService.getRegistrationById(id);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  protected async confirmPayment(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const id = req.params.id as string;
      const data = await adminService.confirmPayment(id);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  protected async rejectPayment(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const id = req.params.id as string;
      const { reason } = req.body;
      const data = await adminService.rejectPayment(id, reason);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
}

export default AdminController;

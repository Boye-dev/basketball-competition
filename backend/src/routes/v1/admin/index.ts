import { Router } from "express";
import { AdminController } from "../../../controllers/v1/admin";
import authMiddleware from "../../../middleware/auth.middleware";
import {
  adminLoginValidator,
  rejectPaymentValidator,
} from "../../../validations/admin.validation";

class AdminRoutes extends AdminController {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.post("/login", adminLoginValidator(), this.login);

    this.router.get(
      "/registrations",
      authMiddleware.isAuthenticated,
      this.getAllRegistrations,
    );

    this.router.get(
      "/registrations/:id",
      authMiddleware.isAuthenticated,
      this.getRegistrationById,
    );

    this.router.patch(
      "/registrations/:id/confirm",
      authMiddleware.isAuthenticated,
      this.confirmPayment,
    );

    this.router.patch(
      "/registrations/:id/reject",
      authMiddleware.isAuthenticated,
      rejectPaymentValidator(),
      this.rejectPayment,
    );
  }
}

export default new AdminRoutes().router;

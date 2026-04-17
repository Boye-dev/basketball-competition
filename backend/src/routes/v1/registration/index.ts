import { Router } from "express";
import { RegistrationController } from "../../../controllers/v1/registration";
import upload, { ensureBody } from "../../../middleware/multer";
import { verifyRecaptcha } from "../../../middleware/recaptcha";
import { registerTeamValidator } from "../../../validations/registration.validation";

class RegistrationRoutes extends RegistrationController {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.post(
      "/",
      upload.single("paymentProof"),
      ensureBody,
      verifyRecaptcha,
      registerTeamValidator(),
      this.register,
    );
  }
}

export default new RegistrationRoutes().router;

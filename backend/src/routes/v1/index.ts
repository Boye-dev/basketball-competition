import { Router } from "express";
import registrationRouter from "./registration";
import adminRouter from "./admin";
import config from "../../config";

class V1Routes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.get("/", (req, res) => {
      res.status(200).json({
        message: "Welcome to Basketball Competition API.",
        data: {
          service: config.node.service,
          environment: config.node.env,
        },
      });
    });
    this.router.use("/registration", registrationRouter);
    this.router.use("/admin", adminRouter);
  }
}

export default new V1Routes().router;

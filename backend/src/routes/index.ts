import { Router } from "express";
import v1Routes from "./v1";

class Routes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.use("/api/v1", v1Routes);
  }
}

export default new Routes().router;

import { IAdminDecoded } from "../../middleware/auth.middleware";

declare global {
  namespace Express {
    interface Request {
      admin?: IAdminDecoded;
    }
  }
}

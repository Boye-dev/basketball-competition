import { NextFunction, Request, Response } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import { UnauthorizedError } from "../utils/responseHandler";
import config from "../config";

export interface IAdminDecoded extends JwtPayload {
  id: string;
  email: string;
}

class AuthMiddleware {
  public async isAuthenticated(
    req: Request,
    _res: Response,
    next: NextFunction,
  ) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new UnauthorizedError("Unauthorized");
      }

      const token = authHeader.slice("Bearer ".length).trim();

      if (!token) {
        throw new UnauthorizedError("Unauthorized");
      }

      let decoded: IAdminDecoded;
      try {
        decoded = verify(token, config.jwtSecret) as IAdminDecoded;
      } catch (_error) {
        throw new UnauthorizedError("Unauthorized");
      }

      const now = Date.now();
      if (decoded.exp && decoded.exp * 1000 < now) {
        throw new UnauthorizedError("Token expired");
      }

      req.admin = decoded;
      next();
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthMiddleware();

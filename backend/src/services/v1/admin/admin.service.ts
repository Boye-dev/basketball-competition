import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Admin, Team } from "../../../db/models";
import { IAdminDocument } from "../../../interfaces/admin.interface";
import { ITeamDocument } from "../../../interfaces/team.interface";
import { mailService } from "../../nodemailer";
import {
  ApiResponse,
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../../../utils/responseHandler";
import BaseService from "../../base.service";
import config from "../../../config";

class AdminService extends BaseService<IAdminDocument> {
  constructor() {
    super(Admin);
  }

  public async login(email: string, password: string) {
    const admin = await this.findOne({ email });

    if (!admin) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      config.jwtSecret,
      { expiresIn: "24h" },
    );

    return new ApiResponse("Login successful", 200, { token });
  }

  public async getAllRegistrations() {
    const teams = await Team.find()
      .sort({ createdAt: -1 })
      .exec();

    return new ApiResponse("Registrations retrieved", 200, teams);
  }

  public async getRegistrationById(id: string) {
    const team = await Team.findById(id).exec();

    if (!team) {
      throw new NotFoundError("Registration not found");
    }

    return new ApiResponse("Registration retrieved", 200, team);
  }

  public async confirmPayment(id: string) {
    const team = await Team.findById(id).exec();

    if (!team) {
      throw new NotFoundError("Registration not found");
    }

    if (team.status === "confirmed") {
      throw new BadRequestError("Payment already confirmed");
    }

    team.status = "confirmed";
    team.rejectionReason = "";
    await team.save();

    await mailService.sendRegistrationConfirmationEmail(
      team.teamName,
      team.email,
    );

    return new ApiResponse("Payment confirmed and email sent", 200, team);
  }

  public async rejectPayment(id: string, reason?: string) {
    const team = await Team.findById(id).exec();

    if (!team) {
      throw new NotFoundError("Registration not found");
    }

    if (team.status === "rejected") {
      throw new BadRequestError("Payment already rejected");
    }

    team.status = "rejected";
    team.rejectionReason = reason || "";
    await team.save();

    await mailService.sendRegistrationRejectionEmail(
      team.teamName,
      team.email,
      reason || "Payment could not be verified.",
    );

    return new ApiResponse("Payment rejected", 200, team);
  }
}

export default new AdminService();

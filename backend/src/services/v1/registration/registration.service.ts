import { Team } from "../../../db/models";
import { ITeamDocument } from "../../../interfaces/team.interface";
import { uploadService } from "../../upload";
import mailService from "../../nodemailer/mail.service";
import { ApiResponse, BadRequestError } from "../../../utils/responseHandler";
import BaseService from "../../base.service";

class RegistrationService extends BaseService<ITeamDocument> {
  constructor() {
    super(Team);
  }

  public async registerTeam(
    data: {
      teamName: string;
      email: string;
      phoneNumber: string;
      players: string;
      threePointContest: string;
      freeThrowContest: string;
    },
    file?: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestError("Payment proof is required");
    }

    const players = JSON.parse(data.players);

    if (players.length < 4 || players.length > 5) {
      throw new BadRequestError("Team must have between 4 and 5 players");
    }

    for (const player of players) {
      if (!player.fullName || !player.position) {
        throw new BadRequestError(
          "Each player must have a full name and position",
        );
      }
    }

    const playerNames = players.map((p: { fullName: string }) => p.fullName);

    if (!playerNames.includes(data.threePointContest)) {
      throw new BadRequestError(
        "3-Point Contest representative must be a registered player",
      );
    }

    if (!playerNames.includes(data.freeThrowContest)) {
      throw new BadRequestError(
        "Free Throw Contest representative must be a registered player",
      );
    }

    if (data.threePointContest === data.freeThrowContest) {
      throw new BadRequestError(
        "Contest representatives must be two different players",
      );
    }

    const uploadResult = await uploadService.uploadFile(file);

    const team = await this.create({
      teamName: data.teamName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      players,
      contestRepresentatives: {
        threePointContest: data.threePointContest,
        freeThrowContest: data.freeThrowContest,
      },
      paymentProof: uploadResult.secure_url,
      paymentProofPublicId: uploadResult.public_id,
      status: "pending",
    });

    // Send registration receipt to the team
    await mailService.sendRegistrationReceiptEmail(
      data.teamName,
      data.email,
      data.phoneNumber,
      players,
      data.threePointContest,
      data.freeThrowContest,
    );

    // Notify admin about the new registration
    await mailService.sendAdminNotificationEmail(
      data.teamName,
      data.email,
      data.phoneNumber,
      players,
      data.threePointContest,
      data.freeThrowContest,
    );

    return new ApiResponse(
      "Registration submitted. Awaiting payment confirmation.",
      201,
      { teamId: team._id, teamName: team.teamName },
    );
  }
}

export default new RegistrationService();

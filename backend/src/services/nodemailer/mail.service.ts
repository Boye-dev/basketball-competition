import { ApplicationError } from "../../utils/responseHandler";
import transporter from "./nodemailer";
import config from "../../config";

class MailService {
  public async sendRegistrationConfirmationEmail(
    teamName: string,
    email: string,
  ) {
    const mailOptions = {
      from: config.mail.user,
      to: email,
      template: "./registrationconfirmed",
      subject: "Basketball Competition - Registration Confirmed",
      context: {
        teamName,
      },
    };
    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      throw new ApplicationError("Error sending confirmation email");
    }
  }

  public async sendRegistrationRejectionEmail(
    teamName: string,
    email: string,
    reason: string,
  ) {
    const mailOptions = {
      from: config.mail.user,
      to: email,
      template: "./registrationrejected",
      subject: "Basketball Competition - Registration Update",
      context: {
        teamName,
        reason: reason || "Payment could not be verified.",
      },
    };
    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      throw new ApplicationError("Error sending rejection email");
    }
  }
  public async sendRegistrationReceiptEmail(
    teamName: string,
    email: string,
    phoneNumber: string,
    players: { fullName: string; position: string; phoneNumber?: string }[],
    threePointContest: string,
    freeThrowContest: string,
  ) {
    const mailOptions = {
      from: config.mail.user,
      to: email,
      template: "./registrationreceipt",
      subject: "Basketball Competition - Registration Received",
      context: {
        teamName,
        email,
        phoneNumber,
        players,
        threePointContest,
        freeThrowContest,
      },
    };
    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      throw new ApplicationError("Error sending registration receipt email");
    }
  }

  public async sendAdminNotificationEmail(
    teamName: string,
    email: string,
    phoneNumber: string,
    players: { fullName: string; position: string; phoneNumber?: string }[],
    threePointContest: string,
    freeThrowContest: string,
  ) {
    const adminEmail = config.mail.adminNotificationEmail;
    if (!adminEmail) return;

    const mailOptions = {
      from: config.mail.user,
      to: adminEmail,
      template: "./adminnotification",
      subject: `New Registration - ${teamName}`,
      context: {
        teamName,
        email,
        phoneNumber,
        players,
        playerCount: players.length,
        threePointContest,
        freeThrowContest,
        adminUrl: config.adminUrl,
      },
    };
    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      throw new ApplicationError("Error sending admin notification email");
    }
  }
}

export default new MailService();

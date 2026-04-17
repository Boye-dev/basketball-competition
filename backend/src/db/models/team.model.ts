import mongoose, { Schema } from "mongoose";
import { ITeamDocument } from "../../interfaces/team.interface";

const PlayerSchema = new Schema(
  {
    fullName: { type: String, required: true },
    position: { type: String, required: true },
    phoneNumber: { type: String, default: "" },
  },
  { _id: false },
);

const ContestRepresentativesSchema = new Schema(
  {
    threePointContest: { type: String, required: true },
    freeThrowContest: { type: String, required: true },
  },
  { _id: false },
);

const TeamSchema = new Schema<ITeamDocument>(
  {
    teamName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    players: {
      type: [PlayerSchema],
      validate: {
        validator: (v: unknown[]) => v.length >= 4 && v.length <= 5,
        message: "Team must have between 4 and 5 players",
      },
    },
    contestRepresentatives: {
      type: ContestRepresentativesSchema,
      required: true,
    },
    paymentProof: { type: String, required: true },
    paymentProofPublicId: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "rejected"],
      default: "pending",
    },
    rejectionReason: { type: String, default: "" },
  },
  { timestamps: true },
);

export const Team = mongoose.model<ITeamDocument>("Team", TeamSchema);

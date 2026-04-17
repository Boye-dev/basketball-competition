import { Document } from "mongoose";

export interface IPlayer {
  fullName: string;
  position: string;
  phoneNumber?: string;
}

export interface IContestRepresentatives {
  threePointContest: string;
  freeThrowContest: string;
}

export type RegistrationStatus = "pending" | "confirmed" | "rejected";

export interface ITeam {
  teamName: string;
  email: string;
  phoneNumber: string;
  players: IPlayer[];
  contestRepresentatives: IContestRepresentatives;
  paymentProof: string;
  paymentProofPublicId: string;
  status: RegistrationStatus;
  rejectionReason?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITeamDocument extends ITeam, Document {}

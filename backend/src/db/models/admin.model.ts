import mongoose, { Schema } from "mongoose";
import { IAdminDocument } from "../../interfaces/admin.interface";

const AdminSchema = new Schema<IAdminDocument>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true },
);

AdminSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const Admin = mongoose.model<IAdminDocument>("Admin", AdminSchema);

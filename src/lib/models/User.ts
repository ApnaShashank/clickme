import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  instagramUsername?: string;
  clickCount: number;
  avatarUrl: string;
  themeColor: string;
  customLink: string;
  resetPasswordToken?: string;
  resetPasswordExpiry?: Date;
  lastLogin?: Date;
  loginCount?: number;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  instagramUsername: { type: String, default: "" },
  clickCount: { type: Number, default: 0 },
  avatarUrl: { type: String, default: "" },
  themeColor: { type: String, default: "#FFAA00" },
  customLink: { type: String, default: "" },
  resetPasswordToken: { type: String },
  resetPasswordExpiry: { type: Date },
  lastLogin: { type: Date },
  loginCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;

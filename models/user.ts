import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  id: number;
  firstName: string;
  username: string;
  isPremium: boolean;
  isBot: boolean;
}

const userSchema = new Schema<IUser>({
  id: Number,
  firstName: String,
  username: String,
  isPremium: Boolean,
  isBot: Boolean,
});

const User = model<IUser>("User", userSchema);

export default User;

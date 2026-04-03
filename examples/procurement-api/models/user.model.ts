import { model, Schema } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const User = model<IUser>('User', userSchema);

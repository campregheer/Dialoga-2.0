import mongoose, { Document, Schema } from 'mongoose';

export type UserRole = 'jovem' | 'profissional' | 'admin';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  role: UserRole;
  profile: string; // Nome real para profissionais ou apelido anonimizado para jovens
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['jovem', 'profissional', 'admin'],
      default: 'jovem',
    },
    profile: {
      type: String,
      required: true,
      trim: true,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

// Oculta informações sensíveis ao converter para JSON
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete (ret as any).passwordHash;
    return ret;
  },
});

export const User = mongoose.model<IUser>('User', userSchema);

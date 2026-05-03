import mongoose, { Document, Schema } from 'mongoose';

export interface IReport extends Document {
  type: string;
  description: string;
  isAnonymous: boolean;
  profile?: string; // Pode estar ausente se a denúncia for 100% anônima ou não logada (no nosso caso, o autor existe, mas não o exibimos).
  email?: string; // Pode estar ausente se a denúncia for 100% anônima ou não logada (no nosso caso, o autor existe, mas não o exibimos).
  createdAt: Date;
  updatedAt: Date;
}

const reportSchema = new Schema<IReport>(
  {
    type: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    isAnonymous: {
      type: Boolean,
      default: true,
    },
    profile: {
      type: String,
      required: function(){
        return !this.isAnonymous;
      }
    },
    email: {
      type: String,
      required: function(){
        return !this.isAnonymous;
      }
    },
  },
  {
    timestamps: true,
  }
);

export const Report = mongoose.model<IReport>('Report', reportSchema);

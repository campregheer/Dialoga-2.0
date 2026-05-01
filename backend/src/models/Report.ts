import mongoose, { Document, Schema } from 'mongoose';

export interface IReport extends Document {
  type: string;
  description: string;
  isAnonymous: boolean;
  author?: mongoose.Types.ObjectId; // Pode estar ausente se a denúncia for 100% anônima ou não logada (no nosso caso, o autor existe, mas não o exibimos).
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
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

export const Report = mongoose.model<IReport>('Report', reportSchema);

import mongoose, { Document, Schema } from 'mongoose';

export interface IDiary extends Document {
  user: mongoose.Types.ObjectId;
  content: string;
  emotion?: string; // Ex: 'Feliz', 'Triste', 'Ansioso'
  createdAt: Date;
  updatedAt: Date;
}

const diarySchema = new Schema<IDiary>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true, // Útil para buscar todos os diários de um usuário rapidamente
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    emotion: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Diary = mongoose.model<IDiary>('Diary', diarySchema);

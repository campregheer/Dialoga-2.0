import mongoose, { Document, Schema } from 'mongoose';

export interface ILike extends Document {
  post: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
}

const likeSchema = new Schema<ILike>(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true, // O Mongoose vai criar updatedAt também, mas deixamos apenas para manter consistência
  }
);

// Garantir que um usuário só possa curtir o mesmo post uma única vez
likeSchema.index({ post: 1, user: 1 }, { unique: true });

export const Like = mongoose.model<ILike>('Like', likeSchema);

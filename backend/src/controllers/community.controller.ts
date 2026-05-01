import { Response } from 'express';
import mongoose from 'mongoose';
import { Post } from '../models/Post';
import { Like } from '../models/Like';
import { Comment } from '../models/Comment';
import { AuthRequest } from '../middlewares/auth.middleware';

export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { content } = req.body;

    if (!req.user) {
      res.status(401).json({ error: 'Não autorizado' });
      return;
    }

    const post = await Post.create({ author: req.user._id, content });
    await post.populate('author', 'profile role');
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar postagem' });
  }
};

export const getPosts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Não autorizado' });
      return;
    }

    const posts = await Post.find()
      .populate('author', 'profile role -_id')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    // Enriquecer cada post com contagem de likes e se o usuário atual curtiu
    const enrichedPosts = await Promise.all(
      posts.map(async (post) => {
        const [totalLikes, userLiked] = await Promise.all([
          Like.countDocuments({ post: post._id }),
          Like.exists({ post: post._id, user: req.user!._id }),
        ]);
        return { ...post, totalLikes, userLiked: !!userLiked };
      })
    );

    res.status(200).json(enrichedPosts);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar postagens' });
  }
};

export const toggleLike = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Não autorizado' });
      return;
    }

    const postId = new mongoose.Types.ObjectId(req.params.id as string);
    const userId = req.user._id;

    const existing = await Like.findOne({ post: postId, user: userId });

    if (existing) {
      await Like.deleteOne({ _id: existing._id });
    } else {
      await Like.create({ post: postId, user: userId });
    }

    const totalLikes = await Like.countDocuments({ post: postId });
    res.status(200).json({ liked: !existing, totalLikes });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao alternar curtida' });
  }
};

export const addComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Não autorizado' });
      return;
    }

    const postId = new mongoose.Types.ObjectId(req.params.id as string);
    const { content } = req.body;

    // Verifica se o post existe
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ error: 'Postagem não encontrada' });
      return;
    }

    const comment = await Comment.create({
      post: postId,
      author: req.user._id,
      content,
    });

    // Retorna o comentário já com o profile do autor (sem dados sensíveis)
    await comment.populate('author', 'profile role -_id');
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao comentar' });
  }
};

export const getComments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const postId = new mongoose.Types.ObjectId(req.params.id as string);

    const comments = await Comment.find({ post: postId })
      .populate('author', 'profile role -_id')
      .sort({ createdAt: 1 })
      .lean();

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar comentários' });
  }
};

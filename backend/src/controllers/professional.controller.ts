import { Response } from 'express';
import { Report } from '../models/Report';
import { Post } from '../models/Post';
import { User } from '../models/User';
import { AuthRequest } from '../middlewares/auth.middleware';

/**
 * Lista denúncias de forma COMPLETAMENTE anonimizada.
 * O campo `author` NUNCA é exposto — nem no select, nem por acidente.
 */
export const getReports = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = 15;
    const skip = (page - 1) * limit;

    const [reports, total] = await Promise.all([
      Report.find()
        .select('type description isAnonymous createdAt') // author NUNCA é incluído
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Report.countDocuments(),
    ]);

    res.status(200).json({
      reports,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar denúncias' });
  }
};

/**
 * Retorna estatísticas agregadas da plataforma.
 * Não expõe dados individuais de nenhum usuário.
 */
export const getStats = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [totalJovens, totalProfissionais, totalPosts, totalReports] = await Promise.all([
      User.countDocuments({ role: 'jovem' }),
      User.countDocuments({ role: 'profissional' }),
      Post.countDocuments(),
      Report.countDocuments(),
    ]);

    res.status(200).json({
      totalJovens,
      totalProfissionais,
      totalPosts,
      totalReports,
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
};

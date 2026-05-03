import { Response } from 'express';
import { Report } from '../models/Report';
import { AuthRequest } from '../middlewares/auth.middleware';

export const createReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Não autorizado' });
      return;
    }

    const { type, description, isAnonymous = true } = req.body;

    // Se isAnonymous for true, NÃO salvamos o author no banco.
    // Isso garante que NINGUÉM (nem admin) consegue rastrear quem fez a denúncia.
    const reportData: any = {
      type,
      description,
      isAnonymous,
    } 

    if (!isAnonymous) {
      reportData.profile = req.user.profile;
      reportData.email = req.user.email;
    }


    const report = await Report.create(reportData);

    res.status(201).json({
      message: 'Denúncia registrada com sucesso. Obrigado por contribuir com a segurança da plataforma.',
      id: report._id,
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar denúncia' });
  }
};

import { Response } from 'express';
import { Diary } from '../models/Diary';
import { AuthRequest } from '../middlewares/auth.middleware';

export const createEntry = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { content, emotion } = req.body;
    
    if (!req.user) {
      res.status(401).json({ error: 'Não autorizado' });
      return;
    }

    const diary = await Diary.create({
      user: req.user._id,
      content,
      emotion,
    });

    res.status(201).json(diary);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao salvar no diário' });
  }
};

export const getMyEntries = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Não autorizado' });
      return;
    }

    const entries = await Diary.find({ user: req.user._id }).sort({ createdAt: -1 });
    
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar anotações do diário' });
  }
};

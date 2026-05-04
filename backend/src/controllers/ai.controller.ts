import { Request, Response } from "express";
import { generateDiaryPrompt } from "../services/ai.service";

export const getDiarySuggestion = async (req: Request, res: Response) => {
  try {
    const phrase = await generateDiaryPrompt();
    res.json({ phrase });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao gerar frase" });
  }
};
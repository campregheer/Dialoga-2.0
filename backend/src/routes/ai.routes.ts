import { Router } from "express";
import { getDiarySuggestion } from "../controllers/ai.controller";

const router = Router();

router.get("/diary-suggestion", getDiarySuggestion);

export default router;

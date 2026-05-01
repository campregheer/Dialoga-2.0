import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

const app = express();

app.use(helmet());
app.use(cors({
  origin: 'https://dialoga-2-0.vercel.app',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

import authRoutes from './routes/auth.routes';
import diaryRoutes from './routes/diary.routes';
import communityRoutes from './routes/community.routes';
import reportRoutes from './routes/report.routes';
import professionalRoutes from './routes/professional.routes';

app.use('/api/auth', authRoutes);
app.use('/api/diary', diaryRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/professional', professionalRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

export default app;

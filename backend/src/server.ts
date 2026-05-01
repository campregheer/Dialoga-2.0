import app from './app';
import dotenv from 'dotenv';
import { connectDB } from './config/db';

console.log('🔹 Iniciando servidor...');

dotenv.config();

const PORT = process.env.PORT || 5000;

// Conecta ao banco de dados e inicia o servidor
connectDB().then(() => {
    console.log('🔹 Banco conectado');
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
});

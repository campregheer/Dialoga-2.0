import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AuthRequest } from '../middlewares/auth.middleware';

const generateToken = (userId: string, role: string) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET as string, {
    expiresIn: '7d',
  });
};

const isProd = process.env.NODE_ENV === 'development';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, role, profile } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ error: 'E-mail já está em uso' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      email,
      passwordHash,
      role,
      profile,
    });

    const token = generateToken(user._id.toString(), user.role);

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: isProd,
      sameSite:  isProd ? 'lax' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      message: 'Usuário registrado com sucesso',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro no servidor' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ error: 'Credenciais inválidas' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ error: 'Credenciais inválidas' });
      return;
    }

    const token = generateToken(user._id.toString(), user.role);

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      message: 'Login realizado com sucesso',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro no servidor' });
  }
};

export const logout = (req: Request, res: Response): void => {
res.cookie('jwt', '', {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  expires: new Date(0),
  path: '/',
});
  res.status(200).json({ message: 'Logout realizado com sucesso' });
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ error: 'Usuário não encontrado' });
      return;
    }

    const resetToken = require('crypto').randomBytes(20).toString('hex');
    const resetPasswordHash = require('crypto').createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = resetPasswordHash;
    user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // TODO: Send email
    console.log(`[EMAIL SIMULATION] Reset Password URL for ${email}: ${resetUrl}`);

    res.status(200).json({ message: 'E-mail de recuperação enviado (Ver console do backend)' });
  } catch (error) {
    res.status(500).json({ error: 'Erro no servidor' });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const resetPasswordHash = require('crypto').createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: resetPasswordHash,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400).json({ error: 'Token inválido ou expirado' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(req.body.password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: 'Senha atualizada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro no servidor' });
  }
};

/**
 * Retorna os dados do usuário logado a partir do cookie JWT.
 * Usado pelo frontend para restaurar a sessão após um F5 (reload).
 */
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    const user = await User.findById(req.user._id).select('email role profile');
    if (!user) {
      res.status(404).json({ error: 'Usuário não encontrado' });
      return;
    }

    res.status(200).json({
      id: user._id,
      email: user.email,
      role: user.role,
      profile: user.profile,
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro no servidor' });
  }
};

import dotenv from 'dotenv';
import User from '../models/user.model';
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
dotenv.config();



export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name } = req.body;
    const user = await User.findOne({ where: { email: email.toLowerCase() },});
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      email,
      password: hashedPassword,
      name,
    })
    
    return res.status(200).json({ message: "User created", newUser });
  } catch (error) {
    next(error);
  }
}



export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
      const { email, password } = req.body;

      if (!email || !password) {
          return res.status(400).json({ message: 'Email and password are required.' });
      }

      const user = await User.findOne({
          where: { email: email.toLowerCase() },
      });

      if (!user) {
          return res.status(400).json({ message: 'Invalid credentials.' });
      }

      const isPasswordValid = bcrypt.compareSync(password, user.password as string);
      if (!isPasswordValid) {
          return res.status(400).json({ message: 'Invalid email or password.' });
      }

      const token = jwt.sign(
          { id: user.id, email: user.email },
          process.env.JWT_SECRET as string,
          { expiresIn: '1d' }
      );

      return res.status(200).json({
          message: 'User logged in successfully.',
          token,
          user: {
              id: user.id,
              email: user.email,
              role: user.role,
          },
      });
  } catch (error) {
      next(error);
  }
};
import { Request, Response, NextFunction } from "express";
import User from "../user/models/user.model";
import jwt, { JwtPayload } from 'jsonwebtoken';


export const auth = async (req: Request, res: Response, next: NextFunction) => {
 try {
   const token = req.header('Authorization')?.replace('Bearer ', '');

   if (!token) {
     throw new Error(); 
   }

   const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`);
   const user = await User.findByPk((decoded as JwtPayload).id) as JwtPayload;
   req.user = user;

   next();
 } catch (err: any) {
   return res.status(401).json({ message: 'Please authenticate, Kindly login to continue', error: err.message });
 }
};



// export const auth = (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) {
//       return res.status(401).json({ message: 'Authorization token missing' });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
//     (req as any).user = decoded; // Assign user to `req` safely
//     next();
//   } catch (error: any) {
//     return res.status(401).json({ message: 'Invalid or expired token', error: error.message });
//   }
// };

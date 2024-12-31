import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any; 
      token?: any;
      isAuth?: boolean;
      isAdmin?: boolean;
      _id?: string;
      subVendor?: any;
    }
  }
} 
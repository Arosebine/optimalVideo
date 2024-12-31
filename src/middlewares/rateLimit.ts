import { rateLimit } from 'express-rate-limit';

export const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 10,
  message: { error: "Too many requests, please try again later." },
});



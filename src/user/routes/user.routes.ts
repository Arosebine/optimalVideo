import { Router } from "express";
const router: Router = Router();

import {
    login,
    register,
  } from '../controllers/user.controller'
import { auth } from "../../middlewares/auth.middleware";


router.post('/register', register);
router.post('/login', login);


export default router


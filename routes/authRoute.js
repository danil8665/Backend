import { Router} from "express";
import { register, login, getMe } from '../controllers/authController.js'
import { checkAuth } from "../controllers/utils/checkAuth.js";
import cors from 'cors'

const router = new Router()
router.use(cors());

router.post('/register', register)

router.post('/login', login)

router.get('/user', checkAuth, getMe)

export default router;
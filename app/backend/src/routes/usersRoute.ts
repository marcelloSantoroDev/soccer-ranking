import * as express from 'express';
import loginValidations from '../middlewares/loginValidations';
import UsersController from '../controllers/UsersController';
import UsersService from '../services/UsersService';

const router = express.Router();

const usersService = new UsersService();
const usersController = new UsersController(usersService);

router.post('/', loginValidations, usersController.login);

export default router;

import * as express from 'express';
import loginValidations from '../middlewares/loginValidations';
import UsersController from '../controllers/UsersController';
import UsersService from '../services/UsersService';
import tokenValidator from '../middlewares/TokenValidator';

const router = express.Router();

const usersService = new UsersService();
const usersController = new UsersController(usersService);

router.post('/', loginValidations, usersController.login);
router.get('/role', tokenValidator, usersController.role);

export default router;

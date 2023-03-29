import * as express from 'express';
import teamsRoute from './teamsRoute';
import loginRoute from './loginRoute';

const router = express.Router();

router.use('/teams', teamsRoute);
router.use('/login', loginRoute);

export default router;

import * as express from 'express';
import teamsRoute from './teamsRoute';
import usersRoute from './usersRoute';

const router = express.Router();

router.use('/teams', teamsRoute);
router.use('/login', usersRoute);

export default router;

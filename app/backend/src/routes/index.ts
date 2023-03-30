import * as express from 'express';
import teamsRoute from './teamsRoute';
import loginRoute from './loginRoute';
import matchesRoute from './matchesRoute';

const router = express.Router();

router.use('/teams', teamsRoute);
router.use('/login', loginRoute);
router.use('/matches', matchesRoute);

export default router;

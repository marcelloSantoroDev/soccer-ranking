import * as express from 'express';
import teamsRoute from './teamsRoute';
import loginRoute from './loginRoute';
import matchesRoute from './matchesRoute';
import leaderboardRoute from './leaderboardRoute';

const router = express.Router();

router.use('/teams', teamsRoute);
router.use('/login', loginRoute);
router.use('/matches', matchesRoute);
router.use('/leaderboard', leaderboardRoute);

export default router;

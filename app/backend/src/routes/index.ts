import * as express from 'express';
import teamsRoute from './teamsRoute';

const router = express.Router();

router.use('/teams', teamsRoute);

export default router;

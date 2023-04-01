import * as express from 'express';
import LeadeboardController from '../controllers/leaderboardController';
import LeaderboardService from '../services/LeaderboardService';

const router = express.Router();

const leaderboardService = new LeaderboardService();
const leaderboardController = new LeadeboardController(leaderboardService);

router.get('/home', leaderboardController.getHomeLeaderboard);
router.get('/away', leaderboardController.getAwayLeaderboard);

export default router;

import * as express from 'express';
import LeadeboardController from '../controllers/LeaderboardController';
import LeaderboardService from '../services/LeaderboardService';

const router = express.Router();

const leaderboardService = new LeaderboardService();
const leaderboardController = new LeadeboardController(leaderboardService);

router.get('/home', leaderboardController.getHomeLeaderboard);
router.get('/away', leaderboardController.getAwayLeaderboard);
router.get('/', leaderboardController.getGeneralLeaderboard);

export default router;

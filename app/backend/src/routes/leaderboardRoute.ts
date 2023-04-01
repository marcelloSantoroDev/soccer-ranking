import * as express from 'express';
// import tokenValidator from '../middlewares/TokenValidator';
import LeadeboardController from '../controllers/leaderboardController';
import MatchesService from '../services/MatchesService';

const router = express.Router();

const matchesService = new MatchesService();
const leaderboardController = new LeadeboardController(matchesService);

router.get('/home', leaderboardController.getHomeLeaderBoard);
router.get('/away', leaderboardController.getAwayLeaderBoard);

export default router;

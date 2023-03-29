import * as express from 'express';
import TeamsController from '../controllers/teamsController';
import TeamsService from '../services/teamsService';

const router = express.Router();

const teamsService = new TeamsService();
const teamsController = new TeamsController(teamsService);

router.get('/', teamsController.getAll);

export default router;

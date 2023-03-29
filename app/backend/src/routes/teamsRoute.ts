import * as express from 'express';
import TeamsService from '../services/TeamsService';
import TeamsController, { ITeamService } from '../controllers/TeamsController';

const router = express.Router();

const teamsService = new TeamsService() as ITeamService;
const teamsController = new TeamsController(teamsService);

router.get('/', teamsController.getAll);

export default router;

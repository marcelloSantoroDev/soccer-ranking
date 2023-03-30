import * as express from 'express';
import MatchesController from '../controllers/MatchesController';
import MatchesService from '../services/MatchesService';

const router = express.Router();

const matchesService = new MatchesService();
const matchesController = new MatchesController(matchesService);

router.get('/', matchesController.getAll);
router.post('/:id/finish', matchesController.finish);

export default router;

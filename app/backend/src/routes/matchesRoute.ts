import * as express from 'express';
import MatchesController from '../controllers/MatchesController';
import MatchesService from '../services/MatchesService';
import tokenValidator from '../middlewares/TokenValidator';
import matchesValidator from '../middlewares/matchesValidator';

const router = express.Router();

const matchesService = new MatchesService();
const matchesController = new MatchesController(matchesService);

router.get('/', matchesController.getAll);
router.post('/', tokenValidator, matchesValidator, matchesController.create);
router.post('/:id/finish', tokenValidator, matchesController.finish);
router.patch('/:id', tokenValidator, matchesController.update);

export default router;

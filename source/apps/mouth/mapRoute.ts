import express from 'express';
import validate from '../../common/middlewares/validate';
import auth from '../../common/middlewares/auth'

// import auth from '../../common/midlewares/auth';
import mapValidation from './mapValidation';
import mapController from './mapController';
import languageUsed from '../../common/middlewares/languageGet';

const router = express.Router();

router.post('/teen/saveteeth', auth, mapController.mouthTeeth);
router.get('/getmouthTeeth/:id', auth, mapController.getmouthTeeth);

export = router
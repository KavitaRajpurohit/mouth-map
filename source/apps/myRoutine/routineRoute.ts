import express from 'express';
import validate from '../../common/middlewares/validate';
import auth from '../../common/middlewares/auth'

// import auth from '../../common/midlewares/auth';
import routineValidation from './routineValidation';
import routineController from './routineController';
import languageUsed from '../../common/middlewares/languageGet';
// Multer for the storage of the profile image
// import multer from 'multer';

const router = express.Router();

router.post('/addMyRoutine/', auth, languageUsed, validate(routineValidation.addMyRoutine), routineController.addRoutine);
router.get('/listMyRoutine', auth, languageUsed, routineController.getRoutine);
router.get('/brandList', auth, languageUsed, routineController.getBrandData);
router.put('/updateMyRoutine', auth, languageUsed, validate(routineValidation.updateMyRoutine), routineController.updateRoutine)


export = router;

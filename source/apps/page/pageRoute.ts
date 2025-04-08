import express from 'express';
import validate from '../../common/middlewares/validate';
import auth from '../../common/middlewares/auth'

// import auth from '../../common/midlewares/auth';
import pageController from './pageController';
import languageUsed from '../../common/middlewares/languageGet';
// Multer for the storage of the profile image
// import multer from 'multer';

const router = express.Router();

router.get('/aboutus', languageUsed, pageController.aboutus);

export = router
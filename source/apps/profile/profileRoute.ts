import express from 'express';
import validate from '../../common/middlewares/validate';
import auth from '../../common/middlewares/auth'

// import auth from '../../common/midlewares/auth';
import profileValidation from './profileValidation';
import profileController from './profileController';
import languageUsed from '../../common/middlewares/languageGet';
// Multer for the storage of the profile image
// import multer from 'multer';

const router = express.Router();

// const storage = multer.diskStorage({});  
// let upload = multer({storage:storage});
router.put('/profile/updateProfile/', auth, languageUsed, validate(profileValidation.editProfile), profileController.editProfile);
router.put('/admin/changePassword/', auth, languageUsed, validate(profileValidation.changePassword), profileController.changePassword);

export = router
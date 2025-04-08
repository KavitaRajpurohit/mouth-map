import express from 'express';
import validate from '../../common/middlewares/validate';
import auth from '../../common/middlewares/auth'

// import auth from '../../common/midlewares/auth';
import promoValidation from './promoValidation';
import promoController from './promoController';
import languageUsed from '../../common/middlewares/languageGet';
// Multer for the storage of the profile image
// import multer from 'multer';

const router = express.Router();

// const storage = multer.diskStorage({});  
// let upload = multer({storage:storage});
router.post('/addpromocode', languageUsed, validate(promoValidation.addPromoCode), promoController.addPromoCode);
router.put('/editpromocode', languageUsed, validate(promoValidation.editPromoCode), promoController.editPromoCode);
router.get('/getpromocode', languageUsed, validate(promoValidation.getPromoCode), promoController.getPromoCode);
router.delete('/deletepromocode/:id', languageUsed, promoController.deletePromoCode);
router.get('/listApplicablePcode', auth, languageUsed, validate(promoValidation.getAppicablePcode), promoController.getAppicablePcode)

export = router
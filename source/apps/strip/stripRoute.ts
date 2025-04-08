import express from 'express';
import validate from '../../common/middlewares/validate';
import auth from '../../common/middlewares/auth'

// import auth from '../../common/midlewares/auth';
import stripValidation from '../../apps/strip/stripValidation';
import stripController from '../../apps/strip/stripController';
import languageUsed from '../../common/middlewares/languageGet';
// Multer for the storage of the profile image
// import multer from 'multer';

const router = express.Router();


router.post('/createCart', auth, validate(stripValidation.createCard), stripController.createCard);
router.post('/addNewCard', auth, validate(stripValidation.addNewCard), stripController.addNewCard);
router.get('/getAllCard', auth, validate(stripValidation.getAllCard), stripController.getAllCard)
router.delete('/deleteCard', auth, languageUsed, validate(stripValidation.deleteCard), stripController.deleteCard);
router.put('/updateCard', auth, validate(stripValidation.updateCard), stripController.updateCard)

//router.post('/createCustomer', auth, validate(stripValidation.createCard), stripController.createCustomer)

export = router;

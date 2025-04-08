import express from 'express';
import validate from '../../common/middlewares/validate';
import auth from '../../common/middlewares/auth'

// import auth from '../../common/midlewares/auth';
import myCartValidation from './myCartValidation';
import myCartController from './myCartController';
import languageUsed from '../../common/middlewares/languageGet';

const router = express.Router();

router.post('/addMyCart/', auth, languageUsed, validate(myCartValidation.addMyCart), myCartController.addMyCart);
router.post('/addMyCartProduct/', auth, languageUsed, validate(myCartValidation.addMyCartProduct), myCartController.addMyCartProduct);

router.get('/cartlist', auth, languageUsed, validate(myCartValidation.cartList), myCartController.getAllCart);
router.post('/updateMyCart/', auth, languageUsed, validate(myCartValidation.updateCart), myCartController.updateMyCart);

router.delete('/deleteCart/:id', languageUsed, myCartController.deleteCart)
router.delete('/deleteProductCart/:id', languageUsed, myCartController.deleteProductCart)

router.post('/addshipping/', languageUsed, myCartController.addShipping);
router.get('/getShipping', languageUsed, myCartController.getShipping);

export = router

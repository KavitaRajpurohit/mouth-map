import express from 'express';
import validate from '../../common/middlewares/validate';
import auth from '../../common/middlewares/auth'

// import auth from '../../common/midlewares/auth';
import productShopValidation from './productShopValidation';
import productShopController from './productShopController';
import languageUsed from '../../common/middlewares/languageGet';
// Multer for the storage of the profile image
// import multer from 'multer';

const router = express.Router();


router.get('/allShopProduct', languageUsed, validate(productShopValidation.allProduct), productShopController.getallProducts);
router.get('/productdetail/:id', languageUsed, productShopController.productDetails);

export = router
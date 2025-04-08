import express from 'express';
import validate from '../../common/middlewares/validate';
import auth from '../../common/middlewares/auth'

// import auth from '../../common/midlewares/auth';
import productValidation from './productValidation';
import productController from './productController';
import languageUsed from '../../common/middlewares/languageGet';
// Multer for the storage of the profile image
// import multer from 'multer';

const router = express.Router();

// const storage = multer.diskStorage({});  
// let upload = multer({storage:storage});

router.post('/product/', languageUsed, validate(productValidation.createProduct), productController.createProduct);
router.get('/allProducts', languageUsed, validate(productValidation.allProduct), productController.getallProducts);
router.put('/product/updateProduct/', languageUsed, validate(productValidation.updateProduct), productController.updateProduct)
router.delete('/product/:id', languageUsed, productController.deleteProduct);
router.put('/product/updateStatus/', languageUsed, validate(productValidation.updateStatusProduct), productController.updateStatusProduct);
router.get('/allProductList', languageUsed, productController.allProductList);
router.get('/myBrushList', auth, languageUsed, productController.myBrushList);



export = router
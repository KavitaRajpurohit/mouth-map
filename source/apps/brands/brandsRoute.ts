import express from 'express';
import validate from '../../common/middlewares/validate';
import auth from '../../common/middlewares/auth';
// import auth from '../../common/midlewares/auth';
import brandsValidation from './brandsValidation';
import brandsController from './brandsController';
import languageUsed from '../../common/middlewares/languageGet';


const router = express.Router();

router.post('/brand/', languageUsed, validate(brandsValidation.createBrand), brandsController.createBrand);
router.get('/allBrands', auth, languageUsed, validate(brandsValidation.allBrands), brandsController.getallBrand);
router.put('/brand/updateBrand/', auth, languageUsed, validate(brandsValidation.updateBrand), brandsController.updateBrand)
router.delete('/brand/:id', languageUsed, brandsController.deleteBrand);
router.put('/brand/updateStatus/', languageUsed, validate(brandsValidation.updateStatusBrand), brandsController.updateStatusBrand);
router.get('/allBrandList', languageUsed, brandsController.brandAllList);


export = router
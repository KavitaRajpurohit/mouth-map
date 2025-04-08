import express from 'express';
import validate from '../../common/middlewares/validate';
import auth from '../../common/middlewares/auth'

// import auth from '../../common/midlewares/auth';
import userAddressValidation from './userAddressValidation'
import userAddressController from './userAddressController';
import languageUsed from '../../common/middlewares/languageGet';

const router = express.Router();

router.post('/address', auth, languageUsed, validate(userAddressValidation.addUserAddress), userAddressController.addUserAddress);
router.put('/updateAddress', auth, languageUsed, validate(userAddressValidation.updateUserAddress), userAddressController.updateAddress);
router.get('/listUserAddress/:id', languageUsed, userAddressController.getUserAddress);
router.put('/updateAddressStatus', auth, languageUsed, userAddressController.updateAddressStatus);
router.put('/updateAddress', auth, languageUsed, validate(userAddressValidation.updateUserAddress), userAddressController.updateAddress);

router.delete('/uAddress/:id', languageUsed, userAddressController.deleteUserAddress);
router.get('/postcodeList', languageUsed, userAddressController.PostCodeList);


export = router
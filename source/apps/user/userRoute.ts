import express from 'express';
import validate from '../../common/middlewares/validate';
import auth from '../../common/middlewares/auth'

// import auth from '../../common/midlewares/auth';
import userValidation from '../../apps/user/userValidation';
import userController from '../../apps/user/userController';
import languageUsed from '../../common/middlewares/languageGet';
// Multer for the storage of the profile image
// import multer from 'multer';

const router = express.Router();

// const storage = multer.diskStorage({});  
// let upload = multer({storage:storage});
router.get('/userList', languageUsed, validate(userValidation.getAllUser), userController.getAllUser);
router.put('/user/updateStatus/', validate(userValidation.updateStatusUser), userController.updateStatusUser);
router.delete('/user/:id', userController.deleteUser);
router.post('/userAddress/', auth, languageUsed, validate(userValidation.updateUserAddress), userController.addUserAddress);
router.get('/listUserAddress/', userController.getAllUserAddress);
router.post('/notification', auth, validate(userValidation.createNotification), userController.createNotification)
router.get('/notificationList', auth, userController.getNotification);
router.put('/notificationMarkRead', auth, userController.notificationMarkRead);
router.get('/readNotification', userController.readNotification);
router.get('/unReadNotification', userController.unReadNotification);


router.get('/oneUser/:id', auth, languageUsed, validate(userValidation.getUser), userController.oneUser);
router.get('/singleuser/:id', auth, languageUsed, userController.singleUser);

router.put('/updateUser', languageUsed, validate(userValidation.updateUser), userController.updateUser)
router.get('/countrylist', userController.getCountryList);
router.get('/deleteaddress/:id', auth, languageUsed, userController.deleteAddress);

router.get('/stateList', userController.getStateList);
router.get('/cityList', userController.getCityList);
router.get('/oneTimeProduct', languageUsed, validate(userValidation.oneTimeProduct), userController.oneTimeProduct);
router.get('/subScribeProduct', languageUsed, validate(userValidation.subScribedProduct), userController.subScribeProduct);
router.get('/unSubScribeProduct', languageUsed, validate(userValidation.unSubScribeProduct), userController.unSubScribeProduct);
router.get('/getOneUser/:id', auth, languageUsed, userController.getOneUser);




export = router
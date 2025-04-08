import express from 'express';
import validate from '../../common/middlewares/validate';
import auth from '../../common/middlewares/auth'

// import auth from '../../common/midlewares/auth';
import orderValidation from './orderValidation';
import orderController from './orderController';
import languageUsed from '../../common/middlewares/languageGet';

const router = express.Router();

router.post('/createOrder', auth, languageUsed, validate(orderValidation.createOrder), orderController.createOrder);
router.get('/showOderList', auth, languageUsed, orderController.getOderList);
router.get('/pendingOrder', auth, languageUsed, orderController.getPendingOrder);
router.get('/getOnTheWayOrder', auth, languageUsed, orderController.getOnTheWayOrder);
router.get('/getDeliveredOrder', auth, languageUsed, orderController.getDeliveredOrder);

router.get('/viewOrderList', languageUsed, validate(orderValidation.getAllOrder), orderController.viewOrderList);
router.get('/orderDetails', languageUsed, orderController.orderDetails);
router.get('/oneTimeProduct', languageUsed, orderController.oneTimeProduct);
router.get('/subScribeProduct', languageUsed, orderController.subScribeProduct);
router.get('/userOneTimeProduct', auth, languageUsed, orderController.userOneTimeProduct);
router.get('/userOneTimeProduct', auth, languageUsed, orderController.userSubScribeProduct);
router.put('/updateQuantity', auth, languageUsed, validate(orderValidation.updateQuantity), orderController.updateQuantity)


export = router
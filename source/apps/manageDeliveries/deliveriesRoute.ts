import express from 'express';
import validate from '../../common/middlewares/validate';
import auth from '../../common/middlewares/auth';
// import auth from '../../common/midlewares/auth';
import deliveriesValidation from './deliveriesValidation'
import deliveriesController from './deliveriesController'
import languageUsed from '../../common/middlewares/languageGet';


const router = express.Router();

router.get('/orderDeliveries', languageUsed, validate(deliveriesValidation.manageDeliveriesList), deliveriesController.getDeliveriesList);
router.get('/orderDetails', languageUsed, validate(deliveriesValidation.orderDetails), deliveriesController.orderDetails);
router.put('/orderDeliveriesStatus', languageUsed, validate(deliveriesValidation.orderDeliveriesStatus), deliveriesController.orderDeliveriesStatus);

export = router
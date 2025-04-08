import { any } from '@hapi/joi';
import express from 'express';
import authRoutes from '../apps/auth/authRoute';
import brandsRoutes from '../apps/brands/brandsRoute';
import patienteduRoutes from '../apps/patientsEducation/patienteduRoute';
import productsRoutes from '../apps/products/productRoute';
import profileRoutes from '../apps/profile/profileRoute';
import promocodeRoutes from '../apps/promocode/promoRoute';
import userRoutes from '../apps/user/userRoute';
import myCartRoutes from '../apps/myCart/myCartRoute';
import pageRoutes from '../apps/page/pageRoute';
import productShopRoutes from '../apps/shop/productShopRoute'
import mapRoutes from '../apps/mouth/mapRoute';
import routineRoutes from '../apps/myRoutine/routineRoute';
import orderRoutes from '../apps/order/orderRoute';
import stripRoutes from '../apps/strip/stripRoute';
import deliveriesRoutes from '../apps/manageDeliveries/deliveriesRoute';
import userAddressRoutes from '../apps/userAddress/userAddressRoute'

//import adminRoutes from '../apps/admin/adminRoute';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/brands', brandsRoutes);
router.use('/patients', patienteduRoutes);
router.use('/products', productsRoutes);
router.use('/productShop', productShopRoutes);
router.use('/profile', profileRoutes);
router.use('/promocode', promocodeRoutes);
router.use('/user', userRoutes);
router.use('/myCart', myCartRoutes);
router.use('/page', pageRoutes);
//router.use('/admin',adminRoutes);
router.use('/mouth', mapRoutes);
router.use('/routine', routineRoutes);
router.use('/order', orderRoutes);
router.use('/strip', stripRoutes);
router.use('/manageDeliveries', deliveriesRoutes);
router.use('/userAddress', userAddressRoutes);

export = router;
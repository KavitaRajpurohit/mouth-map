import { Request, Response, NextFunction } from 'express';
const cron = require('node-cron');
import httpStatus from 'http-status';
import createResponse from '../../common/utils/response';
//import stripServices from '../strip/stripServices';
import Messages from '../../common/utils/messages/english';
import English from '../../common/utils/messages/english';
import Spanish from '../../common/utils/messages/spanish'
import emailService from '../../common/services/emailService';
import productServices from '../products/productServices';
//import smsService from '../../common/services/smsService';
import tokenService from '../../common/services/tokenService';
import AppError from '../../common/utils/appError';
import bcrypt from 'bcryptjs';
import Tokens from '../../model/tokenModel';
import auth from '../../common/middlewares/auth';
import stripPayment from '../../model/stripPayment';
import userServices from '../user/userServices';
import stripSevices from '../../common/utils/stripServices';
import profileServices from '../profile/profileServices';
import { any } from '@hapi/joi';
import { Console } from 'console';
import userModel from '../../model/userModel';
import mongoose from 'mongoose';
import messages from '../../common/utils/messages/english';


const createCard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { user }: any = req.user
        const userData: any = await userServices.singleUser(user);
        console.log(user, 'kavya');

        let stripeCustomerId: any;
        let cardId: any
        if (!userData.sStripeCustomerId) {
            console.log(!userData.sStripeCustomerId, '--------');

            const sStripeCustomerId = await stripSevices.createCustomer({
                email: userData.sEmail,
            });
            console.log(userData.sEmail, 'userData.sEmail');
            console.log(sStripeCustomerId, 'sStripeCustomerId');


            stripeCustomerId = sStripeCustomerId;
            await profileServices.updateProfile(user, { sStripeCustomerId });
        }
        const cardData: any = await userModel.findById(user);
        console.log(userData.sStripeCustomerId, 'userData.sStripeCustomerId');

        console.log(cardData, 'cardData');
        const paymentCard: any = await stripPayment.findOne({ cardId: req.body.token, defaultCard: true });

        if (!paymentCard.cardId) {
            console.log(!cardData.cardId, 'data');
            const cardCreate: any = await stripSevices.createCard(cardData.sStripeCustomerId, req.body.token);
            console.log(cardCreate, 'token');
            await stripPayment.create({
                userId: new mongoose.Types.ObjectId(user),
                exp_month: cardCreate.exp_month,
                exp_year: cardCreate.exp_year,
                customerId: cardData.sStripeCustomerId,
                cardId: cardCreate.id,
                sCardBrand: cardCreate.brand,
                sCountry: cardCreate.country,
                cardNumber: cardCreate.last4,
                sCardType: cardCreate.funding,
                defaultCard: true,
            })

            let obj = {
                amount: req.body.nPrice * 100,
                currency: "gbp",
                source: cardCreate.id,
                description: `Create charge for job Id is`,
                customer: cardData.sStripeCustomerId
            }
            console.log(obj, 'object');

            const setup: any = await stripSevices.createCharge(obj);
            const body = {
                isCompleted: true,
                paymentStatus: 'SUCCESS',
                targetStatus: 'Completed',
                sStripeTransationId: setup.id,
            }
            console.log(setup.id, 'setup.id');

            createResponse(res, httpStatus.OK, Messages.CHARGE_CREATED, body)
        }
        else {
            let obj = {
                amount: req.body.nPrice,
                currency: "gbp",
                source: req.body.token,
                description: `Create charge for job Id is`,
                customer: cardData.sStripeCustomerId
            }
            console.log(obj, 'object');

            const setup: any = await stripSevices.createCharge(obj);
            const body = {
                isCompleted: true,
                paymentStatus: 'SUCCESS',
                targetStatus: 'Completed',
                sStripeTransationId: setup.id,
            }
            createResponse(res, httpStatus.OK, Messages.CHARGE_CREATED, body)
        }
    }
    catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};

// const addNewCard = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         let { user }: any = req.user
//         let cardId: any
//         const userData: any = await userServices.singleUser(user);
//         console.log(user, 'kavya');

//         if (!userData.sStripeCustomerId) {
//             console.log(!userData.sStripeCustomerId, '--------');

//             const sStripeCustomerId = await stripSevices.createCustomer({
//                 email: userData.sEmail,
//             });
//             console.log(userData.sEmail, 'userData.sEmail');

//             //stripeCustomerId = sStripeCustomerId;
//             await profileServices.updateProfile(user, { sStripeCustomerId });
//         }
//         const cardData: any = await userModel.findById(user);
//         console.log(user, 'user');

//         const paymentCard: any = await stripPayment.findOne({ customerId: cardData.sStripeCustomerId, defaultCard: false });
//         console.log();

//         const cardCreate: any = await stripSevices.createCard(cardData.sStripeCustomerId, req.body.token);

//         console.log(cardData.sStripeCustomerId, ' cardData.sStripeCustomerId');

//         if (!paymentCard.cardId) {
//             console.log(!paymentCard.cardId, 'data');
//             //const cardCreate: any = await stripSevices.createCard(cardData.sStripeCustomerId, req.body.token);
//             console.log(cardData.sStripeCustomerId, 'StripeCustomerId');

//             console.log(cardCreate, 'token');
//             await stripPayment.create({
//                 userId: new mongoose.Types.ObjectId(user),
//                 exp_month: cardCreate.exp_month,
//                 exp_year: cardCreate.exp_year,
//                 customerId: cardData.sStripeCustomerId,
//                 cardId: cardCreate.id,
//                 defaultCard: false,
//             })

//         } else {
//             // null
//         }

//         createResponse(res, httpStatus.OK, Messages.CHARGE_CREATED, {})
//     }
//     // if (!paymentCard.cardId) {
//     //     console.log(cardCreate, 'token');
//     //     await stripPayment.create({
//     //         userId: new mongoose.Types.ObjectId(user),
//     //         exp_month: cardCreate.exp_month,
//     //         exp_year: cardCreate.exp_year,
//     //         customerId: req.body.sStripeCustomerId,
//     //         cardId: cardCreate.id,
//     //         defaultAddress: false,
//     //     })
//     // }
//     //createResponse(res, httpStatus.OK, Messages.CHARGE_CREATED, paymentCard)

//     catch (error: any) {
//         createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
//     }
// };
const addNewCard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { user }: any = req.user
        const userData: any = await userServices.singleUser(user);
        console.log(user, 'kavya');

        let stripeCustomerId: any;
        let cardId: any
        if (!userData.sStripeCustomerId) {
            console.log(!userData.sStripeCustomerId, '--------');

            const sStripeCustomerId = await stripSevices.createCustomer({
                email: userData.sEmail,
            });
            console.log(userData.sEmail, 'userData.sEmail');
            console.log(sStripeCustomerId, 'sStripeCustomerId');
            stripeCustomerId = sStripeCustomerId;
            await profileServices.updateProfile(user, { sStripeCustomerId });
            console.log(sStripeCustomerId, 'sStripeCustomerId!!!!!!!');

        }
        const cardData: any = await userModel.findById(user);
        console.log(userData.sStripeCustomerId, 'userData.sStripeCustomerId');

        console.log(cardData, 'cardData');
        const paymentCard: any = await stripPayment.find({ customerId: cardData.sStripeCustomerId, metadata: { 'defaultCard': 'true' } });
        console.log(cardData.sStripeCustomerId, { 'defaultCard': 'true' }, 'kavya');
        console.log(paymentCard, 'paymentCard');

        // if (paymentCard) {
        //     console.log(paymentCard, 'after');

        //     await stripPayment.update({
        //         metadata: { 'defaultCard': 'false' }
        //     })
        // }
        // else {
        //     throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, messages.NO_DATA);
        // }
        //     console.log(oUserId, 'oUserId');
        // let userData = await userModel.findById({ _id: oUserId.user });
        // console.log(userData, 'userData------');
        // if (userData) {
        //     await address.update({ defaultAddress: false })
        // }
        // else {
        //     throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, messages.NO_DATA);
        // }
        // //await address.findByIdAndUpdate({ _id: id }, body, { new: true });

        // body['oUserId'] = oUserId.user;
        // console.log(oUserId.user, 'hello');
        // console.log(userData);
        // return await address.create(body)
        console.log(cardData.sStripeCustomerId, 'hello!!!!!!!');

        if (!cardData.cardId) {
            console.log(!cardData.cardId, 'data');
            const cardCreate: any = await stripSevices.createCard(cardData.sStripeCustomerId, req.body.token);
            console.log(cardCreate, 'token');
            const cardValue: any = await stripPayment.create({
                userId: new mongoose.Types.ObjectId(user),
                exp_month: cardCreate.exp_month,
                exp_year: cardCreate.exp_year,
                customerId: cardData.sStripeCustomerId,
                cardId: cardCreate.id,
                sCardBrand: cardCreate.brand,
                sCountry: cardCreate.country,
                cardNumber: cardCreate.last4,
                sCardType: cardCreate.funding,
                //defaultCard: true,
                metadata: { 'defaultCard': 'true' }
            })
            console.log(cardValue, 'cardValue----');
            createResponse(res, httpStatus.OK, Messages.CHARGE_CREATED, cardValue)
            if (cardValue.customerId == 0) {
                console.log(cardData.sStripeCustomerId, 'hello@@@@@@');
                console.log(cardValue.customerId == 0, 'length');
                await stripPayment.create({
                    userId: new mongoose.Types.ObjectId(user),
                    exp_month: cardCreate.exp_month,
                    exp_year: cardCreate.exp_year,
                    customerId: cardData.sStripeCustomerId,
                    cardId: cardCreate.id,
                    sCardBrand: cardCreate.brand,
                    sCountry: cardCreate.country,
                    cardNumber: cardCreate.last4,
                    sCardType: cardCreate.funding,
                    //defaultCard: true,
                    metadata: { 'defaultCard': 'false' }
                })


            }
        }
        // const defaultValue: any = await stripPayment.find({ cardId: cardValue.cardId, metadata: { 'defaultCard': 'true' } });
        // if (defaultValue) {
        //     console.log(defaultValue, 'after');
        //     await stripPayment.update({ defaultAddress: false })
        //     // await stripPayment.update({
        //     //     metadata: { 'cardCreate': 'false' }
        //     // })
        // }
        // else {
        //     throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, messages.NO_DATA);
        // }
    }
    catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};
const defaultCard = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const language = req.header('language');

        const brand: any = await stripSevices.defaultCard(req.query.id, req.body);

        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.ADD_BRAND, brand);
        }
        else {

            createResponse(res, httpStatus.OK, English.ADD_BRAND, brand);
        }

    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};
const getAllCard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const abouts: any = await stripSevices.getAllCard(req.query.customerId);
        if (abouts) {
            console.log(abouts, 'abouts');

            await stripPayment.find({ userId: new mongoose.Types.ObjectId(req.body.userId) });
        }
        console.log(new mongoose.Types.ObjectId(req.body.userId), 'customer');

        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.ABOUT_DATA, abouts);
        }
        else {

            createResponse(res, httpStatus.OK, English.ABOUT_DATA, abouts);
        }

    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};
const deleteCard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const brand: any = await stripSevices.deleteCard(req.query.customerId, req.query.cardId);
        console.log(brand, 'brand');

        if (brand.deleted) {
            await stripPayment.deleteOne({ _id: new mongoose.Types.ObjectId(req.body.id) });
        }
        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.DELETE_BRAND, brand);
        }
        else {

            createResponse(res, httpStatus.OK, English.DELETE_BRAND, brand);
        }

    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};
const updateCard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const abouts: any = await stripSevices.updateCard(req.body.customerId, req.body.cardId, req.body.updatedData);
        console.log(abouts, 'abouts');

        if (abouts) {
            console.log(abouts, 'card');
            await stripPayment.find({ customerId: req.body.customerId, cardId: req.body.cardId })
            console.log(req.body.customerId, req.body.cardId, 'data');

            const cardData = await stripPayment.findOneAndUpdate({ customerId: req.body.customerId, cardId: req.body.cardId }, { $set: req.body.updatedData });
            console.log(cardData, 'cardData');

            console.log(req.body.customerId, req.body.cardId, req.body.updatedData, 'hello');

            //await stripPayment.update({ _id: req.body.customerId }, { cardId: req.body.cardId }, req.body.updatedData, { new: true });
        }

        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.ABOUT_DATA, abouts);
        }
        else {

            createResponse(res, httpStatus.OK, English.ABOUT_DATA, abouts);
        }

    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};
export default {
    createCard,
    addNewCard,
    getAllCard,
    deleteCard,
    defaultCard,
    updateCard
}
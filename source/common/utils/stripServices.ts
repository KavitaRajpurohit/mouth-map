import { any } from "@hapi/joi";
import stripPayment from '../../model/stripPayment';
import mongoose from 'mongoose';


const stripe = require('stripe')("sk_test_51JtpWVHFVukxet5obE9LWFiRlNW4p1BTBwEJvm3q0Ze8NM6rmzmb1WWJ2zZYeloiF5yFYIEo69UPze9Ja2GV0qEN00ihzhv4IT");

const createCustomer = (data: any) => {
    console.log(data, 'data---');

    return new Promise((resolve, reject) => {
        stripe.customers.create(data)
            .then((customer: any) => resolve(customer.id))
            .catch((error: any) => reject(error));
    })
}

const createCard = (customerId: any, cardToken: any) => {
    return new Promise((resolve, reject) => {
        stripe.customers.createSource(
            customerId,
            {
                source: cardToken
            },
            (err: any, customer: any) => {
                if (err) {
                    reject(err)
                }
                resolve(customer)
            }
        )
    })
}

const createCharge = (obj: any) => {
    return new Promise((resolve, reject) => {
        stripe.charges.create(
            obj,
            (err: any, customer: any) => {
                if (err) {
                    reject(err)
                }
                resolve(customer)
            }
        )
    })
}
const deleteCard = (customerId: any, cardId: any) => {
    return new Promise((resolve, reject) => {
        stripe.customers.deleteSource(
            customerId,
            cardId,
        ).then((customer: any) => resolve(customer))
            .catch((error: any) => reject(error));
    })
};

const defaultCard = async (id: any, body: any) => {

    let brandData = await stripPayment.find({ isDeleted: { $in: true } })
    console.log(brandData, 'hello');

    if (brandData) {
        await stripPayment.update({ defaultCard: false })
    }
    await stripPayment.findByIdAndUpdate({ _id: id }, body, { new: true });
}
const updateCard = (customerId: any, cardId: any, obj: any) => {
    console.log(customerId, cardId, obj, 'obj');

    return new Promise((resolve, reject) => {
        stripe.customers.updateSource(
            customerId,
            cardId,
            obj
        ).then((customer: any) => resolve(customer))
            .catch((error: any) => reject(error));
    })
};
const getAllCard = (id: any) => {
    return new Promise((resolve, reject) => {
        stripe.customers.listSources(
            id,
            { object: 'card' }
        ).then((customer: any) => resolve(customer))
            .catch((error: any) => reject(error));
    })
};

export default {
    createCustomer,
    createCard,
    createCharge,
    getAllCard,
    deleteCard,
    defaultCard,
    updateCard
    //createCardToken
}
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
import { boolean, string } from "@hapi/joi";
import { timeStamp } from "console";
import { model, Schema } from "mongoose";
const notificationSchema = new Schema(
    {
        title: {
            type: String,
        },
        message: {
            type: String
        },
        isRead: {
            type: Boolean,
            default: false
        },
        userId: {
            type: ObjectId,
            ref: 'user',
        },
        callToAction: {
            type: String,
            enum: ['CREATE_PRODUCT', 'CHANGE_BRUSH', 'BUY_NEW_BRUSH', 'OUT_OF_DELIVERY', 'PRODUCT_DELIVERED']
        }

    },
    {
        timestamps: true,
        toObject: { getters: true },
        toJSON: { getters: true },
    },
);

const notificationData = mongoose.model('notifictions', notificationSchema);
export default notificationData;

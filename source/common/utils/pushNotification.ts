const FCM = require('fcm-node');
const apn = require('apn');
var path = require('path');
import notificationData from '../../model/notificationModel';
import userModel from '../../model/userModel';
import deviceTokenModel from '../../model/deviceTokenModel';
import { any } from '@hapi/joi';
//const { NotificationModel, Userdata, DeviceToken } = require('../models/')
var targetPath = path.resolve();
const serverKey = 'AAAAxw_2Nss:APA91bHvuq45lF1dlgzuqIs7GasA0_12wH02zGDkz1L6BPC2ObvOLz15iXzAlR21YnDzW3Wqh-LiI6-nKzHMh7kDP28F9prZzyR--eRNkTS10H7ljulljidseEk1G8dudbDozk08fTZB'; //put your server key here
const fcm = new FCM(serverKey);
const setNotification = async (userId: any, message: any, senderId: any, receiverId: any, title: any, callToAction: any) => {
    let userdetails: any = await userModel.findById(userId)
    console.log(userId, 'userId');
    console.log(userdetails, 'userdetails');


    let deviceToken = await deviceTokenModel.find({ user: userId })
    console.log(userId, 'hello');

    console.log(deviceToken, "deviceToken");
    if (deviceToken.length != 0) {
        let isNotification = true;
        isNotification = userdetails.isNotificationGoal
        if (isNotification === true) {
            for (let i = 0; i < deviceToken.length; i++) {
                const element = deviceToken[i];
                android(element.deviceToken, "mouthMap", message)
            }
        }
        let obj = {
            title,
            message,
            initiator: senderId,
            receiver: receiverId,
            callToAction

        }
        console.log(obj, 'objectData');

        // if (userId) {
        //     obj = {
        //         ...obj,

        //     }
        // }
        await notificationData(obj).save()
    }
};
const android = async (token: any, title: any, message: any) => {
    var message: any = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: token,
        collapse_key: 'your_collapse_key',

        notification: {
            title: title,
            body: message
        },
    };
    return new Promise((resolve, reject) => {
        fcm.send(message, function (err: any, response: any) {
            if (err) {
                console.log(err);
                resolve(err)
            } else {
                console.log(response);
                resolve(response)
            }
        });
    })
}
// const ios = async (token: any, message: string) => {
//     var options = {
//         token: {
//             key: targetPath + '/src/AuthKey_2XU9PM468Q.p8',
//             keyId: "2XU9PM468Q",
//             teamId: "WFLEQM9J6C"
//         },
//         production: true
//     };
//     var apnConnection = new apn.Provider(options);
//     var note = new apn.Notification();
//     note.badge = 1;
//     note.alert = message;
//     // note.payload = { flag: flag, title: title, color: color_name };
//     note.topic = "com.nrgapplication.beta"
//     var deviceToken = token;
//     return new Promise((resolve, reject) => {
//         apnConnection.send(note, deviceToken).then((result: any, error: any) => {
//             resolve(result)
//         });
//     })
// }
module.exports = setNotification
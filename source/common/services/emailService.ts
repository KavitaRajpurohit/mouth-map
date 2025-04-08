import { Client } from "@sendgrid/client";
import sgMail from "@sendgrid/mail";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";
let BASE_PATH: any;
BASE_PATH = __dirname.split('/');
BASE_PATH.splice(-1, 1);
BASE_PATH = BASE_PATH.join('/');
// Test setClient() method
sgMail.setClient(new Client());

// Test setApiKey() method
sgMail.setApiKey("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");

// Test setSubstitutionWrappers() method
sgMail.setSubstitutionWrappers("{{", "}}")

// Test send() method
async function sendEmail(params: any) {
    console.log(params, '--------');

    await sgMail.send({
        from: "hosting@zudu.co.uk",
        to: params.to,
        subject: params.subject,
        html: params.html
    }).then(() => {
        console.log("Sent Mail")
    })
        .catch((error) => {
            console.log(error);
        })
}

function sendForgotPasswordEmail(sEmail: String, user: any, tokens: any) {

    let subject = 'Forgot Password '
    let html = fs.readFileSync(path.join(BASE_PATH, "/public/Forgot_Template.html"), { encoding: "utf-8" });
    var url = user.sUserRole === "User" ? `${process.env.HOST}/resetpassword?token=${tokens}` : `${process.env.HOST}/resetpassword?token=${tokens}`;
    console.log(url, '!!!!!!!!!!!');


    const template = handlebars.compile(html);
    const htmlToSend = template({
        name: `${user.sFirstName} ${user.sLastName}`,
        // body.sFirstname && body.sLastname ? `${body.sFirstname} ${body.sLastname}` : "hi",
        url,
        otp: user.OTP,
    });
    sendEmail({ to: sEmail, html: htmlToSend, subject: subject })
};

// const sendForgotPasswordEmail = async (to, body) => {
// 	console.log(body, 'body>>>');
// 	const subject = 'Password Reset On Strom Motors'
// 	const html = fs.readFileSync(path.join(BASE_PATH, '/public/template/ForgotPassword.html'), { encoding: 'utf-8' })
// 	var url = `${process.env.HOST}/resetpassword?token=${body.token}`

// 	const template = handlebars.compile(html)
// 	const htmlToSend = template({
// 		name:body.fullName,
// 		email: body.email,
// 		url,
// 	})
// 	const mailOptions = mailBody(to, htmlToSend, subject)
// 	await sendEmail(mailOptions)
// }


function sendPasswordReset(user: any) {
    let subject = 'Password Reset'
    let html = fs.readFileSync(path.join(BASE_PATH, "/public/Reset_Template.html"), { encoding: "utf-8" });
    const template = handlebars.compile(html);
    var fullName = user.firstName + ' ' + user.lastName ?? user.email
    const htmlToSend = template({
        subject: subject,
        name: `${fullName}`
    });
    sendEmail({ to: user.email, html: htmlToSend, subject: subject })
};
function sendVerifyUserEmail(sEmail: String, user: any, tokens: any) {
    let subject = 'Verification code send sucessfully'
    let html = fs.readFileSync(path.join(BASE_PATH, "/public/Reset_Template.html"), { encoding: "utf-8" });
    var url = `${process.env.HOST}/checkemail?token=${tokens}`;
    const template = handlebars.compile(html);
    const htmlToSend = template({
        name: `${user.sFirstName} ${user.sLastName}`,
        url,
    });
    sendEmail({ to: sEmail, html: htmlToSend, subject: subject })

}

// const NewUserSubscribed = async (user: any) => {
//     console.log(user, 'user---------');
// };

const NewUserSubscribed = async (sEmail: String, emailData: any) => {
    var subject = 'New User Subsctibed';
    var html = fs.readFileSync(path.join(BASE_PATH, "/public/Subscriber_Template.html.html"), { encoding: "utf-8" });
    let oUserId = emailData.userId

    let url = `${process.env.HOST}/product?userId=${oUserId}`;

    const template = handlebars.compile(html);
    const htmlToSend = template({
        name: 'hello',
        url,
        orderData: emailData,
        userId: emailData.oUserId,


    });
    sendEmail({ to: sEmail, html: htmlToSend, subject: subject })
};
const newOrderPlace = async (sEmail: String, emailData: any) => {
    var subject = 'New User Subsctibed';
    var html = fs.readFileSync(path.join(BASE_PATH, "/public/Order_Template.html"), { encoding: "utf-8" });
    let oUserId = emailData.userId

    //let url = `${process.env.HOST}/product?userId=${oUserId}`;

    const template = handlebars.compile(html);
    const htmlToSend = template({
        name: 'hello',
        // url,
        orderData: emailData,
        userId: emailData.oUserId,


    });
    sendEmail({ to: sEmail, html: htmlToSend, subject: subject })
};

function sendOtp(sEmail: String, user: any, subject: any) {
    console.log(user, sEmail, 'user-------');

    let html = fs.readFileSync(path.join(BASE_PATH, "/public/Forgot_Template.html"), { encoding: "utf-8" });
    //let html = fs.readFileSync(path.join(BASE_PATH, "/public/templates/verificationEmail.html"), { encoding: "utf-8" });
    const template = handlebars.compile(html);
    const htmlToSend = template({
        subject: subject,
        name: `${user.sFirstName} ${user.sLastName}`,
        otp: user.OTP
    })

    sendEmail({ to: sEmail, html: htmlToSend, subject: subject })
}

export default {
    //sendForgotPasswordEmail,
    sendOtp,
    sendVerifyUserEmail,
    sendPasswordReset,
    sendForgotPasswordEmail,
    NewUserSubscribed,
    newOrderPlace,
    //sendOtpLogin
}
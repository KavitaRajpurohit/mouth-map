import moment from "moment";
const generateOtp = () => {
    const value = Math.floor(100000 + Math.random() * 900000);
    const otpExpiresAt = moment().add(10, 'minutes').toDate();
    let otpData = { OTP: value, otpExpiresAt: otpExpiresAt };
    return otpData
}
export default {
    generateOtp
}
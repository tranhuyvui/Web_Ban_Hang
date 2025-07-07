const sql = require('../config/db');
const { sendOtp, verifyOtp } = require('../services/otpService');
let EmailTmp = '';
async function sendOtpForgotController(req, res) {
    const { Email } = req.body;
    try {
        const checkEmail = await sql.query`
            SELECT * FROM Users WHERE Email = ${Email}`;
        if (checkEmail.recordset.length === 0) {
            return res.status(400).json({ message: "Email chưa đăng ký, vui lòng kiểm tra lại!" });
        }
        await sendOtp(Email);
        EmailTmp = Email;
        res.json({ message: "Đã gửi OTP đến email của bạn" });
    } catch (err) {
        res.status(500).json({ message: "Gửi OTP thất bại", error: err.message });
    }
}

async function verifyOtpController(req, res) {
    try {
        const { OTP } = req.body;
        await verifyOtp(EmailTmp, OTP);
        return res.json({ message: "Xác thực OTP thành công" });
        // next();
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}
function getEmail() {
    return EmailTmp;
}
module.exports = {
    sendOtpForgotController,
    verifyOtpController,
    getEmail
};

const { loginService, registerService, resetPasswordService } = require('../services/authService');
const { verifyOtp, sendOtp } = require('../services/otpService');
const sql = require('../config/db')
const { getEmail } = require('../controllers/otpController');
const jwt = require('jsonwebtoken');

async function refreshToken (req, res){
    const refreshToken = req.cookies.refreshToken;
    console.log("REFRESH TOKEN:", refreshToken);
    if (!refreshToken) {
        return res.status(401).json({ message: 'Không có refresh token!' });
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Refresh token không hợp lệ!' });
        }

        const newAccessToken = jwt.sign(
            { UserID: user.UserID, Role: user.Role },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        return res.json({ accessToken: newAccessToken });
    });
};


async function login(req, res) {
    try {
        const result = await loginService(req.body);
        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: false, // bật true nếu dùng https
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ngày
        });

        res.json({
            message: "Đăng nhập thành công!",
            token: result.accessToken,
            ...result.user
        });
    } catch (err) {
        res.status(err.status || 500).json({
            message: err.message || "Lỗi server nội bộ"
          });
    }
}

let UserTmp = {
    Email: '',
    Username: '',
    PasswordHash: '',
    FullName: ''
}

async function register(req, res) {
    try {
        const { Email, Username, PasswordHash, FullName } = req.body;
        UserTmp.Email = Email;
        UserTmp.Username = Username;
        UserTmp.PasswordHash = PasswordHash;
        UserTmp.FullName = FullName;
        
        const checkEmail = await sql.query`SELECT * FROM Users WHERE Email = ${Email}`;
        if (checkEmail.recordset.length > 0) {
            return res.status(409).send({ message: 'Email đã được đăng kí', Error: 'already' });
        }    
        const checkUsername = await sql.query`SELECT * FROM Auth WHERE Username = ${Username}`
        if (checkUsername.recordset.length > 0) {
            return res.status(409).send({ message: 'Username đã tồn tại', Error: 'already' });
        }    
        await sendOtp(Email);
        return res.json({ message: 'Đã gửi mã OTP đến Email của bạn' });
    } catch (err) {
        res.status(err.status || 500).json({ message: "Lỗi: " + err.message });
    }
}
async function verifyRegister(req, res) {
    try {
        
        const { OTP } = req.body;
        console.log("OTP", OTP, getEmail());

        await verifyOtp(UserTmp.Email, OTP);

        const data = await registerService(UserTmp.Username, UserTmp.FullName, UserTmp.Email, UserTmp.PasswordHash, req.user);

        return res.status(200).send(data);

    } catch (err) {
        console.log("lỗi xác nhận đăng ký", err.message);
        return res.status(500).send({ message: err.message });
    }
}
async function resetPassword(req, res) {
    try {
        const { PasswordHash  } = req.body;
        await resetPasswordService(getEmail(), PasswordHash);
        res.json({ message: "Đặt lại mật khẩu thành công" });
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}
async function logOut(req, res) {
    try {
        req.user = null;
        return res.status(200).send("Đăng xuất thành công");
    } catch (err) {
        res.status(500).json({ err });
    }
}
module.exports = {
    login,
    register,
    resetPassword,
    logOut,
    verifyRegister,
    refreshToken
};

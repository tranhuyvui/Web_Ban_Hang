const sql = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

async function loginService({ Username, Password }) {
    const result = await sql.query`
        SELECT u.UserID, u.PasswordHash, a.FullName, a.Email, a.Role, a.Address, a.Phone
        FROM Auth u
        JOIN Users a ON u.UserID = a.UserID
        WHERE u.Username = ${Username}
    `;

    if (result.recordset.length === 0) {
        throw { status: 401 , message: "Sai tài khoản hoặc mật khẩu!" };
    }

    const user = result.recordset[0];
    const isMatch = await bcrypt.compare(Password, user.PasswordHash);
    if (!isMatch) {
        throw { status: 401 , message: "Sai tài khoản hoặc mật khẩu!" };
    }
    
    const accessToken = jwt.sign(
        { UserID: user.UserID, Role: user.Role },
        process.env.JWT_SECRET,
        { expiresIn: '2m' }
    );

    const refreshToken = jwt.sign(
        { UserID: user.UserID, Role: user.Role },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );
    return {
        accessToken,
        refreshToken,
        user: {
            FullName: user.FullName,
            Email: user.Email,
            Role: user.Role,
            Phone: user.Phone,
            Address: user.Address
        }
    };
}
async function registerService(Username, FullName, Email, PasswordHash, Role = "User", currentUser){
    
    
    if (currentUser && currentUser.Role !== "Admin") {
        throw { status: 403, message: "chỉ admin mới được tạo tài khoản!!" };
    }
    const result = await sql.query`
        INSERT INTO Users (FullName, Email, Role)
        OUTPUT INSERTED.UserID
        VALUES (${FullName}, ${Email}, ${Role})
    `;
    const UserID = result.recordset[0].UserID;
    await sql.query`
        INSERT INTO Auth (UserID, Username, PasswordHash)
        VALUES (${UserID}, ${Username}, ${PasswordHash})
    `;
    
    if (currentUser && currentUser.user.Role === "Admin") {
        return {
            message: "Admin đã tạo tài khoản thành công",
            newUser: {
                UserID,
                Username,
                FullName,
                Email,
                Role
            }
        };
    }
    return { message: "Đăng ký thành công" };
}
async function resetPasswordService(Email, PasswordHash) {
    const result = await sql.query`
        UPDATE a
        SET a.PasswordHash = ${PasswordHash}
        FROM Auth a
        JOIN Users u ON a.UserID = u.UserID
        WHERE u.Email = ${Email}
    `;
    return result;
}
module.exports = {
    loginService,
    registerService,
    resetPasswordService
}

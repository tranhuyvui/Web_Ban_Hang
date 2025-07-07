const jwt = require('jsonwebtoken');
const sql = require('../config/db');

const authenticateTokenProduct = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader || '';

    // console.log(token);
    if (!token) {
        req.user = null;
        return next();
    }
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            req.user = null; // Token không hợp lệ
            return next();
        }

        const result = await sql.query`SELECT * FROM Users WHERE UserID = ${decoded.UserID}`;
        if (result.recordset.length === 0) {
            req.user = null; // Tài khoản không tồn tại
            return next();
        }

        req.user = decoded; // Token hợp lệ và user còn tồn tại
        next();
    });
};

module.exports = { authenticateTokenProduct };

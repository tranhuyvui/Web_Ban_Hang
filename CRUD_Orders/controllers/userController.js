const sql = require('../config/db');
const bcrypt = require('bcryptjs')

async function getAllUser(req, res) {
    try {
        const UserID = req.user.UserID;
        if (req.user.Role === "User") {
            const checkUser = await sql.query`SELECT * FROM Users WHERE UserID = ${UserID}`;
            if (checkUser.recordset.length === 0) {
                return res.status(404).send("Không tìm thấy người dùng");
            }
            return res.send(checkUser.recordset[0]);
        }
        const result = await sql.query`SELECT * FROM Users`;
        return res.send(result.recordset);
    } catch (err) {
        res.status(500).send("Lỗi: " + err.message);
    }
}

async function getUserById(req, res) {
    try {
        const UserID = parseInt(req.params.UserID);
        
        if (req.user.UserID !== UserID && req.user.Role !== "Admin") {
            return res.status(403).send("Bạn không có quyền xem người dùng này!");
        }

        const result = await sql.query`SELECT * FROM Users WHERE UserID = ${UserID}`;
        if (result.recordset.length === 0) {
            return res.status(404).send("Không tìm thấy người dùng");
        }        

        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).send("Lỗi: " + err.message);
    }
}

async function deleteUser(req, res) {
    try {
        const UserID = req.user.Role === "User" ? req.user.UserID : req.params.UserID;
        if (req.user.Role === "Admin" && !UserID) {
            return res.status(404).send("Không có UserID người dùng nào để xóa");
        }
        await sql.query`DELETE FROM Orders WHERE UserID = ${UserID}`;
        await sql.query`DELETE FROM Auth WHERE UserID = ${UserID}`;
        await sql.query`DELETE FROM Users WHERE UserID = ${UserID}`;
        res.send("Xóa thành công");
    } catch (err) {
        res.status(500).send("Lỗi: " + err.message);
    }
}
async function UpdateUser(req, res) {
    try {

        const UserID = req.user.UserID;

        console.log(req.body, UserID);
        const { FullName, Phone, Address, Password } = req.body;
        if (!FullName && !Phone && !Address) {
            return res.status(400).send("Không có dữ liệu để cập nhật");
        }
        console.log(1);
        const check = await sql.query`SELECT * FROM Auth WHERE UserID = ${UserID}`;
        console.log(1.2);
        const checkPassword = await bcrypt.compare(Password, check.recordset[0].PasswordHash)
        console.log(1.5);
        console.log(checkPassword);
        if (!checkPassword) {
            return res.status(400).send("Mật khẩu k chính xác");
        }
        console.log(2);
        const curUserResult = await sql.query`SELECT * FROM Users WHERE UserID = ${UserID}`;
        const curUser = curUserResult.recordset[0];

        if (!curUser) {
            return res.status(404).send("Không tìm thấy người dùng");
        }
        console.log(3);

        await sql.query`
            UPDATE Users 
            SET FullName = ${FullName || curUser.FullName},
                Phone = ${Phone || curUser.Phone},
                Address = ${Address || curUser.Address}
            WHERE UserID = ${UserID}
        `;
        console.log(4);

        return res.json({ message: "Cập nhật thành công" });
    } catch (err) {
        return res.status(500).send("Lỗi cập nhật profile: " + err.message);    
    }
}

module.exports = {
    getAllUser,
    getUserById,
    deleteUser,
    UpdateUser
};

const e = require('express');
const sql = require('../config/db');

async function getCartByCartID(req, res) {
    // try {
    //     const CartID = parseInt(req.params.CartID);
    //     const result = await sql.query`
    //         SELECT o.*, p.ProductName, p.Sale
    //         FROM Carts o
    //         JOIN Products p ON o.ProductID = p.ProductID
    //         JOIN Orders
    //         WHERE o.CartID = ${CartID}
    //     `;


    //     if (result.recordset.length === 0) {
    //         return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        
    //     }
    //     const Cart = result.recordset[0];
        
    //     if (req.user.Role !== 'Admin' && req.user.UserID !== Cart.UserID) {
    //         return res.status(403).json({ message: "Bạn không có quyền truy cập đơn hàng này!" });
    //     }
    //     const userInfo = await sql.query`
    //         SELECT UserID, FullName, Email 
    //         FROM Users
    //         WHERE
    //             UserID = ${Cart.UserID}`;
                
    //     const resultUser = userInfo.recordset[0];
    //     const formattedCart = {
    //         CartID: Cart.CartID,
    //         CartDate: Cart.CartDate,
    //         Status: Cart.Status,
    //         user: {

    //             ...resultUser,

    //         },
    //         Product: {
    //             ProductID: Cart.ProductID,
    //             ProductName: Cart.ProductName,
    //             Quantity: Cart.Quantity,
    //             Price: Cart.Price,
    //             Sale: Cart.Sale
    //         }
    //     };
    //     return res.json({
    //         Cart: formattedCart
    //     });
    // } catch (err) {
    //     res.status(500).send("Lỗiiii: " + err.message);
    // }
}


async function getAllCarts(req, res) {
    try {
        const rawNow = new Date();
        const utcHour = rawNow.getUTCHours();
        const currentHour = (utcHour + 7) % 24;

        if (req.user.Role === "Admin") {
            const result = await sql.query`
                SELECT u.FullName, u.Email, o.*, p.*
                FROM Users u
                JOIN Cart o ON u.UserID = o.UserID
                JOIN Products p ON o.ProductID = p.ProductID
                ORDER BY o.CartDate DESC
            `;

            // if (result.recordset.length === 0) {
            //     return res.status(403).json({ message: "Hiện không có đơn hàng nào!" });
            // }

            const userInfo = result.recordset.map(element => {
                const from = element.SaleFromHour;
                const to = element.SaleToHour;
                const inSale = from != null && to != null && currentHour >= from && currentHour < to;

                return {
                    CartID: element.CartID,
                    CartDate: element.CartDate,
                    user: {
                        userID: element.UserID,
                        FullName: element.FullName,
                        Email: element.Email,
                    },
                    Product: {
                        ProductID: element.ProductID,
                        ProductName: element.ProductName,
                        Quantity: element.Quantity,
                        Price: element.Price,
                        Image: element.Image,
                        Sale: inSale && element.Sale > 0 ? element.Sale : (element.Sale / 2)
                    }
                };
            });
            return res.status(200).json(userInfo);
        } else {
            const userID = req.user.UserID;
            const CartsResult = await sql.query`    
                SELECT o.CartID, o.CartDate, o.Quantity, p.*
                FROM Cart o
                JOIN Products p ON o.ProductID = p.ProductID
                WHERE o.UserID = ${userID}
                ORDER BY o.CartDate DESC
            `;

            // if (CartsResult.recordset.length === 0) {
            //     return CartsResult.recordset[0];
            // }

            const userInfo = await sql.query`
                SELECT UserID, FullName, Email
                FROM Users
                WHERE UserID = ${userID}
            `;

            const userInfoResult = userInfo.recordset[0];

            const CartUser = CartsResult.recordset.map(element => {
                const from = element.SaleFromHour;
                const to = element.SaleToHour;
                const inSale = from != null && to != null && currentHour >= from && currentHour < to;

                return {
                    CartID: element.CartID,
                    CartDate: element.CartDate,
                    user: {
                        ...userInfoResult
                    },
                    Product: {
                        ProductID: element.ProductID,
                        ProductName: element.ProductName,
                        Quantity: element.Quantity,
                        Price: element.Price,
                        Image: element.Image,
                        Sale: inSale && element.Sale > 0 ? element.Sale : (element.Sale / 2)
                    }
                };
            });
            return res.json(CartUser);
        }
    } catch (err) {
        res.status(500).send("Lỗi: " + err.message);
    }
}



async function addCarts(req, res) {
    try {
        
        const userIdFromClient = req.user.Role === "User" ? req.user.UserID : req.body.UserID

        const { ProductID, Quantity } = req.body;
        const UserID = userIdFromClient;


        const checkUser = await sql.query`SELECT * FROM Users WHERE UserID = ${UserID}`;
        if (checkUser.recordset.length === 0) {
            return res.status(404).send("Không có User để thêm Carts");
        }

        const resultProduct = await sql.query`SELECT * FROM Products WHERE ProductID = ${ProductID}`;
        if (resultProduct.recordset.length === 0) {
            return res.status(404).send("Không tìm thấy sản phẩm với ProductID này!");
        }
        const curProduct = resultProduct.recordset[0];

        if (curProduct.Stock < Quantity) {
            return res.status(404).send(`số lượng đã vượt quá số lượng tồn kho ${curProduct.Stock}!`);
        }
        const userInfo = checkUser.recordset[0];
        await sql.query`
            INSERT INTO Cart (UserID, ProductID, Quantity)
            VALUES(${UserID}, ${ProductID}, ${Quantity})
        `;

        //cập nhật sl kho
        // await sql.query`
        //   UPDATE Products
        //   SET Stock = Stock - ${Quantity}
        //   WHERE ProductID = ${ProductID}
        // `;
        // console.log(1);
        const newCart = await sql.query`
            SELECT TOP 1 o.*, p.ProductName 
            FROM Cart o
            JOIN Products p ON o.ProductID = p.ProductID
            WHERE o.UserID = ${UserID}
            ORDER BY CartID DESC
        `;
        const resultCart = newCart.recordset.map(element => ({
            CartID: element.CartID, 
            CartDate: element.CartDate,
            Status: element.Status,

            product: {
                productID: element.ProductID,
                ProductName: element.ProductName,
                Quantity: element.Quantity
            }
        }))
        if (req.user.Role === "Admin") {
            const userInfo = await sql.query`SELECT UserID, FullName, Email FROM Users WHERE UserID = ${UserID}`
            const userResult = userInfo.recordset[0];
            res.status(201).json({
                message: "Thêm thành công đơn hàng!!!",
                user: userResult,
                Cart: resultCart
            });
        }
        else {
            res.status(201).json({
                message: "Thêm thành công đơn hàng!",
                Cart: resultCart
            });
        }

    } catch (err) {
        res.status(500).send("Lỗi: " + err.message);
    }
}

async function updateCart(req, res) {
    try {
        const CartID = parseInt(req.params.CartID);
        const { Quantity } = req.body;
        console.log(CartID, Quantity);
        if (isNaN(CartID)) {
            return res.status(401).send("CartID không hợp lệ");
        }

        if (!Number.isInteger(Quantity) || Quantity <= 0) {
            return res.status(400).send("Số lượng phải là số nguyên dương");
        }

        const CartRes = await sql.query`
            SELECT * FROM Cart WHERE CartID = ${CartID}
        `;
        if (CartRes.recordset.length === 0) {
            return res.status(404).send("Không tìm thấy đơn hàng");
        }
        const Cart = CartRes.recordset[0];
        const isOwner = req.user.UserID === Cart.UserID;
        const isAdmin = req.user.Role === "Admin";

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: "Bạn không có quyền sửa đơn hàng này!" });
        }

        const productRes = await sql.query`
            SELECT * FROM Products WHERE ProductID = ${Cart.ProductID}
        `;
        const product = productRes.recordset[0];

        const newStock = product.Stock + Cart.Quantity - Quantity;
        if (newStock < 0) {
            return res.status(400).send(`Không đủ hàng tồn kho. Còn lại: ${product.Stock + Cart.Quantity}`);
        }

        // await sql.query`
        //     UPDATE Products
        //     SET Stock = ${newStock}
        //     WHERE ProductID = ${Cart.ProductID}
        // `;

        // Cập nhật đơn hàng
        if (isAdmin) {
            await sql.query`
                UPDATE Cart 
                SET Quantity = ${Quantity}
                WHERE CartID = ${CartID}
            `;
        } else {
            await sql.query`
                UPDATE Cart
                SET Quantity = ${Quantity}
                WHERE CartID = ${CartID}
            `;
        }
        // Lấy lại thông tin đầy đủ đơn hàng
        const updatedRes = await sql.query`
            SELECT o.*, p.ProductName, p.Price, u.FullName, u.Email
            FROM Cart o
            JOIN Products p ON o.ProductID = p.ProductID
            JOIN Users u ON o.UserID = u.UserID
            WHERE o.CartID = ${CartID}
        `;
        const o = updatedRes.recordset[0];

        const resultCart = {
            CartID: o.CartID,
            CartDate: o.CartDate,
            Status: o.Status,
            user: {
                UserID: o.UserID,
                FullName: o.FullName,
                Email: o.Email,
                Phone: o.Phone,
                ShippingAddress: o.ShippingAddress
            },
            Product: {
                ProductID: o.ProductID,
                ProductName: o.ProductName,
                Quantity: o.Quantity,
                Price: o.Price
            }
        };

        return res.json({
            message: "Cập nhật đơn hàng thành công!",
            Cart: resultCart
        });

    } catch (err) {
        console.log(err);
        res.status(500).send("Lỗi: " + err.message);
    }
}

// function getStatusCart(status) {
//     switch (status) {
//         case 'Pending': return "Đơn hàng đang chờ xác nhận";
//         case 'Confirmed': return "Đơn hàng đã được xác nhận";
//         case 'Shipped': return "Đơn hàng đang được vận chuyển";
//         case 'Delivered': return "Đơn hàng đã giao thành công";
//         case 'Cancelled': return "Đơn hàng đã bị hủy";
//         default: return "Trạng thái đơn hàng không hợp lệ";
//     }
// }
async function deleteAllCarts(req, res) {
    try {
        await sql.query`DELETE FROM Cart`;
        return res.send("Xóa thành công");
    } catch (err) {
        console.log("Lỗi khi xóa tất cả giỏ hàng", err)
        return res.status(500).send("Lỗi khi xóa tất cả giỏ hàng", err);
    }
}
async function deleteCart(req, res) {
    try {
        const CartID = req.params.CartID;
        const checkCart = await sql.query`
            SELECT o.*, p.ProductName
            FROM Cart o
            JOIN Products p ON o.ProductID = p.ProductID
            WHERE CartID = ${CartID}
            `;
        if (checkCart.recordset.length === 0) {
            return res.status(404).send("Không tìm thấy đơn hàng");
        }

        const Cart = checkCart.recordset[0];
        if (req.user.UserID !== Cart.UserID && req.user.Role !== "Admin") {
            return res.status(403).json({
                message: "Bạn không có quyền xóa đơn hàng này!",
            });
        }
        await sql.query`DELETE FROM Cart WHERE CartID = ${CartID}`;

        const resultCart = {
            CartID: Cart.CartID,
            CartDate: Cart.CartDate,
            Status: "Cancelled",
            Product: {
                ProductID: Cart.ProductID,
                ProductName: Cart.ProductName,
                Quantity: Cart.Quantity
            },
            ShippingAddress: Cart.ShippingAddress,
            Phone: Cart.Phone
        };
        res.json({
            message: "Xóa thành công!",
            Cart: resultCart
        })

    } catch (err) {
        res.status(500).send("Lỗii: " + err.message);
    }
}
async function confirmCartByID(req, res) {
    // try {
    //     if (req.user.Role !== "Admin") {
    //         return res.status(500).json({ message: "Bạn không có quyền sửa đơn hàng!" });
    //     }
    //     const CartID = req.params.CartID;
    //     const checkCart = await sql.query`
    //         SELECT * FROM Carts WHERE CartID = ${CartID}`;
    //     if (checkCart.recordset.length === 0) {
    //         return res.status(403).json({ message: "Không tìm thấy đơn hàng!" });
    //     }
    //     if (checkCart.recordset[0].Status !== "Pending") {
    //         return res.json({ message: checkCart.recordset[0].Status + " trước đó" });
    //     }
    //     await sql.query`UPDATE Carts
    //         SET Status = ${"Confirmed"}    
    //         WHERE CartID = ${CartID}
    //     `
    //     //
    //     const result = await sql.query`
    //         SELECT o.*, p.ProductName
    //         FROM Carts o
    //         JOIN Products p ON p.ProductID = o.ProductID
    //         WHERE o.CartID = ${CartID}`
    //     const Cart = result.recordset[0];
    //     const resultCart = {
    //         CartID: Cart.CartID,
    //         CartDate: Cart.CartDate,
    //         Status: Cart.Status,
    //         Product: {
    //             ProductID: Cart.ProductID,
    //             ProductName: Cart.ProductName,
    //             Quantity: Cart.Quantity
    //         },
    //         ShippingAddress: Cart.ShippingAddress,
    //         Phone: Cart.Phone
    //     };
    //     res.status(200).json({ 
    //         message: "Xác nhận đơn hàng thành công!", 
    //         Cart: resultCart
    //     });
    // } catch (err) {
    //     res.status(500).send("Lỗi: " + err.message)
    // }
}

module.exports = {
    getCartByCartID,
    getAllCarts,
    addCarts,
    updateCart,
    deleteCart,
    confirmCartByID,
    deleteAllCarts
};

const e = require('express');
const sql = require('../config/db');

async function getOrderByOrderID(req, res) {
    // try {
    //     const OrderID = parseInt(req.params.OrderID);
    //     const result = await sql.query`
    //         SELECT o.*, p.ProductName, p.Sale
    //         FROM Orders o
    //         JOIN Products p ON o.ProductID = p.ProductID
    //         WHERE o.OrderID = ${OrderID}
    //     `;


    //     if (result.recordset.length === 0) {
    //         return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        
    //     }
    //     const order = result.recordset[0];
        
    //     if (req.user.Role !== 'Admin' && req.user.UserID !== order.UserID) {
    //         return res.status(403).json({ message: "Bạn không có quyền truy cập đơn hàng này!" });
    //     }
    //     const userInfo = await sql.query`
    //         SELECT UserID, FullName, Email 
    //         FROM Users
    //         WHERE
    //             UserID = ${order.UserID}`;
                
    //     const resultUser = userInfo.recordset[0];
    //     const formattedOrder = {
    //         OrderID: order.OrderID,
    //         OrderDate: order.OrderDate,
    //         Status: order.Status,
    //         user: {

    //             ...resultUser,
    //             Phone: order.Phone,
    //             ShippingAddress: order.ShippingAddress

    //         },
    //         Product: {
    //             ProductID: order.ProductID,
    //             ProductName: order.ProductName,
    //             Quantity: order.Quantity,
    //             Price: order.Price,
    //             Sale: order.Sale
    //         }
    //     };
    //     return res.json({
    //         order: formattedOrder
    //     });
    // } catch (err) {
    //     res.status(500).send("Lỗiiii: " + err.message);
    // }
}


async function getAllOrders(req, res) {
    try {
        const rawNow = new Date();
        const utcHour = rawNow.getUTCHours();
        const currentHour = (utcHour + 7) % 24;

        if (req.user.Role === "Admin") {
            const result = await sql.query`
                SELECT u.FullName, u.Email, o.*, p.ProductName, p.Price, p.Sale, p.Image
                FROM Users u
                JOIN Orders o ON u.UserID = o.UserID
                JOIN Products p ON o.ProductID = p.ProductID
                ORDER BY o.OrderDate DESC
            `;
            if (result.recordset.length === 0) {
                return res.status(403).json({ message: "Hiện không có đơn hàng nào!" });
            }
            const userInfo = result.recordset.map(element => {
                const from = element.SaleFromHour;
                const to = element.SaleToHour;
                const inSale = from != null && to != null && currentHour >= from && currentHour < to;
                return{
                    OrderID: element.OrderID,
                    OrderDate: element.OrderDate,
                    Status: element.Status,
                    user: {
                        userID: element.UserID,
                        FullName: element.FullName,
                        Email: element.Email,
                        Phone: element.Phone,
                        ShippingAddress: element.ShippingAddress
                    },
                    Product: {
                        ProductID: element.ProductID,
                        ProductName: element.ProductName,
                        Quantity: element.Quantity,
                        Price: element.Price,
                        Image: element.Image,
                        Sale: inSale && element.Sale > 0 ? element.Sale : (element.Sale / 2)
                    }
                }
            })
            return res.status(200).json(userInfo)
            
        } else {
            const userID = req.user.UserID;

            const ordersResult = await sql.query`
                SELECT o.*, p.ProductName, p.Price, P.Image, p.Sale, p.SaleFromHour, SaleToHour
                FROM Orders o
                JOIN Products p ON o.ProductID = p.ProductID
                WHERE o.UserID = ${userID}
                ORDER BY o.OrderDate DESC
            `;

            // if (ordersResult.recordset.length === 0) {
            //     return res.status(400).send({ message: "Bạn chưa có đơn hàng nào" });
            // }

            const userInfo = await sql.query`
                SELECT  UserID, FullName, Email
                FROM Users
                WHERE UserID = ${userID}
            `;

            const userInfoResult = userInfo.recordset[0];
            const orderUser = ordersResult.recordset.map(element => {
                const from = element.SaleFromHour;
                const to = element.SaleToHour;
                const inSale = from != null && to != null && currentHour >= from && currentHour <= to;
                return {
                    OrderID: element.OrderID,
                    OrderDate: element.OrderDate,
                    TotalPrice: element.TotalPrice,
                    Status: element.Status,
                    user: {
                    
                        ...userInfoResult,
                        Phone: element.Phone,
                        ShippingAddress: element.ShippingAddress
                    },
                    Product: {
                        ProductID: element.ProductID,
                        ProductName: element.ProductName,
                        Quantity: element.Quantity,
                        Price: element.Price,
                        Sale: inSale && element.Sale > 0 ? element.Sale : (element.Sale / 2),
                        Image: element.Image
                    }
                }
            })
            return res.status(200).json(orderUser);
        }
    } catch (err) {
        res.status(500).send("Lỗi: " + err.message);
    }
}

async function addOrders(req, res) {
    try {
        
        const userIdFromClient = req.user.Role === "User" ? req.user.UserID : req.body.UserID

        const { CartID, ShippingAddress, Phone } = req.body;
        const UserID = userIdFromClient;
        // console.log()
        const info = await sql.query`
            SELECT c.Quantity, c.ProductID, c.UserID, p.Price, p.Sale, p.SaleFromHour, p.SaleToHour
            FROM Cart c
            JOIN Users u ON u.UserID = c.UserID
            JOIN Products p ON p.ProductID = c.ProductID
            WHERE c.CartID = ${CartID}
        `
        if (info.recordset.length === 0) {
            return res.status(404).send("không có thông tin");
        }
        const userInfo = info.recordset[0];
        
        const rawNow = new Date();
        const utcHour = rawNow.getUTCHours();
        const currentHour = (utcHour + 7) % 24;
        const from = userInfo.SaleFromHour;
        const to = userInfo.SaleToHour;
        const inSale = from != null && to != null && from <= currentHour && currentHour <= to;

        let totalPrice = userInfo.Price * userInfo.Quantity;
        if (inSale) {
            totalPrice *= ((100 - userInfo.Sale) / 100)
        }
        else {
            totalPrice *= ((100 - (userInfo.Sale / 2)) / 100)
        }
        await sql.query`
            INSERT INTO Orders (UserID, ProductID, Quantity, ShippingAddress, Phone, Status, TotalPrice)
            VALUES(${UserID}, ${userInfo.ProductID}, ${userInfo.Quantity}, ${ShippingAddress}, ${Phone}, 'Pending', ${totalPrice})
        `;
        await sql.query`UPDATE Users 
            SET 
            Address = ${ShippingAddress},
            Phone = ${Phone}
            WHERE UserID = ${UserID} AND (Address IS NULL OR Address = '') 
            `
        //cập nhật sl kho
        await sql.query`
          UPDATE Products
          SET Stock = Stock - ${userInfo.Quantity}
          WHERE ProductID = ${userInfo.ProductID}
        `;
        const newOrder = await sql.query`
            SELECT TOP 1 o.*, p.ProductName 
            FROM Orders o
            JOIN Products p ON o.ProductID = p.ProductID
            WHERE o.UserID = ${UserID}
            ORDER BY OrderID DESC
        `;
        await sql.query`DELETE Cart WHERE Cart.CartID = ${CartID}`

        const resultOrder = newOrder.recordset.map(element => ({
            orderID: element.OrderID, 
            OrderDate: element.OrderDate,
            Status: element.Status,
            ShippingAddress: element.ShippingAddress,
            Phone: element.Phone,

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
                order: resultOrder
            });
        }
        else {
            res.status(201).json({
                message: "Thêm thành công đơn hàng!",
                order: resultOrder
            });
        }

    } catch (err) {
        console.log("Lỗi khi tạo đơn hàng", err);
        res.status(500).send("Lỗi: " + err.message);
    }
}

async function updateOrder(req, res) {
    try {
        const orderID = parseInt(req.params.OrderID);
        const { Quantity, Phone, ShippingAddress, Status } = req.body;

        if (isNaN(orderID)) {
            return res.status(ErrorOrder, ID400).send("OrderID không hợp lệ");
        }

        if (!Number.isInteger(Quantity) || Quantity <= 0) {
            return res.status(400).send("Số lượng phải là số nguyên dương");
        }

        const orderRes = await sql.query`
            SELECT * FROM Orders WHERE OrderID = ${orderID}
        `;
        if (orderRes.recordset.length === 0) {
            return res.status(404).send("Không tìm thấy đơn hàng");
        }

        const order = orderRes.recordset[0];
        const isOwner = req.user.UserID === order.UserID;
        const isAdmin = req.user.Role === "Admin";

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: "Bạn không có quyền sửa đơn hàng này!" });
        }

        if (order.Status !== "Pending" && !isAdmin) {
            return res.status(403).json({ message: `Không thể sửa đơn hàng khi trạng thái là ${order.Status}` });
        }

        const productRes = await sql.query`
            SELECT * FROM Products WHERE ProductID = ${order.ProductID}
        `;
        const product = productRes.recordset[0];

        const newStock = product.Stock + order.Quantity - Quantity;
        if (newStock < 0) {
            return res.status(400).send(`Không đủ hàng tồn kho. Còn lại: ${product.Stock + order.Quantity}`);
        }

        await sql.query`
            UPDATE Products
            SET Stock = ${newStock}
            WHERE ProductID = ${order.ProductID}
        `;

        // Cập nhật đơn hàng
        if (isAdmin) {
            await sql.query`
                UPDATE Orders 
                SET Quantity = ${Quantity},
                    Phone = ${Phone},
                    ShippingAddress = ${ShippingAddress},
                    Status = ${Status}
                WHERE OrderID = ${orderID}
            `;
        } else {
            await sql.query`
                UPDATE Orders 
                SET Quantity = ${Quantity},
                    Phone = ${Phone},
                    ShippingAddress = ${ShippingAddress}
                WHERE OrderID = ${orderID}
            `;
        }

        // Lấy lại thông tin đầy đủ đơn hàng
        const updatedRes = await sql.query`
            SELECT o.*, p.ProductName, p.Price, u.FullName, u.Email
            FROM Orders o
            JOIN Products p ON o.ProductID = p.ProductID
            JOIN Users u ON o.UserID = u.UserID
            WHERE o.OrderID = ${orderID}
        `;

        const o = updatedRes.recordset[0];

        const resultOrder = {
            OrderID: o.OrderID,
            OrderDate: o.OrderDate,
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
            order: resultOrder
        });

    } catch (err) {
        res.status(500).send("Lỗi: " + err.message);
    }
}

// function getStatusOrder(status) {
//     switch (status) {
//         case 'Pending': return "Đơn hàng đang chờ xác nhận";
//         case 'Confirmed': return "Đơn hàng đã được xác nhận";
//         case 'Shipped': return "Đơn hàng đang được vận chuyển";
//         case 'Delivered': return "Đơn hàng đã giao thành công";
//         case 'Cancelled': return "Đơn hàng đã bị hủy";
//         default: return "Trạng thái đơn hàng không hợp lệ";
//     }
// }

async function deleteOrder(req, res) {
    try {
        const OrderID = req.params.OrderID;
        const checkOrder = await sql.query`
            SELECT o.*, p.ProductName
            FROM Orders o
            JOIN Products p ON o.ProductID = p.ProductID
            WHERE OrderID = ${OrderID}
            `;
        if (checkOrder.recordset.length === 0) {
            return res.status(404).send("Không tìm thấy đơn hàng");
        }

        const order = checkOrder.recordset[0];
        if (req.user.UserID !== order.UserID && req.user.Role !== "Admin") {
            return res.status(403).json({
                message: "Bạn không có quyền xóa đơn hàng này!",
            });
        }
                      
        if (order.Status !== 'Pending') {
            return res.status(403).json({ message: `Bạn không thể xóa đơn hàng! ${order.Status}` })
        }

        // await sql.query`DELETE FROM Orders WHERE OrderID = ${OrderID}`;
        await sql.query`UPDATE Orders 
            SET Status = ${"Cancelled"}
            WHERE OrderID = ${OrderID}`
            
        await sql.query`
            UPDATE Products
            SET Stock = Stock + ${order.Quantity}
            WHERE ProductID = ${order.ProductID}
            `;
        
        const resultOrder = {
            OrderID: order.OrderID,
            OrderDate: order.OrderDate,
            Status: "Cancelled",
            Product: {
                ProductID: order.ProductID,
                ProductName: order.ProductName,
                Quantity: order.Quantity
            },
            ShippingAddress: order.ShippingAddress,
            Phone: order.Phone
        };
        res.json({
            message: "Xóa thành công!",
            Order: resultOrder
        })

    } catch (err) {
        res.status(500).send("Lỗii: " + err.message);
    }
}
async function confirmOrderByID(req, res) {
    try {
        if (req.user.Role !== "Admin") {
            return res.status(500).json({ message: "Bạn không có quyền sửa đơn hàng!" });
        }
        const OrderID = req.params.OrderID;
        const checkOrder = await sql.query`
            SELECT * FROM Orders WHERE OrderID = ${OrderID}`;
        if (checkOrder.recordset.length === 0) {
            return res.status(403).json({ message: "Không tìm thấy đơn hàng!" });
        }
        if (checkOrder.recordset[0].Status !== "Pending") {
            return res.json({ message: checkOrder.recordset[0].Status + " trước đó" });
        }
        await sql.query`UPDATE Orders
            SET Status = ${"Confirmed"}    
            WHERE OrderID = ${OrderID}
        `
        //
        const result = await sql.query`
            SELECT o.*, p.ProductName
            FROM Orders o
            JOIN Products p ON p.ProductID = o.ProductID
            WHERE o.OrderID = ${OrderID}`
        const order = result.recordset[0];
        const resultOrder = {
            OrderID: order.OrderID,
            OrderDate: order.OrderDate,
            Status: order.Status,
            Product: {
                ProductID: order.ProductID,
                ProductName: order.ProductName,
                Quantity: order.Quantity
            },
            ShippingAddress: order.ShippingAddress,
            Phone: order.Phone
        };
        res.status(200).json({ 
            message: "Xác nhận đơn hàng thành công!", 
            order: resultOrder
        });
    } catch (err) {
        res.status(500).send("Lỗi: " + err.message)
    }
}

module.exports = {
    getOrderByOrderID,
    getAllOrders,
    addOrders,
    updateOrder,
    deleteOrder,
    confirmOrderByID
};

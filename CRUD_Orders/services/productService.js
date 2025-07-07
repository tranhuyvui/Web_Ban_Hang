const sql = require('../config/db');



async function getAllProduct(isAdmin) {
    let result;

    if (isAdmin === 'Admin') {
        result = await sql.query`SELECT * FROM Products`;
    } else {
        result = await sql.query`SELECT * FROM Products WHERE IsDeleted = 0`;
    }

    if (result.recordset.length === 0) {
        return null;
    }

    // Lấy giờ hiện tại theo giờ Việt Nam
    const rawNow = new Date();
    const utcHour = rawNow.getUTCHours();
    const currentHour = (utcHour + 7) % 24;
    
    // Xử lý danh sách sản phẩm
    const products = result.recordset.map(product => {
        const from = product.SaleFromHour;
        const to = product.SaleToHour;

        const isInSaleHour = from != null && to != null && currentHour >= from && currentHour < to;
        const saleValue = isInSaleHour && parseFloat(product.Sale) > 0 ? parseFloat(product.Sale) : parseFloat(product.Sale / 2);
        return {
            ...product,
            Sale: saleValue
        };
    });

    return products;
}


async function getProductByID(isAdmin, ProductID) {
    const rawNow = new Date()
    const utcHour = rawNow.getUTCHours()
    const currentHour = (utcHour + 7) % 24;
    if (isAdmin === "Admin") {
        const result = await sql.query`SELECT * FROM Products WHERE ProductID = ${ProductID}`;
        if (result.recordset.length === 0) return null;
        const info = result.recordset[0];
        const from = info.SaleFromHour;
        const to = info.SaleToHour;
        const inSale = info.Sale > 0 && from != null && to != null && from <= currentHour && currentHour <= to;
        if (!inSale && info.Sale > 0) {
            info.Sale = info.Sale / 2;
        }
        return info;

    }
    else {
        const result = await sql.query`SELECT * FROM Products WHERE ProductID = ${ProductID} AND IsDeleted = ${0}`;
        if (result.recordset.length === 0) return null;
        const info = result.recordset[0];
        const from = info.SaleFromHour;
        const to = info.SaleToHour;
        const inSale = info.Sale > from != null && to != null && from <= currentHour && currentHour <= to;
        if (!inSale && info.Sale > 0) {
            info.Sale = info.Sale / 2;
        }
        return info;
    }
}

async function addProduct(newProduct) {
    try {
        const { ProductName, Description, Price, Stock, Sale, SaleFromHour, SaleToHour } = newProduct;
        if (!ProductName || Price == null || Stock == null) {
            throw new Error("Thiếu thông tin sản phẩm: ProductName, Price hoặc Stock.");
        }        
        const result = await sql.query`INSERT INTO Products 
            (ProductName, Description, Price, Stock, Image, SaleFromHour, SaleToHour)
            OUTPUT INSERTED.*
            VALUES (${ProductName}, ${Description || "không có"}, ${Price}, ${Stock}, ${Image}, ${Sale}, ${SaleFromHour}, ${SaleToHour})
            `
        return result.recordset[0];
    } catch (err) {
        console.log("Lỗi khi thêm sản phẩm: ", err);
        throw err;
    }
}
async function deleteProduct(ProductID) {
    try {
        const checkProduct = await sql.query`SELECT * FROM Products WHERE ProductID = ${ProductID}`
        if (checkProduct.recordset.length === 0) {
            // res.status(404).json({ message: "Không tìm thấy sản phẩm!" });
            return null;
        }
        const result = await sql.query`
            UPDATE Products
            SET IsDeleted = 1
            OUTPUT INSERTED.*
            WHERE ProductID = ${ProductID};
        `

        return result.recordset[0];

    } catch (err) {
        console.error("Lỗi khi xóa sản phẩm!", err.message);
        throw err;
    }
}
async function updateProduct(ProductID, updateData) {
    try {
        const curProduct = await sql.query`
            SELECT * FROM Products WHERE ProductID = ${ProductID}
        `;

        if (curProduct.recordset.length === 0) {
            return null; 
        }

        const current = curProduct.recordset[0];
        const { ProductName, Description, Price, Stock, Image, IsDeleted, Sale, SaleFromHour, SaleToHour } = updateData;
        
        const result = await sql.query`
            UPDATE Products
            SET
                ProductName = ${ProductName || current.ProductName},
                Description = ${Description || current.Description},
                Price = ${Price || current.Price},
                Stock = ${Stock || current.Stock},
                Sale = ${Sale},
                SaleFromHour = ${SaleFromHour},
                SaleToHour = ${SaleToHour},
                Image = ${Image},
                IsDeleted = ${IsDeleted}
            OUTPUT INSERTED.*
            WHERE ProductID = ${ProductID}
        `;

        return result.recordset[0];

    } catch (err) {
        console.error("Lỗi khi sửa sản phẩm!", err.message);
        throw err;
    }
}

module.exports = {
    getAllProduct,
    addProduct,
    deleteProduct,
    updateProduct,
    getProductByID
}
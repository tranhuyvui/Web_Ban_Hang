const sql = require('../config/db');

const productService  = require('../services/productService');

async function getAllProductController(req, res) {
    try {
        let role = '';
        if (req.user) {
            role = req.user.Role;
        }
        else {
            role = "User";
        }
        const result = await productService.getAllProduct(role);
        if (!result) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm nào!" });
        }
        res.status(200).json(result);
    } catch (err) {
        console.log("Lỗi khi lấy tất cả sản phẩm: ", err);
        res.status(500).json({ error:  err.message});
    }   
}
async function getProductByIDController(req, res) {
    try {
        let role = '';
        if (req.user) {
            role = req.user.Role;
        }
        else {
            role = "User";
        }
        const result = await productService.getProductByID(role, req.params.ProductID);
        if (!result) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm!" });
        }
        res.status(200).json(result);
    } catch (err) {
        console.log("Lỗi khi lấy sản phẩm: ", err);
        res.status(500).json({ error:  err.message});
    }   
}
async function addProductController(req, res) {
    try {
        if (req.user.Role !== "Admin") {
            return res.status(403).send("Bạn không có quyền thêm sản phẩm này!");
        }
        const newProduct = req.body;
        const result = await productService.addProduct(newProduct);
        res.status(200).json({
            message: "Thêm thành công",
            product: result
        })
    } catch (err) {
        res.status(500).send(`Lỗi khi thêm sản phẩm: ` + err.message);
    }
}
async function deleteProductController(req, res) {
    try {
        if (req.user.Role !== "Admin") {
            return res.status(403).send("Bạn không có quyền xóa sản phẩm này!");
        }
        const ProductID = req.params.ProductID;
        const result = await productService.deleteProduct(ProductID);
        if (!result) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm cần xóa!" });
        }
        res.status(200).json({
            message: "Xóa thành công",
            product: result
        })
    } catch (err) {
        res.status(500).send(`Lỗi khi xóa sản phẩm: ` + err.message);
    }    
}
async function updateProductController(req, res) {
    try {
        if (req.user.Role !== "Admin") {
            return res.status(403).send("Bạn không có quyền sửa sản phẩm này!");
        }
        const ProductID = req.params.ProductID;
        const updated = await productService.updateProduct(ProductID, req.body);

        if (!updated) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm để sửa!" });
        }

        res.status(200).json({ message: "Sửa thành công", product: updated });

    } catch (err) {
        res.status(500).send("Lỗi khi sửa sản phẩm: " + err.message);
    }
}
async function getTopSellingProducts(req, res) {
    try {
        const rawNow = new Date();
        const utcHour = rawNow.getUTCHours();
        const currentHour = (utcHour + 7) % 24;

        const result = await sql.query`
            SELECT TOP 10
                p.ProductID, p.ProductName, p.Image, p.Price, p.Sale, p.Stock,
                p.SaleFromHour, p.SaleToHour, p.Description,
                SUM(o.Quantity) as Total
            FROM Orders o
            JOIN Products p ON o.ProductID = p.ProductID
            GROUP BY 
                p.ProductID, p.ProductName, p.Image, p.Price, p.Sale, p.Stock, p.SaleFromHour, p.SaleToHour, p.Description
            ORDER BY Total DESC

        `;

        if (result.recordset.length === 0) {
            return res.status(404).send({ message: 'Không có sản phẩm bán chạy' });
        }

        const products = result.recordset.map(p => {
            const from = p.SaleFromHour;
            const to = p.SaleToHour;
            const inSale = from != null && to != null && currentHour >= from && currentHour < to;
            return {
                ...p,
                Sale: inSale && p.Sale > 0 ? p.Sale : (p.Sale / 2)
            };
        });

        return res.status(200).json(products);
    } catch (err) {
        console.log("Lỗi lấy selling: ", err);
        return res.status(500).send("Lỗi lấy sản phẩm selling!", err);
    }
}

async function getNewProduct(req, res) {
    try {

        const rawNow = new Date();
        const utcHour = rawNow.getUTCHours();
        const currentHour = (utcHour + 7) % 24;

        const result = await sql.query`
            SELECT TOP 10 *
            FROM Products
            ORDER BY CreatedAt DESC
        `;

        if (result.recordset.length === 0) {
            return res.status(404).send({ message: 'Không có sản phẩm nào' });
        }

        const products = result.recordset.map(p => {
            const from = p.SaleFromHour;
            const to = p.SaleToHour;
            const inSale = from != null && to != null && currentHour >= from && currentHour < to;

            return {
                ...p,
                Sale: inSale && p.Sale > 0 ? p.Sale : (p.Sale / 2)
            };
        });

        return res.status(200).json(products);
    } catch (err) {
        console.log("Lỗi khi lấy sản phẩm mới ra mắt", err);
        return res.status(500).json('lỗi khi lấy sản phẩm mới ra mắt', err);
    }
}
async function findProduct(req, res) {
    try {
        const { name } = req.query;
        const rawNow = new Date();
        const utcHour = rawNow.getUTCHours();
        const currentHour = (utcHour + 7) % 24;
        
        const result = await sql.query`
            SELECT *
            FROM Products
            WHERE ProductName LIKE ${'%' + name + '%'}
        `;

        if (result.recordset.length === 0) {
            return res.status(400).send("Không tìm thấy sản phẩm");
        }

        const products = result.recordset.map(p => {
            const from = p.SaleFromHour;
            const to = p.SaleToHour;
            const inSale = from != null && to != null && currentHour >= from && currentHour < to;
            return {
                ...p,
                Sale: inSale && p.Sale > 0 ? p.Sale : (p.Sale / 2)
            };
        });

        return res.status(200).json(products);
    } catch (err) {
        console.log("Lỗi khi tìm kiếm sản phẩm", err);
        return res.status(500).json('lỗi khi tìm sản phẩm', err);
    }
}

module.exports = {
    getAllProductController,
    addProductController,
    deleteProductController,
    updateProductController,
    getProductByIDController,
    getTopSellingProducts,
    getNewProduct,
    findProduct
    
}
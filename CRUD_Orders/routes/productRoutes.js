const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authMiddleware');
const productController = require('../controllers/productController');
const handleValidation = require('../middlewares/handleValidation');
const  {authenticateTokenProduct}  = require('../middlewares/authMiddlewareProduct');
const {validatorAddProduct,
    validatorUpdateProduct,
    validatorGetProductByID,
    validatorDeleteProduct
} = require('../middlewares/validatorProduct')


router.get('/top-selling', productController.getTopSellingProducts);
router.get('/new', productController.getNewProduct);
router.get('/find-product', authenticateTokenProduct, productController.findProduct);
router.put('/:ProductID', authenticateToken, validatorUpdateProduct, handleValidation, productController.updateProductController);
router.get('/', authenticateTokenProduct, productController.getAllProductController);
router.get('/:ProductID',authenticateTokenProduct, validatorGetProductByID, handleValidation, productController.getProductByIDController);
router.post('/', authenticateToken, validatorAddProduct, handleValidation, productController.addProductController);
router.delete('/:ProductID', authenticateToken, validatorDeleteProduct, handleValidation, productController.deleteProductController);

module.exports = router;


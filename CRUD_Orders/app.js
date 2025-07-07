const express = require('express');
const app = express();
const routerUsers = require('./routes/userRoutes');
const routerOrders = require('./routes/orderRoutes');
const routerAuth = require('./routes/authRoutes');
const routerProduct = require('./routes/productRoutes');
const routerUpload = require('../CRUD_Orders/routes/uploadRoutes');
const routerCart = require('./routes/cartRoutes');
const cors = require('cors');
const path = require('path');


app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',   // 👈 CHỈ ĐỊNH RÕ FE
    credentials: true                  // 👈 Cho phép gửi cookie
  }));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use('/uploads/images', express.static(path.join(__dirname, 'uploads/images')));

app.use('/api/carts', routerCart);
app.use('/api/auth', routerAuth);
app.use('/api/users', routerUsers);
app.use('/api/orders', routerOrders);
app.use('/api/products', routerProduct);
app.use('/api/uploads', routerUpload);

app.listen(3000, () => {
    console.log("server đang chạy!");
})